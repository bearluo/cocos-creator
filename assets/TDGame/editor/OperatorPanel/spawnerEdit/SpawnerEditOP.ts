import { _decorator, Component, Node } from 'cc';
import { ISpawner, IWayPathAnchors } from '../../../common/SceneConfig';
import { WayPathRenderer } from '../../../simpleWayPointSystem/WayPathRenderer';
import { uiFunc } from '../../../../framework/common/FWFunction';
import { game, gameFunc } from '../../../common/constant';
import { SpawnerQueueEdit } from '../../view/SpawnerQueueEdit';
import { Spawner } from '../../../monster/Spawner';
const { ccclass, property, type } = _decorator;

interface ISpawnerEditConfig {
    spawner:ISpawner;
    wayPathAnchors:IWayPathAnchors[],
}


@ccclass('SpawnerEditOP')
export class SpawnerEditOP extends Component {
    data: ISpawner;
    @type(WayPathRenderer)
    wayPathRenderer:WayPathRenderer;
    @type(Spawner)
    spawner:Spawner;
    
    wayPathMap:Map<string,IWayPathAnchors> = new Map();

    protected onLoad(): void {
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_back"),gameFunc.gotoEditMain);
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_monster"),this.onMonsterEditClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_preview"),this.onPreviewClick.bind(this));
    }

    start() {
        this.spawner.spawnerFactory = game.edit;
    }

    update(deltaTime: number) {
        this.spawner.walk(deltaTime);
    }

    loadConfig(config:ISpawnerEditConfig) {
        let {wayPathAnchors,spawner} = config;
        this.wayPathMap.clear();
        wayPathAnchors.forEach(v=>{
            this.wayPathMap.set(v.name,v);
        })
        this.setSpawner(spawner);
    }

    setSpawner(data: ISpawner) {
        this.data = data;
        let wayPathAnchors = this.wayPathMap.get(data.pathName);
        this.wayPathRenderer.path.reset(wayPathAnchors.anchors);
        this.spawner.setAnchors(wayPathAnchors.anchors);
        this.wayPathRenderer.drawPath();
    }

    async onMonsterEditClick() {
        let wayPathEdit = (await gameFunc.showSpawnerQueueEdit()) as SpawnerQueueEdit;
        uiFunc.asyncAssert(this);
        wayPathEdit.updateList(this.data.queue);
    }

    onPreviewClick() {
        let spawner = this.spawner;
        spawner.queue.length = 0;
        this.data.queue.forEach(v=>{
            spawner.addSpawnerItem(v.showTime,v.monsterID);
        })
        spawner.reset();
    }
}


