import { _decorator, Component, EventTouch, Node, NodeEventType, Touch, Vec2, Vec3 } from 'cc';
import { MJBase } from './MJBase';
import { ePlayerID } from '../../core/Config';
import { EDITOR_NOT_IN_PREVIEW } from 'cc/env';
import { timer } from 'db://assets/framework/common/FWTimer';
const { ccclass, property } = _decorator;
interface Table {
    handPile: MJBase[][];
    selectHandTile:(obj:MJBase,doubleClick:boolean)=>void;
    moveSelectHandTile:(offsetPos:Vec2)=>void;
    moveSelectHandTileEnd:(discardTile:boolean)=>void;
    selectTile: MJBase;
}
const tmpPos = new Vec2();
const tmpPos2 = new Vec2();
@ccclass('HandTouchLayer')
export class HandTouchLayer extends Component {

    private _interactable: boolean = true;
    private _pressed = false;
    private _moved = false;

    private _table:Table;
    /**
     * 双击时间
     */
    private _dounbClickTime:number = 200;
    /**
     * 上一次点击时间
     */
    private _lastClickTime:number = 0;
    /**
     * 出牌拖拽 y 坐标
     */
    private _discardY: number = 100;


    start() {

    }

    update(deltaTime: number) {
        
    }

    init(table:Table) {
        this._table = table;
    }

    public onEnable (): void {
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._registerNodeEvent();
        }
    }

    public onDisable (): void {
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._unregisterNodeEvent();
        }
    }

    protected _registerNodeEvent (): void {
        this.node.on(NodeEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(NodeEventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(NodeEventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(NodeEventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    
    protected _unregisterNodeEvent (): void {
        this.node.off(NodeEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(NodeEventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(NodeEventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(NodeEventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }
    /**
     * @en
     * Whether the Button is disabled.
     * If true, the Button will trigger event and do transition.
     *
     * @zh
     * 按钮事件是否被响应，如果为 false，则按钮将被禁用。
     */
    get interactable (): boolean {
        return this._interactable;
    }

    set interactable (value) {
        if (this._interactable === value) {
            return;
        }

        this._interactable = value;

        if (!this._interactable) {
            this._pressed = false;
        }
    }
    // touch event handler
    protected _onTouchBegan (event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy) { return; }

        this._pressed = true;
        this._onHandTileTouch(event);
        if (event) {
            event.propagationStopped = true;
        }
    }

    protected _onTouchMove (event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy || !this._pressed) { return; }
        // mobile phone will not emit _onMouseMoveOut,
        // so we have to do hit test when touch moving
        if (!event) {
            return;
        }

        const touch = (event).touch;
        if (!touch) {
            return;
        }

        // const hit = this.node._uiProps.uiTransformComp!.hitTest(touch.getLocation(), event.windowId);
        if(this._table.selectTile) {
            this._onHandTileTouchMove(event)
        // } else {
        //     this._onHandTileTouch(event)
        }


        if (event) {
            event.propagationStopped = true;
        }
    }

    protected _onTouchEnded (event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy) {
            return;
        }

        if (this._pressed) {
            // this._onHandTileTouch(event);
        }
        this._pressed = false;
        
        if (this._moved) {
            this._onHandTileTouchMoveEnd(event);
        }
        this._moved = false;

        if (event) {
            event.propagationStopped = true;
        }
    }

    protected _onTouchCancel (event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy) { return; }
        this._pressed = false;
        if (this._moved) {
            this._onHandTileTouchMoveEnd(event);
        }
        this._moved = false;
    }

    protected getMoveOffset(touch:Touch) {
        return touch.getLocation(tmpPos).subtract(touch.getStartLocation(tmpPos2));
    }

    protected _onHandTileTouchMove(event?: EventTouch) {
        const touch = (event).touch;
        if (!touch) {
            return;
        }
        let pos = this.getMoveOffset(touch);
        // 移动状态下 或者 移动距离超过20 像素 认为用户在拖拽
        if (this._moved || pos.length() > 20) {
            this._moved = true;
            this._table.moveSelectHandTile(pos);
        }
    }

    protected _onHandTileTouchMoveEnd(event?: EventTouch) {
        const touch = (event).touch;
        if (!touch) {
            return;
        }
        let pos = touch.getLocation(tmpPos);
        this._table.moveSelectHandTileEnd(pos.y > this._discardY);
    }


    protected _onHandTileTouch(event?: EventTouch) {
        const touch = (event).touch;
        if (!touch) {
            return;
        }
        let handPile = this._table.handPile[ePlayerID.Bottom];
        let pos = touch.getLocation(tmpPos);
        let windowId = event.windowId;
        let curTime = timer.now();
        let doubleClick = curTime - this._lastClickTime <= this._dounbClickTime;
        this._lastClickTime = curTime;
        for (let index = 0; index < handPile.length; index++) {
            const tile = handPile[index];
            const hit = tile.hitTest(pos, windowId);
            if (hit) {
                this._table.selectHandTile(tile,doubleClick);
                break
            }
        }
    }
}


