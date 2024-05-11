import { _decorator, CCString, Color, Component, Label, Node, path, Sprite } from 'cc';
import { constant } from '../../framework/common/FWConstant';
import { func, uiFunc } from '../../framework/common/FWFunction';
import { demo_func } from '../demo_func';
const { ccclass, property } = _decorator;

@ccclass('Scene_back')
export class Scene_back extends Component {

    protected onLoad(): void {
        uiFunc.onClick(this.node,demo_func.gotoDemoScene)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}
