import { _decorator, Component, instantiate, Node, Pool, Prefab } from 'cc';
import { ISpawner, IWayPathAnchors } from '../../../common/SceneConfig';
import { version } from 'gltf-validator';
import { verifier } from 'protobufjs';
import { Spawner } from '../../../monster/Spawner';
import { WayPath } from '../../../simpleWayPointSystem/WayPath';
import { uiFunc } from '../../../../framework/common/FWFunction';
import { game, gameFunc } from '../../../common/constant';
import { WayPathRenderer } from '../../../simpleWayPointSystem/WayPathRenderer';
const { ccclass, property,type } = _decorator;

interface IPreviewConfig {
    wayPathAnchors:IWayPathAnchors[],
    spawner:ISpawner[],
}


@ccclass('Preview')
export class Preview extends Component {
    @type(Node)
    spawnerNode:Node;
    @type(Prefab)
    spawnerPrefab:Prefab;
    @type(Node)
    wayPathRendererNode:Node;
    @type(Prefab)
    wayPathRendererPrefab:Prefab;
    @type(Node)
    monsterLayer:Node;

    wayPathMap:Map<string,IWayPathAnchors> = new Map();

    list:{spawner:Spawner,wayPath:WayPathRenderer}[] = [];

    spawnerPool:Pool<Spawner>;
    wayPathPool:Pool<WayPathRenderer>;

    private _curTime:number = 0;
    private _running:boolean = false;
    // private 
    protected __preload(): void {
        this.spawnerPool = new Pool<Spawner>(()=>{
            return instantiate(this.spawnerPrefab).getComponent(Spawner);
        },10,(v)=>{
            v.node.destroy();
        });
        this.wayPathPool = new Pool<WayPathRenderer>(()=>{
            return instantiate(this.wayPathRendererPrefab).getComponent(WayPathRenderer);
        },10,(v)=>{
            v.node.destroy();
        });
    }

    start() {
        uiFunc.onClickSfx(this.node.getChildByPath("Node_left/Button_back"),gameFunc.gotoEditMain);
        uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_start"),this.startPreview.bind(this));
        uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_stop"),this.stopPreview.bind(this));
        uiFunc.onClickSfx(this.node.getChildByPath("Node_right/Button_reset"),this.resetPreview.bind(this));
    }

    update(deltaTime: number) {
        if(this._running) this.tick(deltaTime);
    }

    tick(deltaTime: number) {
        this._curTime += deltaTime;
        this.list.forEach(v=>v.spawner.tick(deltaTime));
    }

    loadConfig(config:IPreviewConfig) {
        let {wayPathAnchors,spawner} = config;
        this.wayPathMap.clear();
        wayPathAnchors.forEach(v=>{
            this.wayPathMap.set(v.name,v);
        })

        this.list.forEach(v=>{
            this.spawnerPool.free(v.spawner);
            this.wayPathPool.free(v.wayPath);
        });
        this.list.length = 0;
        this.spawnerNode.removeAllChildren();
        this.wayPathRendererNode.removeAllChildren();

        spawner.forEach(v=>{
            let spawner = this.spawnerPool.alloc();
            spawner.spawnerFactory = game.edit;
            spawner.setAnchors(this.wayPathMap.get(v.pathName)?.anchors ?? []);
            spawner.queue.length = 0;
            spawner.monsterLayer = this.monsterLayer;
            v.queue.forEach(v=>{
                spawner.addSpawnerItem(v.showTime,v.monsterID);
            })
            spawner.node.parent = this.spawnerNode;
            spawner.reset();

            
            let wayPath = this.wayPathPool.alloc();
            wayPath.node.parent = this.wayPathRendererNode;
            wayPath.path.reset(this.wayPathMap.get(v.pathName)?.anchors ?? [])
            wayPath.drawPath();

            this.list.push({
                spawner:spawner,
                wayPath:wayPath,
            });
        });
    }

    startPreview() {
        this._running = true;
    }

    stopPreview() {
        this._running = false;
    }

    setProgress(progress:number) {
        // this.progress.progress = progress;
    }

    resetPreview() {
        this.list.forEach(v=>v.spawner.reset());
    }
}


