import { _decorator, AssetManager, assetManager, Component, Director, director, Node } from 'cc';
import { FWApplication } from './framework/FWApplication';
const { ccclass, property } = _decorator;

/**
 * 需要修改入口的bundle 加载顺序
 */
@ccclass('scene')
export class scene extends Component {
    protected onLoad(): void {
        this._init();
    }

    start() {
    }

    update(deltaTime: number) {
        
    }

    async _init() {
        await this.loadBundle("framework");
        await this.loadBundle("demo");
        !globalThis.app && new FWApplication();
        app.manager.scene.changeScene("demo","demo_scene")
    }

    loadBundle(bundleName:string) {
        return new Promise<AssetManager.Bundle>((resolve,reject)=>{
            assetManager.loadBundle(bundleName,(err,bundle)=>{
                if(err) reject(err)
                else resolve(bundle)
            })
        })
    }
}
