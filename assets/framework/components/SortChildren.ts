import { _decorator, Component, Node } from 'cc';
import { JSB } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('SortChildren')
export class SortChildren extends Component {
    start() {

    }

    update(deltaTime: number) {
        this.sortByYDepth();
    }

    sortByYDepth() {
        this.node.children.sort((a, b) => {
            return b.position.y - a.position.y;
        })
        if(JSB) {
            // @ts-expect-error: jsb related codes.
            this.node._setChildren(this.node.children)
        }
        this.node._updateSiblingIndex()
    }
}


