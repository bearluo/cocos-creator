import { _decorator, Component, Node } from 'cc';
import { BaseBuff, BuffAttribute } from './BaseBuff';
const { ccclass, property } = _decorator;

export class TDObject extends Component {

}

export class TDObjectBuff extends TDObject {
    buffAttribute: BuffAttribute = new BuffAttribute();

    buffList:BaseBuff[] = [];

    tick(dt:number) {
        this.buffList.forEach(v=>v.tick(dt));
        this.buffAttribute.reset();
        this.buffList.forEach(v=>v.work(this.buffAttribute));
    }
    
    addBuff(buff:BaseBuff) {
        buff.targetObj = this;
        this.buffList.push(buff);
    }

    delBuff(buff:BaseBuff) {
        const index = this.buffList.findIndex(b => b === buff);
        if (index !== -1) {
            this.buffList.splice(index, 1); // 删除找到的 buff
        }
    }

    hasBuff(buff:BaseBuff) {
        const index = this.buffList.findIndex(b => b === buff);
        return index !== -1;
    }

    getBuff<T extends BaseBuff>(buffType: { new(): T },originObj?:TDObject): T | null {
        if (originObj) {
            return this.buffList.find(b => b instanceof buffType && b.originObj === originObj) as T || null;
        }
        return this.buffList.find(buff => buff instanceof buffType) as T | null;
    }
}
