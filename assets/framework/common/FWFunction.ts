import { _decorator, assert, Asset, AudioClip, AudioSource, Button, Component, Constructor, director, EventHandler, instantiate, log, Node, Pool, Prefab, RenderRoot2D, UITransform, Widget } from 'cc';
import { Vec2, v2, Vec3, v3, Vec4, v4 } from 'cc';
import { FWUIDialog } from '../ui/FWUIDialog';
import { constant } from './FWConstant';
import { FWUILoading } from '../ui/FWUILoading';
import { Log } from './FWLog';
import { FWTimer } from './FWTimer';

interface PromiseEx {
    // 用于中断 promise 的执行
    shouldContinue:boolean,
}

export class Functions {
    static doPromise<T>(executor: (resolve: (value?: T ) => void, reject: (reason?: Error) => void) => void) {
        return <Promise<T>> new Promise<T>((resolveEx, rejectEx) => {
                executor(resolveEx, rejectEx);
            });
    }

    static doPromiseEx<T>(executor: (resolve: (value?: T ) => void, reject: (reason?: Error) => void) => void, data:PromiseEx) {
        return <Promise<T>> new Promise<T>((resolveEx, rejectEx) => {
                if(data.shouldContinue != false) {
                    executor(resolveEx, rejectEx);
                }
            });
    }

    static doNextTick(func:(dt?:number)=>void) {
        FWTimer.scheduleOnce(func, app, 0);
    }

    static dosomething(tasks = [],onProgress?:(finished: number, failCount:number) => void) {
        let successCount = 0, failCount = 0;
        return Promise.all(
            tasks.map(func => {
                return func()
                  .then((res) => {
                      successCount++;
                      onProgress?.(successCount,failCount);
                      return Promise.resolve(res);
                  }).catch((err) => {
                      failCount++;
                      onProgress?.(successCount,failCount);
                      return Promise.reject(err);
                  })
            })
        );
    }

    static toUpperFirst(str:string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static isFunction(obj) {
        return typeof obj === 'function';
    }

    static loadScript(url: string, callback: () => void) {
        const script = document.createElement(`script`);
        script.src = url;
        script.async = true;
        script.defer = true;
        script.crossOrigin = `anonymous`;
        // 脚本加载完成后的回调函数
        script.onload = callback;
        // 将脚本添加到页面中
        document.head.appendChild(script);
    }
    
    static stringToColor(str) {
        // 将字符串转换为哈希值
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        // 生成随机颜色
        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }
}

export const func = Functions


export class quickAsset {
    static getAsset<T extends Asset>(bundleName:string,path:string,type?:Constructor<T>) {
        return func.doPromise<T>((resolve,reject)=>{
            let bundle = app.manager.asset.getBundle(bundleName);
            assert(bundle,`bundle ${bundleName} not exist`);
            bundle.load({
                paths: path,
                assetType: type,
                onComplete: (err,res:T) => {
                    if(err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                }
            })
        })
    }

    static loadAsset<T extends Asset>(bundleName:string,path:string,type?:Constructor<T>) {
        return func.doPromise<T>((resolve,reject)=>{
            app.manager.asset.loadBundle({
                name: bundleName,
                onComplete: (err,bundle) => {
                    if(err) {
                        reject(err)
                    } else {
                        bundle.load({
                            paths: path,
                            assetType: type,
                            onComplete: (err,res:T) => {
                                if(err) {
                                    reject(err)
                                } else {
                                    resolve(res)
                                }
                            }
                        })
                    }
                }
            })
        })
    }
}

export const qAsset = quickAsset


export class UIFunctions {
    static pos(x: number | Vec2 | Vec3 = 0, y: number = 0, z: number = 0) {
        if (typeof (x)!= `number`) {
            x = <Vec3>(x);
            y = x.y ?? 0;
            z = x.z ?? 0;
            x = x.x ?? 0;
        }
        constant.v3.set(x, y, z);
        return constant.v3;
    }

    static scale(x: number | Vec2 | Vec3 = 1, y: number = 1, z: number = 1) {
        if (typeof (x)!= `number`) {
            x = <Vec3>(x);
            y = x.y ?? 1;
            z = x.z ?? 1;
            x = x.x ?? 1;
        } else if(arguments.length == 1) {
            y = x;
            z = x;
            x = x;
        }
        constant.v3.set(x, y, z);
        return constant.v3;
    }

    static newNodeWidget(name?:string) {
        let node = new Node(name);
        let uiTran = node.addComponent(UITransform);
        let widget = node.addComponent(Widget);
        widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
        widget.top = 0;
        widget.left = 0;
        widget.right = 0;
        widget.bottom = 0;
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        return node;
    }

    static showDialog(config: {
        path: string
        bundleName: string
    },data?:any) {
        return app.manager.ui.showDialog(config,data);
    }
    static showLoading(loading:FWUILoading) {
        app.manager.ui.showLoading(loading);
    }

    static onClick(target:Node|Button,callback:Function) {
        let node:Node;
        if(target instanceof Node) {
            node = target;
            target = target.getComponent(Button);
        } else {
            node = target.node;
        }
        node.off(Button.EventType.CLICK)
        node.on(Button.EventType.CLICK, callback);
    }

    static onClickSfx(target:Node|Button,callback:Function,clip: AudioClip = constant.button_click_sfx_clip) {
        let node:Node;
        if(target instanceof Node) {
            node = target;
            target = target.getComponent(Button) ?? target.addComponent(Button);
        } else {
            node = target.node;
        }
        node.off(Button.EventType.CLICK)
        node.on(Button.EventType.CLICK, callback);
        node.on(Button.EventType.CLICK, ()=>{
            if(clip) {
                app.manager.audio.playSfx(clip);
            }
        });
    }

    static newButton(name?:string) {
        let prefab = app.manager.asset.getBundle("framework").get("res/prefab/UIButton",Prefab);
        let node = instantiate(prefab);
        return node;
    }

    static asyncAssert(obj:Node|Component) {
        if(!obj.isValid) {
            throw new Error("obj had been destroy");
        }
    }
}

export const uiFunc = UIFunctions


JSON.safeParse = function (text: string, reviver?: (this: any, key: string, value: any) => any) {
    try {
        return JSON.parse(text,reviver);
    } catch (error) {
        Log.printError(error);
    }
    return null;
}

declare global {
    namespace globalThis {
        interface JSON {
            safeParse(text: string, reviver?: (this: any, key: string, value: any) => any): any;
        }
    }
}