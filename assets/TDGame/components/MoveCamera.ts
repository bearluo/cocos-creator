import { _decorator, Camera, Component, EventTouch, Node, NodeEventType, Vec2, Vec3 } from 'cc';
const { ccclass, property, type } = _decorator;

const _tempVec3 = new Vec3();
const _tempVec2 = new Vec2();
const _tempVec2_1 = new Vec2();
@ccclass('MoveCamera')
export class MoveCamera extends Component {
    @type(Camera)
    camera:Camera

    start() {

    }

    onEnable() {
        this.enableTouchEvent();
    }

    onDisable() {
        this.disableTouchEvent();
    }

    update(deltaTime: number) {
        
    }

    private enableTouchEvent() {
        this.node.on(NodeEventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.on(NodeEventType.TOUCH_MOVE, this._onTouchMove, this, true);
        this.node.on(NodeEventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.on(NodeEventType.TOUCH_CANCEL, this._onTouchCancel, this, true);
    }

    private disableTouchEvent() {
        this.node.off(NodeEventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.off(NodeEventType.TOUCH_MOVE, this._onTouchMove, this, true);
        this.node.off(NodeEventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.off(NodeEventType.TOUCH_CANCEL, this._onTouchCancel, this, true);
    }

    // touch event handler
    protected _onTouchBegan (event?: EventTouch): void {
        if (!this.enabledInHierarchy || !this.camera) { return; }
        // if (event) {
        //     event.preventSwallow = true;
        // }
    }

    protected _onTouchMove (event?: EventTouch): void {
        if (!this.enabledInHierarchy || !this.camera) { return; }
        // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving
        if (!event) {
            return;
        }

        const touch = (event).touch;
        if (!touch) {
            return;
        }

        const deltaMove = touch.getUIPreviousLocation(_tempVec2);
        deltaMove.subtract(touch.getUILocation(_tempVec2_1));
        this.moveCamera(deltaMove);

        // if (event) {
        //     event.preventSwallow = true;
        // }
    }

    protected _onTouchEnded (event?: EventTouch): void {
        if (!this.enabledInHierarchy) {
            return;
        }

        // if (event) {
        //     event.preventSwallow = true;
        // }
    }

    protected _onTouchCancel (event?: EventTouch): void {
        if (!this.enabledInHierarchy) { return; }
    }

    /**
     * 移动相机
     * @param movePos 
     */
    moveCamera(movePos:Vec2) {
        var node = this.camera.node;
        var pos = node.getPosition(_tempVec3);
        pos.x += movePos.x;
        pos.y += movePos.y;
        node.setPosition(pos);
    }
}


