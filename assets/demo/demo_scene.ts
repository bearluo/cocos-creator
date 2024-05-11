import { _decorator, AssetManager, assetManager, Component, Director, director, Node } from 'cc';
import { Scene_ScrollView } from './ui/Scene_ScrollView';
import { FWApplication } from '../framework/FWApplication';
const { ccclass, property } = _decorator;

/**
 * 需要修改入口的bundle 加载顺序
 */
@ccclass('demo_scene')
export class demo_scene extends Component {
    @property(Scene_ScrollView)
    scene_scrollView: Scene_ScrollView;

    protected onLoad(): void {
        if(this.scene_scrollView) {
            this.scene_scrollView.setJson({
                sceneInfo:[
                    ["test","scene-test"],
                ]
            });
        }
    }

    start() {
    }

    update(deltaTime: number) {
        
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
