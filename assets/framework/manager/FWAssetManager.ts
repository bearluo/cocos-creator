import { _decorator, Asset, assetManager, AssetManager, Component, Constructor, Eventify, EventTarget, instantiate, js, Node } from 'cc';
import { FWBaseManager } from './FWBaseManager';
import { func } from '../common/FWFunction';
import { NATIVE } from 'cc/env';
import { log } from '../common/FWLog';
import { Events } from '../events/FWEvents';
import { FWManager } from './FWManager';
const { ccclass, property } = _decorator;

/** js 系统 */
const system_js = self["System"];
/**类注册缓存 */
const script_cache_tab: Record<string, any> = system_js[Reflect.ownKeys(system_js).find((v) => typeof v === "symbol")];


interface IBundleData {
    name: string;
    option?: {
        [k: string]: any;
        version?: string;
    };
    onComplete?:(err: Error,bundle:FWBundle)=>void;
}

@ccclass('FWAssetManager')
export class FWAssetManager extends FWBaseManager {
    /**loadRemote缓存 */
    public loadRemoteCache: Map<string, Asset> = new Map()
    public bundleVersion: Map<string, string> = new Map()

    public bundles:Map<string,FWBundle> = new Map()
    /**
     * 加载子包
     * @param data 
     */
    loadBundle(data:IBundleData) {
        let {name : bundleName,option,onComplete} = data;
        func.doPromise<FWBundle>((resolve, reject) => {
            const cacheBundle = this.getBundle(bundleName);
            if (cacheBundle) {
                resolve(cacheBundle);
            } else {
	            // 加载对应版本的资源包
	            // 不存在就用上一次加载的版本
	            // if (this.bundleVersion.has(tempName)) {
	            //     option.version = this.bundleVersion.get(tempName);
	            // }
                assetManager.loadBundle(bundleName, option, (err, bundle) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (this.bundles.has(bundleName)) {
                            resolve(this.bundles.get(bundleName));
                        } else {
                            let fwBundle = new FWBundle(bundle);
                            this.bundles.set(bundleName,fwBundle);
                            resolve(fwBundle)
                        }
                    }
                });
            }
        })
        .then((bundle)=>{
            // fw.language.addBundleAutoLanguageConfig(tempName);
            onComplete?.(null,bundle);
        })
        .catch((err: Error)=>{
            onComplete?.(err,null);
        });
    }
    /**
     * 获得已加载的子包
     * @param bundleName 
     * @returns 
     */
    getBundle(bundleName: string) {
        return this.bundles.get(bundleName)
    }
    /**
     * 卸载子包
     * @param nameOrBundle 
     */
    unloadBundle(nameOrBundle: (string | AssetManager.Bundle) | (string | AssetManager.Bundle)[]) {
        let bundleNames = ((nameOrBundle instanceof Array) ? nameOrBundle : [nameOrBundle]).map(element => element instanceof AssetManager.Bundle ? element.name : element);
        bundleNames.forEach(bundleName=>{
            // 删除对应资源引用计数
            let fwBundle = this.getBundle(bundleName)
            if (fwBundle) {
                this.bundles.delete(bundleName);
                fwBundle._onDestroy();
            }
        })
    }
    
}

interface IAssetData<T extends Asset> {
    paths: string|string[];
    assetType?: Constructor<T>;
    onProgress?:(finished: number, total: number, item: AssetManager.RequestItem) => void;
    onComplete?:(err: Error | null, data: T|T[]) => void;
}

export class FWBundle {
    /**loadBundleRes缓存 */
    resCache: Map<string, Asset> = new Map()
    bundle:AssetManager.Bundle;
    constructor(bundle:AssetManager.Bundle) {
        this.bundle = bundle;
    }

    /**
     * 动态加载的资源需要手动释放或者卸载子包自动释放
     * @param data 
     */
    load<T extends Asset>(data:IAssetData<T>) {
        let {paths,assetType,onProgress,onComplete} = data;
        let __outputAsArray__ = false
        paths = Array.isArray(paths) ? (__outputAsArray__ = true) && paths : [paths];
        this.bundle.load(paths,assetType,onProgress,(err: Error | null, data: T[]) =>{
            if (err) {
                onComplete?.(err,null);
            } else {
                for (let index = 0; index < paths.length; index++) {
                    this._cacheRes<T>(paths[index],assetType,data[index])
                }
                if (__outputAsArray__) {
                    onComplete?.(null,data);
                } else {
                    onComplete?.(null,data[0]);
                }
            }
        })
    }

    get<T extends Asset>(path: string, type?: Constructor<T> | null): T | null {
        return this.bundle.get(path,type)
    }

    private _cacheRes<T extends Asset>(path: string,assetType: Constructor<T>, res: Asset) {
        let info = this.bundle.getInfoWithPath(path,assetType)
        if( info ) {
            let uuid = info.uuid;
            if (!this.resCache.has(uuid)) {
                this.resCache.set(uuid,res);
                res.addRef();
            } else {
                log.printWarn(`path:${path} uuid:${uuid} is already cached`)
            }
        }
    }
    /**
     * 这里释放存在问题相同路径可能存在多个资源
     * @param paths 
     */
    release<T extends Asset>(path: string,assetType: Constructor<T>) {
        let info = this.bundle.getInfoWithPath(path,assetType)
        if( info ) {
            let uuid = info.uuid;
            let res = this.resCache.get(uuid);
            if (res) {
                this.resCache.delete(uuid);
                res.decRef(false);
            }
            this.bundle.release(path,assetType);
        }
    }

    /**
     * 该方法只在native端生效 h5端采用不同md5的js文件来更新代码
     * 卸载缓存子包脚本 
     * 请不要卸载main 如果 main 更新请重启模拟器
    */
    private _unloadScriptCache() {
        if (NATIVE) {
            let bundleName = this.bundle.name;
            //刷新子包脚本配置
            log.print(`unloadBundleScriptCache: ${bundleName} begin`);
            //删除代码缓存
            assetManager.downloader.undownloadBundleScriptCache?.(bundleName);
            let prerequisiteImportsKey = `virtual:///prerequisite-imports/${bundleName}`
            let virtualKey = `chunks:///_virtual/${bundleName}`
            let bundle_root = script_cache_tab[virtualKey]
            let unregisterClassArray: Function[] = []
            if (bundle_root) {
                bundle_root.d.forEach((v: { id: string, C: {} }) => {
                    let C = v.C;
                    //获取卸载的class
                    for (const key in C) {
                        let val = C[key];
                        if (val instanceof Function) {
                            unregisterClassArray.push(val)
                        }
                    }
                    delete script_cache_tab[v.id];
                    delete system_js["registerRegistry"][v.id];
                });
                delete script_cache_tab[virtualKey];
                delete system_js["registerRegistry"][virtualKey];
                delete script_cache_tab[prerequisiteImportsKey];
                delete system_js["registerRegistry"][prerequisiteImportsKey];
            }
            js.unregisterClass(...unregisterClassArray);
        }
    }

    /**
     * 释放bundle
     */
    destroy() {
        app.manager.asset.unloadBundle(this.bundle.name);
    }

    _onDestroy() {
        let bundleName = this.bundle.name;
        this.resCache.forEach(res=>res.decRef(false));
        this.resCache.clear();

        log.print(`unloadBundle: ${bundleName}`);
        //释放资源
        this.bundle.releaseUnusedAssets();
        //卸载子包
        assetManager.removeBundle(this.bundle);
        //卸载缓存子包脚本
        this._unloadScriptCache();
        //清理自动添加的多语言配置
        // TODO
        // fw.language.delBundleAutoLanguageConfig(bundleName);
        app.manager.asset.emit(Events.onBundleRlease,this);
        log.print(`unloadBundle end: ${bundleName}`);
    }
}

FWManager.register("asset",new FWAssetManager())

declare global {
    namespace globalThis {
        interface IFWManager {
            asset : FWAssetManager
        }
    }
}
