import { _decorator, Component, EventTouch, Node, NodeEventType, Vec2, Vec3,Touch, Label, Input } from 'cc';
import { WayPathRenderer } from './WayPathRenderer';
import { EDITOR } from 'cc/env';
const { ccclass, property,executeInEditMode } = _decorator;

const _tempVec3 = new Vec3();
const _tempVec3_1 = new Vec3();
const _tempVec2 = new Vec2();
const _tempVec2_1 = new Vec2();
const EPSILON = 1e-4;
const TOLERANCE = 1e4;

@ccclass('WayPoint')
@executeInEditMode
export class WayPoint extends Component {
    private _touchMoved: boolean = false;
    protected _deltaPos = new Vec3();
    protected wayPathRenderer:WayPathRenderer;
    protected label:Label;

    protected onLoad(): void {
        this.wayPathRenderer = this.node.parent.getComponent(WayPathRenderer);
        this.label = this.node.getComponent(Label);
    }

    start() {
    }

    update(deltaTime: number) {
        
    }

    onEnable() {
        this.updateLabel();
        this._registerEvent();
    }

    onDisable() {
        this._unregisterEvent();
    }

    // private methods
    protected _registerEvent () {
        if (!EDITOR || globalThis.isPreviewProcess) {
            this.node.on(NodeEventType.TOUCH_START, this._onTouchBegan, this);
            this.node.on(NodeEventType.TOUCH_MOVE, this._onTouchMoved, this);
            this.node.on(NodeEventType.TOUCH_END, this._onTouchEnded, this);
            this.node.on(NodeEventType.TOUCH_CANCEL, this._onTouchCancelled, this);
        }
        this.node.parent?.on(NodeEventType.SIBLING_ORDER_CHANGED, this._onSiblingOrderChanged, this);
    }

    protected _unregisterEvent () {
        if (!EDITOR || globalThis.isPreviewProcess) {
            this.node.off(NodeEventType.TOUCH_START, this._onTouchBegan, this);
            this.node.off(NodeEventType.TOUCH_MOVE, this._onTouchMoved, this);
            this.node.off(NodeEventType.TOUCH_END, this._onTouchEnded, this);
            this.node.off(NodeEventType.TOUCH_CANCEL, this._onTouchCancelled, this);
        }
        this.node.parent?.off(NodeEventType.SIBLING_ORDER_CHANGED, this._onSiblingOrderChanged, this);
    }

    public updateLabel() {
        if(this.label) {
            this.label.string = `${this.node.getSiblingIndex()}`;
        }
    }

    protected _onSiblingOrderChanged() {
        this.updateLabel();
    }

    protected _onTouchBegan (event: EventTouch, captureListeners?: Node[]) {
        if (!this.enabledInHierarchy) { return; }
        this._touchMoved = false;

        this.wayPathRenderer?.setSelectIndex(this.node.getSiblingIndex());
    }

    protected _onTouchMoved (event: EventTouch, captureListeners?: Node[]) {
        if (!this.enabledInHierarchy) { return; }
        const touch = event.touch!;
        this._handleMoveLogic(touch);

        const deltaMove = touch.getUILocation(_tempVec2);
        deltaMove.subtract(touch.getUIStartLocation(_tempVec2_1));
        // FIXME: touch move delta should be calculated by DPI.
        if (deltaMove.length() > 7) {
            if (!this._touchMoved && event.target !== this.node) {
                // Simulate touch cancel for target node
                const cancelEvent = new EventTouch(event.getTouches(), event.bubbles, Input.EventType.TOUCH_CANCEL);
                cancelEvent.touch = event.touch;
                cancelEvent.simulate = true;
                (event.target as Node).dispatchEvent(cancelEvent);
                this._touchMoved = true;
            }
        }
    }

    protected _onTouchEnded (event: EventTouch, captureListeners?: Node[]) {
        if (!this.enabledInHierarchy || !event) { return; }
        if (this._touchMoved) {
            event.propagationStopped = true;
        }
    }

    protected _onTouchCancelled (event: EventTouch, captureListeners?: Node[]) {
        if (!this.enabledInHierarchy) { return; }
    }

    
    protected _getLocalAxisAlignDelta (out: Vec3, touch: Touch) {
        const uiTransformComp = this.node._uiProps.uiTransformComp;
        const vec = new Vec3();

        if (uiTransformComp) {
            touch.getUILocation(_tempVec2);
            touch.getUIPreviousLocation(_tempVec2_1);
            _tempVec3.set(_tempVec2.x, _tempVec2.y, 0);
            _tempVec3_1.set(_tempVec2_1.x, _tempVec2_1.y, 0);
            uiTransformComp.convertToNodeSpaceAR(_tempVec3, _tempVec3);
            uiTransformComp.convertToNodeSpaceAR(_tempVec3_1, _tempVec3_1);
            Vec3.subtract(vec, _tempVec3, _tempVec3_1);
        }

        out.set(vec);
    }

    protected _processDeltaMove (deltaMove: Vec3) {
        this._moveContent(deltaMove);
    }

    protected _handleMoveLogic (touch: Touch) {
        this._getLocalAxisAlignDelta(this._deltaPos, touch);
        this._processDeltaMove(this._deltaPos);
    }

    protected _moveContent (deltaMove: Vec3) {
        _tempVec3.set(this.node.getPosition());
        _tempVec3.add(deltaMove);
        _tempVec3.set(Math.round(_tempVec3.x * TOLERANCE) * EPSILON, Math.round(_tempVec3.y * TOLERANCE) * EPSILON, _tempVec3.z);
        this.node.setPosition(_tempVec3);
    }
}


