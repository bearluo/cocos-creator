import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { FWUIDialog } from '../../framework/ui/FWUIDialog';
import { qAsset } from '../../framework/common/FWFunction';
const { ccclass, property } = _decorator;

@ccclass('scene_dialog_test')
export class scene_dialog_test extends Component {
    start() {
        app.manager.asset.loadBundle({
            name: "test",
        })
    }

    update(deltaTime: number) {
        
    }

    showDialog1(){
        qAsset.getAsset("test","dialog/Dialog1",Prefab).then((res)=>{
            let node = instantiate(res);
            let uiDialog = node.getComponent(FWUIDialog) ?? node.addComponent(FWUIDialog);
            app.manager.ui.showDialog(uiDialog);
        })
    }

    showDialog2(){
        qAsset.getAsset("test","dialog/Dialog2",Prefab).then((res)=>{
            let node = instantiate(res);
            let uiDialog = node.getComponent(FWUIDialog) ?? node.addComponent(FWUIDialog);
            app.manager.ui.showDialog(uiDialog);
        })
    }
}


