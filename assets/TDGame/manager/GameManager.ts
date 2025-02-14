import { _decorator, Component, EPhysics2DDrawFlags, Node, PhysicsSystem2D } from 'cc';
import { Monster } from '../monster/Monster';
import { BulletNode } from '../base/BulletNode';
import { BuildNode } from '../base/BuildNode';
import { BaseMonster } from '../base/BaseMonster';
import { DamageNode } from '../base/DamageNode';
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
    /**
     * 怪物列表
     */
    private monsterList:BaseMonster[] = [];
    /**
     * 建筑列表
     */
    private bulidingList:BuildNode[] = [];
    /**
     * 子弹列表
     */
    private bulletList:BulletNode[] = [];
    /**
     * 区域伤害列表
     */
    private damageNodeList:DamageNode[] = [];
    
    protected onLoad(): void {
        GameManager.instance = this;
    }

    start() {

    }
    /**
     * 游戏更新逻辑入口
     * @param deltaTime 
     */
    update(deltaTime: number) {
        this._removeQueue.forEach(v=>{
            v.destroy()
        })
        this._removeQueue.length = 0;

        this._addQueue.forEach(v=>{
            v.parent = GameManager.instance.gameLayer;
        })
        this._addQueue.length = 0;

        // 更新怪物
        this.monsterList.forEach(v=>v.tick(deltaTime));
        this.monsterList.sort((a,b)=>{
            return b.node.getPosition().y - a.node.getPosition().y;
        })
        this.monsterList.forEach((v,index)=>{
            v.node.setSiblingIndex(index);
        })

        // 更新建筑
        this.bulidingList.forEach(v=>v.tick(deltaTime));
        // 更新子弹
        this.bulletList.forEach(v=>v.tick(deltaTime));
        // 更新伤害区域
        this.damageNodeList.forEach(v=>v.tick(deltaTime));
    }

    removeObj(node:Node) {
        this._removeQueue.push(node);
    }

    addObj(node:Node) {
        this._addQueue.push(node);
    }

    addMonster(monster:BaseMonster) {
        this.monsterList.push(monster);
    }

    removeMonster(monster:BaseMonster) {
        const index = this.monsterList.findIndex(b => b === monster);
        if (index !== -1) {
            this.monsterList.splice(index, 1);
        }
    }

    addBuilding(build:BuildNode) {
        this.bulidingList.push(build);
    }

    removeBuilding(build:BuildNode) {
        const index = this.bulidingList.findIndex(b => b === build);
        if (index !== -1) {
            this.bulidingList.splice(index, 1);
        }
    }

    addBullet(bullet:BulletNode) {
        this.bulletList.push(bullet);
    }

    removeBullet(bullet:BulletNode) {
        const index = this.bulletList.findIndex(b => b === bullet);
        if (index !== -1) {
            this.bulletList.splice(index, 1);
        }
    }

    addDamageNode(node:DamageNode) {
        this.damageNodeList.push(node);
    }

    removeDamageNode(node:DamageNode) {
        const index = this.damageNodeList.findIndex(b => b === node);
        if (index !== -1) {
            this.damageNodeList.splice(index, 1);
        }
    }
}


