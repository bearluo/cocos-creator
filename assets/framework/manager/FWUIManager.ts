import { _decorator, assert, AudioClip, AudioSource, BlockInputEvents, color, Component, director, EventTouch, log, Node, Pool, RenderRoot2D, Sprite, SpriteFrame, UITransform, Widget } from 'cc';
import { FWBaseManager } from './FWBaseManager';
import { Events } from '../events/FWEvents';
import { UIRoot } from '../ui/FWUIRoot';
import { Setting } from '../config/FWSetting';
import { FWApplication } from '../FWApplication';
import { func } from '../common/FWFunction';
import { FWUIDialog } from '../ui/FWUIDialog';
import { FWUILoadingManager } from './FWUILoadingManager';
import { FWUIDialogManager } from './FWUIDialogManager';
import { FWUILoading } from '../ui/FWUILoading';
import { FWManager } from './FWManager';
const { ccclass, property } = _decorator;

@ccclass('FWUIManager')
export class FWUIManager extends FWBaseManager {
    uiRoot:UIRoot;
    private _dialogManager: FWUIDialogManager;
    private _loadingManager: FWUILoadingManager;

    __preload(): void {
        this._dialogManager = new FWUIDialogManager();
        this._loadingManager = new FWUILoadingManager();
        
    }

    start() {
        FWApplication.instance.on(Events.MANAGER_INIT_END, this.onMangerInitEnd, this);
    }

    onMangerInitEnd() {
        this.changeUIRoot(this.createUIRoot());
    }

    changeUIRoot(uiRoot:UIRoot): void {
        this.emit(Events.onUIRootChanged, uiRoot);
        let oldUIRoot = this.uiRoot;
        if(oldUIRoot) {
            oldUIRoot.bindApp = false;
            oldUIRoot.node.destroy();
        }
        uiRoot.bindApp = true;
        this.uiRoot = uiRoot;
        this._dialogManager.root = this.uiRoot.staticNode.dialog;
        this._loadingManager.root = this.uiRoot.staticNode.loading;
        //设置常驻节点
        director.addPersistRootNode(this.uiRoot.node);
    }

    private createUIRoot() {
        let node = func.newNodeWidget("_UIRoot");
        let root2D = node.addComponent(RenderRoot2D);
        let uiRoot = node.addComponent(UIRoot);
        uiRoot.init();
        return uiRoot;
    }

    showDialog(dialog: FWUIDialog) {
        this._dialogManager.addDialog(dialog);
    }

    closeDialog(dialog: FWUIDialog) {
        dialog.hide();
    }

    closeAllDialog() {
        this._dialogManager.closeAllDialog();
    }

    get dialog() {
        return this._dialogManager;
    }

    showLoading(view:FWUILoading) {
        this._loadingManager.add(view);
    }

    closeLoading(view: FWUILoading) {
        view.hide();
    }

    closeAllLoading() {
        this._loadingManager.closeAll();
    }

    get loading() {
        return this._loadingManager;
    }
}


FWManager.register("ui",new FWUIManager())

declare global {
    namespace globalThis {
        interface IFWManager {
            ui : FWUIManager
        }
    }
}