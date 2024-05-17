import { _decorator, assert, ccenum, Component, instantiate, Node, Pool, Prefab } from 'cc';
import { Monster } from './Monster';
import { ISceneConfig } from '../common/SceneConfig';
import { qAsset, uiFunc } from '../../framework/common/FWFunction';
const { ccclass, property,type } = _decorator;

@ccclass('MonsterFactory')
export class MonsterFactory extends Component {
    monsterPool:Map<number,Pool<Node>> = new Map();
    monsterUnknowPool:Pool<Node> = new Pool(()=>{
        let node = new Node();
        node.addComponent(Monster);
        return node;
    },5,(node)=>{
        node.destroy();
    });
    start() {

    }

    update(deltaTime: number) {
        
    }

    async loadConfig(config:ISceneConfig) {
        let {monster} = config;
        this.monsterPool.forEach(v=>v.destroy());
        this.monsterPool.clear();
        let list:Promise<Prefab>[] = [];
        for(let i = 0;i<monster.length;i++) {
            let {prefabPath,prefabBundelName} = monster[i];
            list.push(qAsset.loadAsset(prefabBundelName,prefabPath, Prefab));
        }
        let prefabes = await Promise.all(list);
        uiFunc.asyncAssert(this);
        for(let i = 0;i<monster.length;i++) {
            let {mosterID,maxCache=5} = monster[i];
            let prefab = prefabes[i];
            this.monsterPool.set(mosterID,new Pool(()=>{
                let node = instantiate(prefab);
                node.parent = this.node;
                return node;
            },maxCache,(node)=>{
                node.destroy();
            }));
        }
    }


    allocMonster(monster_id:number) {
        let pool = this.monsterPool.get(monster_id) ?? this.monsterUnknowPool;
        assert(pool,`monster id:${monster_id} is not exist`);
        let node = pool.alloc();
        let monster = node.getComponent(Monster);
        monster.moster_id = monster_id;
        return monster
    }

    freeMonster(monster:Monster) {
        let node = monster.node;
        assert(monster,"monster must be have Monster Component");
        let pool = this.monsterPool.get(monster.moster_id) ?? this.monsterUnknowPool;
        pool.free(node);
        node.parent = null;
    }

    onDestroy(): void {
        this.monsterPool.forEach(v=>v.destroy());
        this.monsterPool.clear();
    }
}


