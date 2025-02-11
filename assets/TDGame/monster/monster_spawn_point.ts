import { _decorator, Component, instantiate, Node } from 'cc';
import { GameManager } from '../manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('monster_spawn_point')
export class monster_spawn_point extends Component {

    @property
    delay_time:number = 1;
    @property({
        type:Node,
    })
    monster_node:Node;
    private _time:number = 0


    start() {

    }

    update(deltaTime: number) {
        this._time += deltaTime;
        if (this._time > this.delay_time) {
            this._time -= this.delay_time;
            this.create_monster();
        }
    }

    create_monster() {
        let obj = instantiate(this.monster_node);
        GameManager.instance.addObj(obj);
        obj.setPosition(this.node.position);
        obj.active = true;
    }
}


