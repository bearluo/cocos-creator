import { _decorator, AssetManager, assetManager, Component, Director, director, Node } from 'cc';
import { FWApplication } from './framework/FWApplication';
import { EDITOR, PREVIEW } from 'cc/env';
import { FWManager } from './framework/manager/FWManager';
import { FWUIManager } from './framework/manager/FWUIManager';
import { AWCenterManager } from './aw/manager/AWCenterManager';
import { AWSockManager } from './aw/manager/AWSockManager';
const { ccclass, property } = _decorator;

/**
 * 需要修改入口的bundle 加载顺序
 */
@ccclass('scene')
export class scene extends Component {
    start() {
        this._init();
    }

    update(deltaTime: number) {
        
    }

    async _init() {
        await this.loadBundle("framework");
        await this.loadBundle("aw");
        app || new FWApplication();
        app.manager.scene.changeScene("test","asset/scene-asset-test")
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
