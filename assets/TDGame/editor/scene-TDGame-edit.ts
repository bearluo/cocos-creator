import { _decorator, assert, Component, EventTouch, instantiate, Node, Prefab, Vec3 } from 'cc';
import { FWFile } from '../../framework/common/FWFile';
import { WayPath } from '../simpleWayPointSystem/WayPath';
import { game, gameFunc } from '../common/constant';
import { WayPointEdit } from './OperatorPanel/WayPointEdit/WayPointEdit';
import { IMonster, ISceneConfig, ISceneConfigJson, ISpawner, IWayPathAnchors, WayPathAnchors } from '../common/SceneConfig';
import { MonsterFactory } from '../monster/MonsterFactory';
import { qAsset, uiFunc } from '../../framework/common/FWFunction';
import { MosterEdit } from './view/MosterEdit';
import { WayPathEdit } from './view/WayPathEdit';
import { SpawnerEdit } from './view/SpawnerEdit';
import { SpawnerEditOP } from './OperatorPanel/spawnerEdit/SpawnerEditOP';
import { SpawnerQueueEdit } from './view/SpawnerQueueEdit';
import { Monster } from '../monster/Monster';
import { Preview } from './OperatorPanel/preview/Preview';

const { ccclass, property,type } = _decorator;

// this.wayPathAnchors = [];
// wayPathAnchors.forEach(v=>{
//     let item = []
//     let count = Math.floor(v.length / 3);
//     for (let i = 0; i < count; i++) {
//         item.push(Vec3.fromArray(new Vec3(),v,i*3));
//     }
//     this.wayPathAnchors.push(item);
// })
class SceneConfig implements ISceneConfig {
    monster: IMonster[] = [];
    wayPathAnchors: IWayPathAnchors[] = [];
    spawner:ISpawner[] = [];
    // 序列化方法：将类实例转换为 JSON 格式的对象
    serialize(): string {
        let jsonObj:ISceneConfigJson = {
            wayPathAnchors: this.wayPathAnchors.map(v=>v.serialize()),
            spawner:this.spawner,
            monster:this.monster,
        };
        return JSON.stringify(jsonObj);
    }

    // 反序列化方法：将 JSON 格式的对象转换回类的实例
    static deserialize(json: string) {
        let obj = new SceneConfig();
        let jsonObj:ISceneConfigJson = JSON.safeParse(json) ?? {};
        let wayPathAnchors = (jsonObj.wayPathAnchors ?? []).map(v=>WayPathAnchors.deserialize(v))
        obj.wayPathAnchors = wayPathAnchors;
        obj.spawner = jsonObj.spawner ?? [];
        obj.monster = jsonObj.monster ?? [];
        return obj;
    }
}

@ccclass('scene_TDGame_edit')
export class scene_TDGame_edit extends Component {
    @property(Node)
    operatorPanel:Node;
    curShowOperatorPanel:Node;
    @property(WayPointEdit)
    wayPointEdit:WayPointEdit;
    @property(SpawnerEditOP)
    spawnerEditOP:SpawnerEditOP;
    @property(Preview)
    preview:Preview;
    @property(MonsterFactory)
    monsterFactory:MonsterFactory;

    config:SceneConfig;

    protected __preload(): void {
        game.edit = this;
    }

    start() {
        this.resetConfig(new SceneConfig())
        this.operatorPanel.children.forEach(v=>v.active = false);
        gameFunc.gotoEditMain();
    }

    update(deltaTime: number) {
        
    }

    saveConfig() {
        FWFile.save(this.config.serialize(),"sceneConfig_" + Date.now());
    }

    loadConfig() {
        FWFile.read()
            .then(async v=>{
                let config = SceneConfig.deserialize(v);
                uiFunc.asyncAssert(this);
                await this.monsterFactory.loadConfig(config);
                uiFunc.asyncAssert(this);
                this.resetConfig(config)
            })
            .catch((error:Error)=>{
                let errorMsg = error?.stack ?? "unknow"
                console.log(`loadConfig fail:${errorMsg}`);
            });
    }

    resetConfig(config:SceneConfig) {
        this.config = config;
    }

    showOperatorPanel(name:string,data?:any) {
        let operatorPanel = this.operatorPanel.getChildByName(name)
        if(operatorPanel) {
            if(this.curShowOperatorPanel) {
                this.curShowOperatorPanel.active = false;
                this.onLeaveOperatorPanel(this.curShowOperatorPanel.name);
            }
            this.curShowOperatorPanel = operatorPanel;
            this.curShowOperatorPanel.active = true;
            this.onEnterOperatorPanel(this.curShowOperatorPanel.name,data);
        }
    }

    onEnterOperatorPanel(name:string,data?:any) {
        switch(name) {
            case "Node_WayPointEdit": {
                assert(data,"Node_WayPointEdit need data")
                let {index,wayPathAnchors} = data as {index:number,wayPathAnchors: IWayPathAnchors};
                this.wayPointEdit.setWayPathAnchors(index,wayPathAnchors);
                break;
            }
            case "Node_SpawnerEdit": {
                assert(data,"Node_SpawnerEdit need data")
                let {spawner} = data as {spawner: ISpawner};
                this.spawnerEditOP.loadConfig({
                    wayPathAnchors:this.config.wayPathAnchors,
                    spawner:spawner
                });
                break;
            }
            case "Node_Preview": {
                this.preview.loadConfig(this.config);
                break;
            }
        }
    }

    onLeaveOperatorPanel(name:string) {
        switch(name) {
            case "Node_WayPointEdit":
                break;
        }
    }

    initOperatorMenu() {

    }

    saveWayPathAnchors(wayPathAnchors: IWayPathAnchors[]) {
        this.config.wayPathAnchors = wayPathAnchors.map(v=>v.clone());
    }

    allocMonster(monster_id:number) {
        return this.monsterFactory.allocMonster(monster_id);
    }

    freeMonster(monster:Monster) {
        this.monsterFactory.freeMonster(monster)
    }

    async showMonsterEdit() {
        let dialog = await uiFunc.showDialog({
            path: "editor/view/MosterEdit",
            bundleName: "TDGame"
        });
        uiFunc.asyncAssert(this);
        let mosterEdit = dialog.node.getComponent(MosterEdit);
        mosterEdit.loadConfig(this.config);
        return mosterEdit
    }

    deleteMonsterConfig(index:number) {
        this.config.monster.splice(index,1);
        this.monsterFactory.loadConfig(this.config);
    }

    addMonsterConfig(data:IMonster) {
        this.config.monster.push(data);
        this.monsterFactory.loadConfig(this.config);
    }

    changeMonsterConfig(index:number,data:IMonster) {
        this.config.monster[index] = data;
        this.monsterFactory.loadConfig(this.config);
    }

    async showWayPathEdit() {
        let dialog = await uiFunc.showDialog({
            path: "editor/view/WayPathEdit",
            bundleName: "TDGame"
        });
        uiFunc.asyncAssert(this);
        let wayPathEdit = dialog.node.getComponent(WayPathEdit);
        wayPathEdit.loadConfig(this.config);
        return wayPathEdit;
    }

    deleteWayPathConfig(index:number) {
        this.config.wayPathAnchors.splice(index,1);
    }

    addWayPathConfig(data:IWayPathAnchors) {
        this.config.wayPathAnchors.push(data);
    }

    changeWayPathConfig(index:number,data:IWayPathAnchors) {
        this.config.wayPathAnchors[index] = data;
    }

    async showSpawnerEdit() {
        let dialog = await uiFunc.showDialog({
            path: "editor/view/SpawnerEdit",
            bundleName: "TDGame"
        });
        uiFunc.asyncAssert(this);
        let spawnerEdit = dialog.node.getComponent(SpawnerEdit);
        spawnerEdit.loadConfig(this.config);
        return spawnerEdit;
    }

    deleteSpawnerConfig(index:number) {
        this.config.spawner.splice(index,1);
    }

    addSpawnerConfig(data:ISpawner) {
        this.config.spawner.push(data);
    }

    changeSpawnerConfig(index:number,data:ISpawner) {
        this.config.spawner[index] = data;
    }
    
    async showSpawnerQueueEdit() {
        let dialog = await uiFunc.showDialog({
            path: "editor/view/SpawnerQueueEdit",
            bundleName: "TDGame"
        });
        uiFunc.asyncAssert(this);
        let view = dialog.node.getComponent(SpawnerQueueEdit);
        view.loadConfig(this.config);
        return view;
    }
}


