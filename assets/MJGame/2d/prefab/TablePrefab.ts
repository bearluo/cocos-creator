import { _decorator, Component, instantiate, IVec2Like, Node, Pool, Prefab, Vec2 } from 'cc';
import { MJBase } from './MJBase';
import { TablePosConfig, TableTileCount } from './TablePosConfig';
import { TileMode } from '../../core/Tile';
import { eChiType, eCPGType, eGangType, ePlayerID, I_CPGPile, Offline } from '../../core/Config';
import { HandTouchLayer } from './HandTouchLayer';
import { FWEvent } from 'db://assets/framework/events/FWEvents';
import { Log } from 'db://assets/framework/common/FWLog';
const { ccclass, property } = _decorator;

const DiscardPileTileMode = {
    [ePlayerID.Top] : TileMode.TOP_QP,
    [ePlayerID.Left] : TileMode.LEFT_QP,
    [ePlayerID.Right] : TileMode.RIGHT_QP,
    [ePlayerID.Bottom] : TileMode.BOTTOM_QP,
}
const HandTileMode = {
    [ePlayerID.Top] : TileMode.TOP_HAND,
    [ePlayerID.Left] : TileMode.LEFT_HAND,
    [ePlayerID.Right] : TileMode.RIGHT_HAND,
    [ePlayerID.Bottom] : TileMode.BOTTOM_HAND,
}
const CPGTileMode = {
    [ePlayerID.Top] : TileMode.TOP_CPG_Z,
    [ePlayerID.Left] : TileMode.LEFT_CPG_Z,
    [ePlayerID.Right] : TileMode.RIGHT_CPG_Z,
    [ePlayerID.Bottom] : TileMode.BOTTOM_CPG_Z,
}

export interface MJGame_TablePrefab_event_protocol {
    /**
     * 弃牌
     */
    discard_tile
}
interface I_CPGPile_View extends I_CPGPile {
    views: MJBase[];
}

const GangOffsetPos:IVec2Like[] = [
    {x:0,y:10},
    {x:8,y:0},
    {x:0,y:10},
    {x:-8,y:0},
];

@ccclass('TablePrefab')
export class TablePrefab extends Component {
    event:FWEvent<MJGame_TablePrefab_event_protocol> = new FWEvent();
    @property({
        type:Prefab,
        tooltip:"麻将预设"
    })
    tilePrefab:Prefab = null;
    @property({
        type:HandTouchLayer,
        tooltip: "手牌触摸层"
    })
    handTouchLayer:HandTouchLayer = null;

    tileCount:number = 144;
    tileFactory:Pool<MJBase>;
    playerCount:number = 4;

    discardPile: MJBase[][] = []; // 已出牌堆
    handPile: MJBase[][] = []; // 手牌
    cpgPile: I_CPGPile_View[][] = []; // 吃碰杠区域

    selectTile: MJBase = null;
    selectTilePos: Vec2 = new Vec2();
    selectTileOffsetY: number = 20;
    selectDiscardTile: MJBase = null;

    start() {
        this.tileFactory = new Pool(this.createTile.bind(this),this.tileCount,this.destroyTile.bind(this));
        for (let id = 0; id < this.playerCount; id++) {
            this.discardPile[id] = [];
            this.handPile[id] = [];
            this.cpgPile[id] = [];
        }
        this.handTouchLayer?.init(this);
    }

    update(deltaTime: number) {
        
    }
    /**
     * 弃牌
     * @param playerID 
     * @param id 
     */
    discardTile(playerID:number,id:number) {
        let discardPile = this.discardPile[playerID];
        let pre_tile = discardPile[discardPile.length-1]
        let {discardPilePos} = TablePosConfig[playerID];
        let mode = DiscardPileTileMode[playerID];
        let tile = this.tileFactory.alloc();
        let index = discardPile.length;
        let pos = discardPilePos[index];
        tile.node.name = `discardPile_${ePlayerID[playerID]}_${index}`;
        tile.node.parent = this.node;
        tile.node.setPosition(pos.x,pos.y);

        if (pre_tile) {
            if (playerID == ePlayerID.Top) {
                tile.node.setSiblingIndex(pre_tile.node.getSiblingIndex());
            } else if (playerID == ePlayerID.Left) {
                tile.node.setSiblingIndex(pre_tile.node.getSiblingIndex());
            } else if (playerID == ePlayerID.Right) {
                tile.node.setSiblingIndex(pre_tile.node.getSiblingIndex());
            } else if (playerID == ePlayerID.Bottom) {
                tile.node.setSiblingIndex(pre_tile.node.getSiblingIndex()+1);
            }
        }

        tile.id = id;
        tile.mode = mode;
        tile.modeIndex = index;
        this.discardPile[playerID].push(tile);
        // 移除手牌
        this.removeTile(playerID,id);
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
        IDs.forEach((id,index)=>{
            this.discardTile(playerID,id);
        })
        this.updateDiscardPile(playerID);
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
     * 发牌
     * @param playerTileIDs 
     */
    sendTile(playerTileIDs:number[][]) {
        playerTileIDs.forEach((IDs,index)=>{
            this.resetHandPile(index,IDs);
        })
    }
    /**
     * 摸牌
     * @param playerID 
     * @param id 
     */
    drawTile(playerID:number,id:number) {
        let handPile = this.handPile[playerID];
        let pre_tile = handPile[handPile.length-1]
        let {handPilePos} = TablePosConfig[playerID];
        let mode = HandTileMode[playerID];
        let tile = this.tileFactory.alloc();
        let index = handPile.length;
        let pos = handPilePos[13];
        tile.node.name = `handPile_${ePlayerID[playerID]}_${index}`;
        tile.node.parent = this.node;
        tile.node.setPosition(pos.x,pos.y);
        if (pre_tile) {
            tile.node.setSiblingIndex(this.getHandTileIndex(playerID,tile,pre_tile));
        }
        tile.id = id;
        tile.mode = mode;
        tile.modeIndex = index;
        this.handPile[playerID].push(tile);
    }
    /**
     * 移除手牌
     */
    removeTile(playerID:number,id:number) {
        let handPile = this.handPile[playerID];
        let index = handPile.findIndex(v=>v.id == id);
        if (index!=-1) {
            let tile = handPile.splice(index, 1)[0];
            tile.node.removeFromParent();
            this.tileFactory.free(tile);
        }
        this.sortHandPile(playerID);
        this.updateHandPile(playerID);
    }

    /**
     * 重置手牌堆
     * @param playerID 
     * @param IDs 
     */
    resetHandPile(playerID:number,IDs:number[]) {
        let handPile = this.handPile[playerID];
        handPile.forEach(v=>{
            v.node.removeFromParent();
        })
        this.tileFactory.freeArray(handPile);
        handPile.length = 0;
        IDs.forEach((id,index)=>{
            this.drawTile(playerID,id);
        })
        this.updateHandPile(playerID);
    }

    sortHandPile(playerID:number) {
        let handPile = this.handPile[playerID];
        handPile.sort((a, b) => {
            if (a.type === b.type) {
                return a.value - b.value;
            }
            return a.type - b.type;
        });
    }

    updateHandPile(playerID:number) {
        let handPile = this.handPile[playerID];
        let {handPilePos} = TablePosConfig[playerID];
        let pre_tile: MJBase = null;
        let length = handPile.length;
        let offset = length == 14 ? 0 : 13 - length;
        handPile.forEach((tile,index)=>{
            let pos = handPilePos[index+offset];
            tile.node.setPosition(pos.x,pos.y);
            if (pre_tile) {
                tile.node.setSiblingIndex(this.getHandTileIndex(playerID,tile,pre_tile));
            }
            pre_tile = tile;
        })

        if ( this.selectTile ) {
            let pos = this.selectTilePos;
            this.selectTile.node.setPosition(pos.x,pos.y + this.selectTileOffsetY);
        }
    }

    getHandTileIndex(playerID:number,cur_tile:MJBase, pre_tile: MJBase) {
        let curIndex = cur_tile.node.getSiblingIndex();
        let preIndex = pre_tile.node.getSiblingIndex();
        if (playerID == ePlayerID.Top) {
            return curIndex < preIndex ? curIndex : preIndex;
        } else if (playerID == ePlayerID.Left) {
            return curIndex < preIndex ? curIndex : preIndex + 1;
        } else if (playerID == ePlayerID.Right) {
            return curIndex < preIndex ? curIndex : preIndex;
        } else if (playerID == ePlayerID.Bottom) {
            return curIndex < preIndex ? curIndex : preIndex + 1;
        }
    }
    
    /**
     * 吃碰刚
     * @param playerID 
     * @param id 
     */
    private cpgTile(playerID: number, ids: number[], type: eCPGType, CPType?: eChiType | eGangType) {
        const cpgPile = this.cpgPile[playerID];
        const length = cpgPile.length;
        let index = length * 4;
        const pre_tile = cpgPile[length - 1]?.views[3] || cpgPile[length - 1]?.views[4];
        const { cpgPilePos } = TablePosConfig[playerID];
        const mode = CPGTileMode[playerID];
        const newCpgPile: MJBase[] = [];

        ids.forEach((id, i) => {
            const tile = this.tileFactory.alloc();
            tile.node.parent = this.node;
            tile.id = id;
            this.addTileToCPGPile(playerID, tile, pre_tile, index, mode, type, CPType,i === 3);
            newCpgPile.push(tile);
            index++;
        });

        const data: I_CPGPile_View = {
            tileIDs: ids,
            type: type,
            views: newCpgPile,
        };

        if (type === eCPGType.gang) {
            data.gangType = CPType as eGangType;
        } else if (type === eCPGType.chi) {
            data.chiType = CPType as eChiType;
        }

        this.cpgPile[playerID].push(data);
    }

    private addTileToCPGPile(playerID: number, tile: MJBase, pre_tile: MJBase, index: number, mode: TileMode, type: eCPGType, CPType?: eChiType | eGangType, isFour: boolean = false) {
        const { cpgPilePos } = TablePosConfig[playerID];
        let pos = cpgPilePos[index];
        
        if (isFour) {
            pos = cpgPilePos[index - 2];
            tile.node.name = `cpgPile_${ePlayerID[playerID]}_${index}_2`;
            const offsetPos = GangOffsetPos[playerID];
            tile.node.setPosition(pos.x + offsetPos.x, pos.y + offsetPos.y);
            tile.mode = mode;
            tile.modeIndex = index - 2;
        } else {
            tile.mode = (type === eCPGType.gang && CPType === eGangType.an_gang) ? mode + 1 : mode;
            tile.node.name = `cpgPile_${ePlayerID[playerID]}_${index}`;
            tile.node.setPosition(pos.x, pos.y);
            tile.modeIndex = index;
        }

        if (index % 4 === 3) {
            pos = cpgPilePos[index - 2];
            const offsetPos = GangOffsetPos[playerID];
            tile.node.setPosition(pos.x + offsetPos.x, pos.y + offsetPos.y);
            tile.mode = mode;
            tile.modeIndex = index - 2;
        } else {
            tile.mode = (type === eCPGType.gang && CPType === eGangType.an_gang) ? mode + 1 : mode;
            tile.node.setPosition(pos.x, pos.y);
            tile.modeIndex = index;
        }

        if (pre_tile) {
            const siblingIndex = pre_tile.node.getSiblingIndex();
            if (playerID === ePlayerID.Top || playerID === ePlayerID.Right) {
                tile.node.setSiblingIndex(siblingIndex);
            } else {
                tile.node.setSiblingIndex(siblingIndex + 1);
            }
        }
    }
    /**
     * 重置手牌堆
     * @param playerID 
     * @param IDs 
     */
    resetCPGPile(playerID:number,datas:I_CPGPile[]) {
        let cpgPile = this.cpgPile[playerID];
        let freeArray = cpgPile;
        freeArray.forEach(data=>{
            data.views.forEach(v=>{
                v.node.removeFromParent();
            })
            this.tileFactory.freeArray(data.views);
        })
        cpgPile.length = 0;
        datas.forEach((data,index)=>{
            this.cpgTile(playerID,data.tileIDs,data.type,data.chiType||data.gangType);
        })
        this.updateCPGPile(playerID);
    }

    updateCPGPile(playerID:number) {
        let cpgPile = this.cpgPile[playerID];
        let {cpgPilePos} = TablePosConfig[playerID];
        let index = 0;
        cpgPile.forEach((v)=>{
            v.views.forEach((tile,i)=>{
                if( i == 3 ) {
                    let pos = cpgPilePos[index-2];
                    let offsetPos = GangOffsetPos[playerID];
                    tile.node.setPosition(pos.x + offsetPos.x,pos.y + offsetPos.y);
                } else {
                    let pos = cpgPilePos[index];
                    tile.node.setPosition(pos.x,pos.y);
                    index++;
                }
            });
            index++;
        })
    }

    selectHandTile(tile:MJBase,doubleClick:boolean) {
        if ( this.selectTile == tile) {
            if( doubleClick ) {
                Log.printDebug("双击出牌");
                this.selectDiscardTile = tile;
                let data:Offline.DiscardTileData = {
                    index:ePlayerID.Bottom,
                    tileID:this.selectDiscardTile.id
                }
                this.event.emit(this.event.key.discard_tile,data);
            }
            
            if ( this.selectTile ) {
                let pos = this.selectTilePos;
                this.selectTile.node.setPosition(pos.x,pos.y);
                this.selectTile = null;
            }
            return
        }
        // 选择牌状态下 双击牌会放下 也算双击
        if ( this.selectTile == null && doubleClick ) {
            Log.printDebug("双击出牌");
            this.selectDiscardTile = tile;
            let data:Offline.DiscardTileData = {
                index:ePlayerID.Bottom,
                tileID:this.selectDiscardTile.id
            }
            this.event.emit(this.event.key.discard_tile,data);
            return 
        }

        if ( this.selectTile ) {
            let pos = this.selectTilePos;
            this.selectTile.node.setPosition(pos.x,pos.y);
        }

        this.selectTile = tile;

        if ( this.selectTile ) {
            let pos = this.selectTile.node.position;
            Vec2.copy<IVec2Like>(this.selectTilePos,pos);
            this.selectTile.node.setPosition(pos.x,pos.y + this.selectTileOffsetY);
        }
    }

    moveSelectHandTile(offsetPos:Vec2) {
        if ( this.selectTile ) {
            let pos = this.selectTilePos;
            this.selectTile.node.setPosition(pos.x + offsetPos.x,pos.y + offsetPos.y);
        }
    }

    moveSelectHandTileEnd(discardTile:boolean) {
        if( discardTile ) {
            Log.printDebug("拖拽出牌");
            this.selectDiscardTile = this.selectTile;
            let data:Offline.DiscardTileData = {
                index:ePlayerID.Bottom,
                tileID:this.selectDiscardTile.id
            }
            this.event.emit(this.event.key.discard_tile,data);
        }
        let pos = this.selectTilePos;
        this.selectTile.node.setPosition(pos.x,pos.y);
        this.selectTile = null;

    }

    /**
     * 吃牌
     */
    chiTile(playerID:number,id:number,type:number) {
        if ( type == eChiType.front ) {
            this.removeTile(playerID,id+1);
            this.removeTile(playerID,id+2);
            this.cpgTile(playerID,[id,id+1,id+2],eCPGType.chi,type);
        }else if ( type == eChiType.middle ) {
            this.removeTile(playerID,id-1);
            this.removeTile(playerID,id+1);
            this.cpgTile(playerID,[id-1,id,id+1],eCPGType.chi,type);
        }else if ( type == eChiType.back ) {
            this.removeTile(playerID,id-2);
            this.removeTile(playerID,id-1);
            this.cpgTile(playerID,[id-2,id-1,id],eCPGType.chi,type);
        }
    }
    /**
     * 碰牌
     * @param playerID 
     * @param id 
     */
    pengTile(playerID:number,id:number) {
        this.removeTile(playerID,id);
        this.removeTile(playerID,id);
        this.cpgTile(playerID,[id,id,id],eCPGType.peng);
    }

    /**
     * 碰牌
     * @param playerID 
     * @param id 
     */
    gangTile(playerID:number,id:number,type:number) {
        if ( type == eGangType.ming_gang ) {
            this.removeTile(playerID,id);
            this.removeTile(playerID,id);
            this.removeTile(playerID,id);
            this.cpgTile(playerID,[id,id,id,id],eCPGType.gang,type);
        }else if ( type == eGangType.an_gang ) {
            this.removeTile(playerID,id);
            this.removeTile(playerID,id);
            this.removeTile(playerID,id);
            this.removeTile(playerID,id);
            this.cpgTile(playerID,[id,id,id,id],eCPGType.gang,type);
        }else if ( type == eGangType.bu_gang ) {
            this.removeTile(playerID,id);
            let pile = this.cpgPile[playerID];
            pile.forEach(v=>{
                if ( v.tileIDs[0] == id ) {
                    v.type = eCPGType.gang;
                    v.tileIDs.push(id);
                    v.gangType = eGangType.bu_gang;
                    let newCpgPile = v.views;
                    let pre_tile = newCpgPile[2];
                    let mode = pre_tile.mode;
                    let modeIndex = pre_tile.modeIndex;
                    const tile = this.tileFactory.alloc();
                    tile.node.parent = this.node;
                    tile.id = id;
                    this.addTileToCPGPile(playerID, tile, pre_tile, modeIndex, mode, eCPGType.gang, eGangType.bu_gang,true);
                    newCpgPile.push(tile);
                }
            });
        }
    }
    
    /**
     * 胡牌
     * @param playerID 
     * @param id 
     */
    huTile(playerID:number,id:number) {
        // this.removeTile(playerID,id);
        // this.removeTile(playerID,id);
        // this.cpgTile(playerID,[id,id,id],eCPGType.peng);
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

