import { _decorator, Component, Node, Prefab } from 'cc';
import { MonsterBundleName, MonsterConfig } from '../monster/share';
import { qAsset } from '../../framework/common/FWFunction';
const { ccclass, property } = _decorator;

@ccclass('scene_TDGame_edit_load')
export class scene_TDGame_edit_load extends Component {
    start() {
        let promises = MonsterConfig.map(v=>{
            return qAsset.loadAsset(MonsterBundleName,v,Prefab)
        })

        Promise.all(promises).then(v=>{
            app.manager.scene.changeScene(MonsterBundleName,"scene-TDGame-edit")
        })
    }

    update(deltaTime: number) {
        
    }
}


