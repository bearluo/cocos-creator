import { _decorator, Component, Node, Prefab } from 'cc';
import { func, qAsset, uiFunc } from '../../framework/common/FWFunction';
import { constant } from '../../framework/common/FWConstant';
const { ccclass, property } = _decorator;

@ccclass('scene_scene_test')
export class scene_scene_test extends Component {
    start() {

        qAsset.loadAsset("test","loading/loading",Prefab).then((prefab)=>{
            constant.default_loadPrefab = prefab;
        })
    }

    update(deltaTime: number) {
        
    }

    onClickChangeScene() {
        app.manager.scene.changeScene("test","scene/scene-scene-test-001")
    }
}


