import { _decorator, Component, EventTouch, Node } from 'cc';
import { func, uiFunc } from '../common/FWFunction';
import { Events } from '../events/FWEvents';
import { log } from '../common/FWLog';
const { ccclass, property } = _decorator;

@ccclass('UIRoot')
export class UIRoot extends Component {
    staticNode:UIStaticNode
    bindApp:boolean = false;

    init(): void {
        this.staticNode = new UIStaticNode();
        this.staticNode.init(this);
    }

    start() {
    }

    update(deltaTime: number) {

    }

    onDestroy() {
        if(this.bindApp) {
            /**
             * 销毁框架
             */
            app.dectroy();
        }
    }
}


export class UIStaticNode {
    private static _instance: UIStaticNode;
    static get instance(): UIStaticNode {
        return this._instance;
    }
    dialog: Node;
    loading: Node;
    toast: Node;
    notice: Node;
    touch: Node;

    init(com:UIRoot) {
        let parent = com.node;
        this._getOrCreateNode(parent,"dialog");
        this._getOrCreateNode(parent,"notice");
        this._getOrCreateNode(parent,"loading");
        this._getOrCreateNode(parent,"toast");
        this._getOrCreateNode(parent,"touch");
    }

    private _getOrCreateNode(parent:Node,name:string) {
        let nodeName = '__' + name;
        let node = parent.getChildByName(nodeName)
        if(!node) {
            node = uiFunc.newNodeWidget(nodeName);
            node.parent = parent;
            this[name] = node;
            let initFuncName = "_init" + func.toUpperFirst(name);
            if ( func.isFunction(this[initFuncName]) ) {
                this[initFuncName]();
            }
        }
        return node;
    }

    private _initTouch() {
        this.touch.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.touch.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.touch.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.touch.on(Node.EventType.TOUCH_CANCEL, this._onToucCancel, this);
    }

    private _onTouchStart(event?: EventTouch) {
        // log.printDebug("onTouchStart");
        event.preventSwallow = true;
        app.manager.ui.emit(Events.onGameTouchStart,event);
    }
    private _onTouchMove(event?: EventTouch) {
        // log.printDebug("_onTouchMove");
        event.preventSwallow = true;
        // app.manager.ui.emit(Events.onGameTouchStart,event);
    }
    private _onTouchEnd(event?: EventTouch) {
        // log.printDebug("_onTouchEnd");
        event.preventSwallow = true;
        // app.manager.ui.emit(Events.onGameTouchStart,event);
    }
    private _onToucCancel(event?: EventTouch) {
        // log.printDebug("_onToucCancel");
        event.preventSwallow = true;
        // app.manager.ui.emit(Events.onGameTouchStart,event);
    }
}


