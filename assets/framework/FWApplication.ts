import { _decorator, assetManager, Component, EventTarget, director, Node, UITransform, Widget, Prefab, instantiate, AssetManager, RenderRoot2D, System, ISchedulable, Director } from 'cc';
import { FWManager } from './manager/FWManager';
import { Events } from './events/FWEvents';
import { FWTimer } from './common/FWTimer';
import { EDITOR, PREVIEW } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('FWApplication')
export class FWApplication extends EventTarget implements ISchedulable {
    id?: string;
    uuid?: string;

    private static _instance: FWApplication;
    static get instance(): FWApplication {
        return this._instance;
    }
    manager: FWManager;
    

    constructor() {
        super();
        this.id = this.uuid = "FWApplication"
        if(FWApplication._instance) FWApplication._instance.dectroy();
        globalThis.app = this as any;
        FWApplication._instance = this;
        FWTimer.scheduleUpdate(this, System.Priority.HIGH, false);
        this.initManager()
        this.__preload();
        this.start();
        this.emit(Events.MANAGER_INIT_END);
    }

    protected initManager() {
        this.manager = new FWManager();
        this.manager.initManager();
    }

    __preload() {
        this.manager.__preload();
    }

    start() {
        this.manager.start();
    }

    update(deltaTime: number) {
        this.manager.update(deltaTime);
    }

    dectroy() {
        this.manager.dectroy();
        globalThis.app = null;
        FWApplication._instance = null;
    }
}

export type ApplicationType = InstanceType<typeof FWApplication>

director.once(Director.EVENT_BEFORE_SCENE_LAUNCH, () => {
    if (!EDITOR || PREVIEW || globalThis.isPreviewProcess) {
        new FWApplication();
    }
})

declare global {
    namespace globalThis {
        interface IFWApp {
            manager :IFWManager & FWManager
        }
        interface IFWManager {
        
        }
        var app:IFWApp & FWApplication;
    }
}