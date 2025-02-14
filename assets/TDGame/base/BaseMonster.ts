import { _decorator, Component, Node } from 'cc';
import { TDObject, TDObjectBuff } from './TDObject';
import { GameManager } from '../manager/GameManager';
const { ccclass, property } = _decorator;

export class BaseMonster extends TDObjectBuff {
    protected onEnable() {
        GameManager.instance.addMonster(this);
    }

    protected onDisable() {
        GameManager.instance.removeMonster(this);
    }
    /**
     * 承受伤害
     * @param value 
     */
    takeDamage(value:number, originObj:TDObject) {
    }
}
