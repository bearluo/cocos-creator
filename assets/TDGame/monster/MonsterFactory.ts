import { _decorator, ccenum, Component, Node, Pool, Prefab } from 'cc';
import { monster_id } from './share';
const { ccclass, property,type } = _decorator;

@ccclass('MonsterFactory')
export class MonsterFactory extends Component {
    // @type(Map<monster_id,Prefab>)
    monsterMap:Map<monster_id,Prefab> = new Map();

    // pool:Pool

    start() {

    }

    update(deltaTime: number) {
        
    }

    allocMonster(monster_id:number) {

    }

    freeMonster(monster:Node) {
    }
}


