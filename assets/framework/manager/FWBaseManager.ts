import { _decorator, Component, EventTarget, Node } from 'cc';
import { manager } from '../common/FWShare';
const { ccclass, property } = _decorator;


@ccclass('FWBaseManager')
export class FWBaseManager extends EventTarget {
    constructor() {
        super();
        manager.push(this);
    }

    __preload():void {

    }

    start(): void {
    }

    update(deltaTime: number): void {
    }

    dectroy(): void {
        let index = manager.indexOf(this);
        if (index != -1) {
            manager.splice(index, 1);
        }
        this.onDestroy();
    }

    onDestroy() {
        
    }
}
