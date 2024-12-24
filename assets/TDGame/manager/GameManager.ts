import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    static instance:GameManager = null;
    @property({
        type:Node,
    })
    gameLayer:Node;

    protected onLoad(): void {
        GameManager.instance = this;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


