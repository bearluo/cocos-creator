import { _decorator, assert, ccenum, Component, error, instantiate, Node, Pool, Prefab } from 'cc';
import { Monster } from './Monster';
import { IMonster, ISceneConfig } from '../common/SceneConfig';
import { qAsset, uiFunc } from '../../framework/common/FWFunction';
import { monster_id, MonsterBundleName, MonsterConfig } from './share';
const { ccclass, property,type } = _decorator;

@ccclass('MonsterFactory')
export class MonsterFactory extends Component {
    monsterPool:Map<number,Pool<Node>> = new Map();
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

    hasMonsterPool(monster_id:number){
        return this.monsterPool.has(monster_id)
    }

    newMonsterPool(monster_id:number,maxCache:number) {
        assert(!this.hasMonsterPool(monster_id),"MonsterPool is exist");
        let prefabPath = MonsterConfig[monster_id];
        let prefab = qAsset.getAsset(MonsterBundleName,prefabPath, Prefab);
        this.monsterPool.set(monster_id,new Pool(()=>{
            let node = instantiate(prefab);
            node.parent = this.node;
            return node;
        },maxCache,(node)=>{
            node.destroy();
        }));
    }

    changeMonsterPoolMaxCache(monster_id:number,maxCache:number) {
        assert(this.hasMonsterPool(monster_id),"MonsterPool is not exist");
        this.monsterPool.get(monster_id)
    }

    allocMonster(monster_id:number) {
        assert(this.hasMonsterPool(monster_id),"MonsterPool is not exist");
        let pool = this.monsterPool.get(monster_id);
        assert(pool,`monster id:${monster_id} is not exist`);
        let node = pool.alloc();
        let monster = node.getComponent(Monster) ?? node.addComponent(Monster);
        monster.monster_id = monster_id;
        return monster
    }

    freeMonster(monster:Monster) {
        let node = monster.node;
        assert(monster,"monster must be have Monster Component");
        assert(this.hasMonsterPool(monster.monster_id),"MonsterPool is not exist");
        let pool = this.monsterPool.get(monster.monster_id);
        pool.free(node);
        node.parent = null;
    }

    onDestroy(): void {
        this.monsterPool.forEach(v=>v.destroy());
        this.monsterPool.clear();
    }
}


