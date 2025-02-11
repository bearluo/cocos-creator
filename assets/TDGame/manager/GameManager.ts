import { _decorator, Component, EPhysics2DDrawFlags, Node, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    static instance:GameManager = null;
    @property({
        type:Node,
    })
    gameLayer:Node;

    private _removeQueue:Node[] = [];
    private _addQueue:Node[] = [];

    protected onLoad(): void {
        GameManager.instance = this;
    }

    start() {

    }

    update(deltaTime: number) {
        this._removeQueue.forEach(v=>{
            v.destroy()
        })
        this._removeQueue.length = 0;

        this._addQueue.forEach(v=>{
            v.parent = GameManager.instance.gameLayer;
        })
        this._addQueue.length = 0;
    }

    removeObj(node:Node) {
        this._removeQueue.push(node);
    }

    addObj(node:Node) {
        this._addQueue.push(node);
    }
}


