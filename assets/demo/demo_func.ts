import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export class demo_func {
    static gotoDemoScene() {
        app.manager.scene.changeScene("main", "scene");
    }
}


