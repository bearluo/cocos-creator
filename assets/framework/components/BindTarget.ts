import { _decorator, Component, Node, TransformBit } from 'cc';
const { ccclass, property,executeInEditMode } = _decorator;

@ccclass('BindTarget')
@executeInEditMode
export class BindTarget extends Component {
    @property
    private _target:Node;
    @property(Node)
    set target(node:Node) {
        this.setTarget(node);
    }
    get target() {
        return this._target;
    }

    onEnable(): void {
        this._addEventListeners();
    }

    onDisable(): void {
        this._removeEventListeners();
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    setTarget(node:Node) {
        this._removeEventListeners();
        this._target = node;
        if(this._target) {
            this.node.scale = this._target.scale;
            this.node.position = this.target.position; 
        }
        this._addEventListeners();
    }

    protected _addEventListeners() {
        this._target?.on(Node.EventType.TRANSFORM_CHANGED, this._transformDirty, this);
    }

    protected _removeEventListeners() {
        this._target?.on(Node.EventType.TRANSFORM_CHANGED, this._transformDirty, this);
    }

    private _transformDirty(type: number) {
        if (type & TransformBit.SCALE) {
            this.node.scale = this._target.scale;
        }
        if (type & TransformBit.POSITION) {
            this.node.position = this.target.position; 
        }
    }
}


