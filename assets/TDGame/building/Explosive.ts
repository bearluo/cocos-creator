import { _decorator, Component, Node } from 'cc';
import { BuildNode } from './BuildNode';
const { ccclass, property } = _decorator;

@ccclass('Explosive')
export class Explosive extends BuildNode {
    start() {
        super.start()
    }

    update(deltaTime: number) {
        super.update(deltaTime)
        
    }
}


