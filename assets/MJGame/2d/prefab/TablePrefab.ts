import { _decorator, Component, instantiate, Node, Pool, Prefab, Vec2 } from 'cc';
import { MJBase } from './MJBase';
import { Table } from '../../core/Table';
import { TablePosConfig } from './TablePosConfig';
import { TileMode } from '../../core/Tile';
import { ePlayerID } from '../../core/Config';
const { ccclass, property } = _decorator;

const DiscardPileTileMode = {
    [ePlayerID.Top] : TileMode.TOP_QP,
    [ePlayerID.Left] : TileMode.LEFT_QP,
    [ePlayerID.Right] : TileMode.RIGHT_QP,
    [ePlayerID.Bottom] : TileMode.BOTTOM_QP,
}


@ccclass('TablePrefab')
export class TablePrefab extends Component {
    @property({
        type:Prefab,
        tooltip:"麻将预设"
    })
    tilePrefab:Prefab = null;

    tileCount:number = 144;
    tileFactory:Pool<MJBase>;
    playerCount:number = 4;

    discardPile: MJBase[][] = []; // 已出牌堆
    wall:MJBase[][] = []; // 牌堆

    start() {
        this.tileFactory = new Pool(this.createTile.bind(this),this.tileCount,this.destroyTile.bind(this));
        for (let index = 0; index < this.playerCount; index++) {
            this.discardPile[index] = [];
            this.wall[index] = [];
        }
    }

    update(deltaTime: number) {
        
    }
    /**
     * 弃牌
     * @param playerID 
     * @param id 
     */
    discard(playerID:number,id:number) {

        let tile = this.tileFactory.alloc();
        tile.id = id;
        tile.node.parent = this.node;
        this.discardPile[playerID].push(tile);
    }

    /**
     * 重置牌堆
     * @param playerID 
     * @param IDs 
     */
    resetWall(playerID:number,IDs:number[]) {
        let wall = this.wall[playerID];
        wall.forEach(v=>{
            v.node.removeFromParent();
        })
        this.tileFactory.freeArray(wall);
        wall.length = 0;

        IDs.forEach(id=>{
            let tile = this.tileFactory.alloc();
            tile.id = id;
            tile.node.parent = this.node;
            this.wall[playerID].push(tile);
        })
    }

    /**
     * 重置弃牌堆
     * @param playerID 
     * @param IDs 
     */
    resetDiscardPile(playerID:number,IDs:number[]) {
        let discardPile = this.discardPile[playerID];
        discardPile.forEach(v=>{
            v.node.removeFromParent();
        })
        this.tileFactory.freeArray(discardPile);
        discardPile.length = 0;
        let mode = DiscardPileTileMode[playerID];
        IDs.forEach((id,index)=>{
            let tile = this.tileFactory.alloc();
            tile.node.name = `${ePlayerID[playerID]}_${index}`;
            tile.node.parent = this.node;
            tile.id = id;
            tile.mode = mode;
            tile.modeIndex = index;
            this.discardPile[playerID].push(tile);
        })

        this.updateDiscardPile(playerID);
    }

    getDiscardPilePos(playerID:number,index:number) {
        let {discardPilePos} = TablePosConfig[playerID];
        return discardPilePos[index];
    }

    updateDiscardPile(playerID:number) {
        let discardPile = this.discardPile[playerID];
        let {discardPilePos} = TablePosConfig[playerID];
        discardPile.forEach((v,index)=>{
            let pos = discardPilePos[index];
            v.node.setPosition(pos.x,pos.y);
        })
    }

    /**
     * 创建麻将
     * @returns 
     */
    createTile() {
        let node = instantiate(this.tilePrefab);
        return node.getComponent(MJBase);
    }
    /**
     * 销毁麻将
     * @param obj 
     */
    destroyTile(obj:MJBase) {
        obj.node.destroy();
    }

    protected onDestroy(): void {
        this.tileFactory?.destroy();
    }
}


function executeInEditMode(target: typeof TablePrefab): void | typeof TablePrefab {
    throw new Error('Function not implemented.');
}

