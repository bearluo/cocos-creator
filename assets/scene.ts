import { _decorator, AssetManager, assetManager, Component, Director, director, Node } from 'cc';
import { FWApplication } from './framework/FWApplication';
import { EDITOR, PREVIEW } from 'cc/env';
const { ccclass, property } = _decorator;

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


