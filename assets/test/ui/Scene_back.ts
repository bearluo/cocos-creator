import { _decorator, CCString, Color, Component, Label, Node, path, Sprite } from 'cc';
import { uiFunc } from '../../framework/common/FWFunction';
import { test_func } from '../test_func';
const { ccclass, property } = _decorator;

@ccclass('Scene_back')
export class Scene_back extends Component {

    protected onLoad(): void {
        uiFunc.onClick(this.node,test_func.gotoTestScene)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}
