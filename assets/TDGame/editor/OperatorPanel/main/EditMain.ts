import { _decorator, Component, Node } from 'cc';
import { uiFunc } from '../../../../framework/common/FWFunction';
import { gameFunc } from '../../../common/constant';
const { ccclass, property } = _decorator;

@ccclass('EditMain')
export class EditMain extends Component {
    
    protected onLoad(): void {
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_load_config"),gameFunc.loadConfig);
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_save_config"),gameFunc.saveConfig);
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_waypath_edit"),gameFunc.showWayPathEdit);
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_monster_edit"),gameFunc.showMonsterEdit);
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_spawner_edit"),gameFunc.showSpawnerEdit);
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_preview"),gameFunc.gotoPreview);
        
        // uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_save"),this.onSaveClick.bind(this));
        // uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_info"),this.onInfoClick.bind(this));
        // uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_add"),this.onAddWayPointClick.bind(this));
        // uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_del"),this.onDeleteWayPointClick.bind(this));
        // uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_save"),this.onSaveWayPointClick.bind(this));
    }

    start() {
    }

    update(deltaTime: number) {
        
    }
}


