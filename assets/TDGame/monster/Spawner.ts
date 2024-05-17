import { _decorator, assert, CCInteger, Component, Node, Vec3 } from 'cc';
import { Monster } from './Monster';
import { WayPathTracker } from '../simpleWayPointSystem/WayPathTracker';
const { ccclass, property,type } = _decorator;

interface SpawnerFactory {
    allocMonster(monster_id:number):Monster,
    freeMonster(node:Monster):void,
}

@ccclass('SpawnerItem')
class SpawnerItem {
    @property({type:CCInteger})
    showTime:number = 0;
    @type(CCInteger)
    monsterID:number = -1;
    constructor() {
        
    }
}

@ccclass('Spawner')
export class Spawner extends Component {
    @type([Vec3])
    anchors: Vec3[] = [];
    @type([SpawnerItem])
    queue:SpawnerItem[] = [];
    @type(Node)
    monsterLayer:Node = null;

    private _totalTime:number = 0;
    private _curIndex:number = 0;
    private _maxIndex:number = 0;

    spawnerFactory:SpawnerFactory;
    monsterList:Monster[] = [];

    start() {

    }

    update(deltaTime: number) {
        
    }
    
    setAnchors(points: Vec3[]) {
        this.anchors.length = 0;
        this.anchors = this.anchors.concat(points.map(v=>v.clone()));
    }

    walk(deltaTime: number) {
        this.monsterList.forEach(v=>{
            v.walk(deltaTime);
        })

        this._totalTime += deltaTime;
        let showTime = 0;
        let offsetTime = 0;
        while(this._maxIndex > 0 && this._curIndex < this._maxIndex && this._totalTime >= (showTime = this.queue[this._curIndex].showTime)) {
            offsetTime = this._totalTime - showTime;
            let monster = this.spawnerFactory.allocMonster(this.queue[this._curIndex++].monsterID);
            let node = monster.node;
            monster.reset(this.anchors);
            this.monsterList.push(monster);
            node.on("Monster-Free",this.onMonsterFree,this)
            node.on("Monster-Move-end",this.onMonsterFree,this)
            node.parent = this.monsterLayer;
            monster.walk(offsetTime);
        }
    }

    addSpawnerItem(showTime:number,monsterID:number) {
        let item = new SpawnerItem();
        item.showTime = showTime;
        item.monsterID = monsterID;
        this.queue.push(item);
    }

    reset() {
        this._totalTime = 0;
        this._curIndex = 0;
        this._maxIndex = this.queue.length;
        this.queue.sort((a,b)=>{
            return a.showTime - b.showTime;
        })
    }

    onMonsterFree(monster:Monster) {
        let index = this.monsterList.findIndex(v=>v==monster);
        assert(index != -1,"node is not in monsterList");
        this.monsterList.splice(index,1);
        this.spawnerFactory.freeMonster(monster);
    }
}

