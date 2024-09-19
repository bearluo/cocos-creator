import { _decorator, assert, ccenum, Component, error, instantiate, Node, Pool, Prefab } from 'cc';
import { Monster } from './Monster';
import { IMonster, ISceneConfig } from '../common/SceneConfig';
import { qAsset, uiFunc } from '../../framework/common/FWFunction';
import { monster_id, MonsterBundleName, MonsterConfig } from './share';
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

    loadConfig(config:ISceneConfig) {
        let {monster} = config;
        this.monsterPool.forEach(v=>v.destroy());
        this.monsterPool.clear();
        for(let i = 0;i<monster.length;i++) {
            let {mosterID,maxCache=5} = monster[i];
            let prefabPath = MonsterConfig[mosterID]
            let prefab = qAsset.getAsset(MonsterBundleName,prefabPath, Prefab)
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
        let monster = node.getComponent(Monster) ?? node.addComponent(Monster);
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


