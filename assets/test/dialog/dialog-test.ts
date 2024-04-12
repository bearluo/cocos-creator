import { _decorator, assert, Component, Node } from 'cc';
import { FWUIDialog } from '../../framework/ui/FWUIDialog';
const { ccclass, property } = _decorator;

@ccclass('dialog_test')
export class dialog_test extends Component {
    uiDialog: FWUIDialog;

    start() {
        this.uiDialog = this.node.getComponent(FWUIDialog);
    }

    onCloseClick() {
        assert(this.uiDialog,"uiDialog is null");
        this.uiDialog.onClickClose();
    }

    onCloseDialog1() {

    }

    update(deltaTime: number) {
        
    }
}


