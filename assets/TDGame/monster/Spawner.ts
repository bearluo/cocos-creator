import { _decorator, CCInteger, Component, Node } from 'cc';
import { monster_id } from './share';
const { ccclass, property,type } = _decorator;

interface SpawnerJsonConfig {

}

@ccclass('SpawnerItem')
class SpawnerItem {
    @property({type:CCInteger})
    showTime:number = 0;
    @type([monster_id])
    monsterID:monster_id[] = [];
    constructor() {
        
    }
}

@ccclass('Spawner')
export class Spawner extends Component {
    @type([SpawnerItem])
    queue:SpawnerItem[] = [];
    curIndex = 0;
    start() {

    }

    update(deltaTime: number) {
        
    }

    initByJson(data:SpawnerJsonConfig) {

    }
}

