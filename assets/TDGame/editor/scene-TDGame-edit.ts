import { _decorator, Component, EventTouch, Node, Vec3 } from 'cc';
import { FWFile } from '../../framework/common/FWFile';
import { WayPath } from '../simpleWayPointSystem/WayPath';
import { game, gameFunc } from '../common/constant';
import { WayPointEdit } from './OperatorPanel/WayPointEdit/WayPointEdit';
import { ISceneConfig, ISceneConfigJson, IWayPathAnchors, WayPathAnchors } from '../common/SceneConfig';
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
    wayPathAnchors: IWayPathAnchors[] = [];
    // 序列化方法：将类实例转换为 JSON 格式的对象
    serialize(): string {
        let jsonObj:ISceneConfigJson = {
            wayPathAnchors: this.wayPathAnchors.map(v=>v.serialize()),
        };
        return JSON.stringify(jsonObj);
    }

    // 反序列化方法：将 JSON 格式的对象转换回类的实例
    static deserialize(json: string) {
        let obj = new SceneConfig();
        let jsonObj:ISceneConfigJson = JSON.safeParse(json) ?? {};
        let wayPathAnchors = (jsonObj.wayPathAnchors ?? []).map(v=>WayPathAnchors.deserialize(v))
        obj.wayPathAnchors = wayPathAnchors;
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
        FWFile.read().then(v=>{
            console.log(v);
            this.resetConfig(SceneConfig.deserialize(v))
        }).catch((error)=>{
            console.log("loadConfig fail");
        });
    }

    resetConfig(config:SceneConfig) {
        this.config = config;
        this.wayPointEdit.setWayPathAnchors(this.config.wayPathAnchors);
    }

    onTouchShowOperatorPanel(event: EventTouch,customEventData:string="Node_main") {
        this.showOperatorPanel(customEventData);
    }

    showOperatorPanel(name:string) {
        let operatorPanel = this.operatorPanel.getChildByName(name)
        if(operatorPanel) {
            if(this.curShowOperatorPanel) {
                this.curShowOperatorPanel.active = false;
                this.onLeaveOperatorPanel(this.curShowOperatorPanel.name);
            }
            this.curShowOperatorPanel = operatorPanel;
            this.curShowOperatorPanel.active = true;
            this.onEnterOperatorPanel(this.curShowOperatorPanel.name);
        }
    }

    onEnterOperatorPanel(name:string) {
        switch(name) {
            case "Node_WayPointEdit":
                break;
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
}


