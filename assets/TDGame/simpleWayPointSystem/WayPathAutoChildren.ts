import { _decorator, Component, director, Director, Node, TransformBit } from 'cc';
import { WayPath } from './WayPath';
const { ccclass, property,requireComponent,executeInEditMode,type } = _decorator;

@ccclass('WayPathAutoChildren')
@executeInEditMode
export class WayPathAutoChildren extends Component {
    @property({
        type:WayPath,
    })
    public path:WayPath;
    private _layoutDirty: boolean;
    protected onLoad(): void {
        
    }
    start() {
        this._doLayoutDirty();
    }

    update(deltaTime: number) {
        
    }
    
    onEnable(): void {
        this._addEventListeners();
    }

    onDisable(): void {
        this._removeEventListeners();
    }
    protected _addEventListeners () {
        director.on(Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.on(Node.EventType.CHILD_ADDED, this._childAdded, this);
        this.node.on(Node.EventType.CHILD_REMOVED, this._childRemoved, this);
        this.node.on(Node.EventType.SIBLING_ORDER_CHANGED, this._childrenChanged, this);
        this._addChildrenEventListeners();
    }

    protected _removeEventListeners () {
        director.off(Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.off(Node.EventType.CHILD_ADDED, this._childAdded, this);
        this.node.off(Node.EventType.CHILD_REMOVED, this._childRemoved, this);
        this.node.off(Node.EventType.SIBLING_ORDER_CHANGED, this._childrenChanged, this);
        this._removeChildrenEventListeners();
    }

    protected _addChildrenEventListeners () {
        const children = this.node.children;
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            child.on(Node.EventType.TRANSFORM_CHANGED, this._transformDirty, this);
            child.on(Node.EventType.ACTIVE_IN_HIERARCHY_CHANGED, this._childrenChanged, this);
        }
    }

    protected _removeChildrenEventListeners () {
        const children = this.node.children;
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            child.off(Node.EventType.TRANSFORM_CHANGED, this._transformDirty, this);
            child.off(Node.EventType.ACTIVE_IN_HIERARCHY_CHANGED, this._childrenChanged, this);
        }
    }

    protected _childAdded (child: Node) {
        child.on(Node.EventType.SIZE_CHANGED, this._doLayoutDirty, this);
        child.on(Node.EventType.TRANSFORM_CHANGED, this._transformDirty, this);
        child.on(Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        child.on(Node.EventType.ACTIVE_IN_HIERARCHY_CHANGED, this._childrenChanged, this);
        this._childrenChanged();
    }

    protected _childRemoved (child: Node) {
        child.off(Node.EventType.SIZE_CHANGED, this._doLayoutDirty, this);
        child.off(Node.EventType.TRANSFORM_CHANGED, this._transformDirty, this);
        child.off(Node.EventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        child.off(Node.EventType.ACTIVE_IN_HIERARCHY_CHANGED, this._childrenChanged, this);
        this._childrenChanged();
    }
    
    protected _childrenChanged () {
        this._doLayoutDirty();
    }

    protected _transformDirty (type: number) {
        if (!(type & TransformBit.POSITION)) {
            return;
        }

        this._doLayoutDirty();
    }

    protected _doLayoutDirty () {
        this._layoutDirty = true;
    }

    updateLayout(force = false) {
        if (this._layoutDirty || force) {
            this.wayPointsFromChildren();
            this._layoutDirty = false;
        }
    }

    wayPointsFromChildren() {
        let anchors = [];
        this.node.children.forEach((child) => {
            anchors.push(child.position.clone());
        });
        this.path?.reset(anchors);
    }
}


