import { _decorator, assert, Asset, AudioClip, AudioSource, Component, Constructor, director, log, Node, Pool, RenderRoot2D, UITransform, Widget } from 'cc';
import { Vec2, v2, Vec3, v3, Vec4, v4 } from 'cc';
import { FWUIDialog } from '../ui/FWUIDialog';
import { constant } from './FWConstant';
import { FWUILoading } from '../ui/FWUILoading';

interface PromiseEx {
    // 用于中断 promise 的执行
    shouldContinue:boolean,
}

export class Function {
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

    static toUpperFirst(str:string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static isFunction(obj) {
        return typeof obj === 'function';
    }

    
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
}

export const func = Function


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
            })
        })
    }
}

export const qAsset = quickAsset


export class UIFunction {
    static showDialog(dialog: FWUIDialog,data?:any) {
        app.manager.ui.showDialog(dialog,data);
    }
    static showLoading(loading:FWUILoading) {
        app.manager.ui.showLoading(loading);
    }
}

export const uiFunc = UIFunction