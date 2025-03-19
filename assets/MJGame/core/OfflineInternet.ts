import string from "sprintf-js";
import { eChiType, eGangType, eOfflineErrorID, eOfflineServerID, ePlayerID, Offline } from "./Config";
import { Internet, Server } from "./Internet";
import { Rule } from "./Rule";
import { Table } from "./Table";
import { Tile } from "./Tile";
import { Log } from "../../framework/common/FWLog";
import { assert } from "cc";

export class OfflineInternet extends Internet {
    server:OfflineServer = new OfflineServer(this);
    sendDiscardTile(playID: ePlayerID, tileID: number): void {
        this.server.onDiscardTile({
            index:playID,
            tileID:tileID
        })
    }
    sendChiTile(playID: ePlayerID, tileID: number,type: eChiType): void {
        this.server.onChiTile({
            index:playID,
            tileID:tileID,
            type:type,
        })
    }
    sendPengTile(playID: ePlayerID, tileID: number): void {
        this.server.onPengTile({
            index:playID,
            tileID:tileID
        })
    }
    sendGangTile(playID: ePlayerID, tileID: number, gangType: eGangType): void {
        this.server.onGangTile({
            index:playID,
            tileID:tileID,
            type:gangType,
        })
    }

    sendHuTile(playID: ePlayerID): void {
        this.server.onHuTile({
            index:playID,
        })
    }

    sendCancelOperate(playID: ePlayerID): void {
        this.server.onCancelOperate({
            index:playID,
        })
    }
    
    sendPlayerReady(playID: ePlayerID): void {
        this.server.onPlayerReady({
            index:playID
        });
    }
    sendPlayerCancelReady(playID: ePlayerID): void {
        this.server.onPlayerCancelReady({
            index:playID
        });
    }
    sendPlayerEnter(playID: ePlayerID,info: any): void {
        this.server.onPlayerEnter({
            index:playID,
            info:info
        });
    }
    sendPlayerExit(playID: ePlayerID): void {
        this.server.onPlayerExit({
            index:playID
        });
    }
}
/**
 * 离线服务器
 */
export class OfflineServer extends Server {
    declare internet:OfflineInternet;
    id = eOfflineServerID;
    /**
     * 消息队列
     */
    _msgQueue:Function[] = [];
    _msgQueueTmp:Function[] = [];
    /**
     * 消息解析
     */
    msgBindMap:Function[] = [];
    /**
     * 单机服务器逻辑
     */
    logic = new OfflineGameLogic();
    /**
     * 等待操作回复
     */
    waitOperate = new Array(4).fill(false);
    
    bindMsg(id:number,callback:Function) {
        this.msgBindMap[id] = callback;
    }

    exeMsg(id:number,data:any) {
        this.msgBindMap[id]?.(data);
    }

    sendMsg(id:number,data?:any) {
        this._msgQueue.push(()=>{
            this.exeMsg(id,data);
        })
    }

    walk(dt:number) {
        let msgQueue = this._msgQueue;
        // 运行过程中需要交换缓存队列
        [this._msgQueue,this._msgQueueTmp] = [this._msgQueueTmp,this._msgQueue];
        try {
            msgQueue.forEach(callback=>{
                callback();
            })
        } catch (error) {
            Log.printError(error)
        }
        msgQueue.length = 0;
    }

    sendError(data:Offline.OfflineErrorData) {
        this.sendMsg(eOfflineServerID.MSG_GAME_ERROR,data)
    }

    onPlayerEnter(data:Offline.PlayerEnterData) {
        let {index,info} = data;
        if (this.logic.playerInfo[index]) {
            this.sendError({
                type:eOfflineErrorID.SEAT_HAS_PLAYER,
                msg:"seat has player"
            })
            return 
        }
        this.logic.playerInfo[index] = new PlayerInfo(info);
        this.sendMsg(eOfflineServerID.MSG_PLAYER_ENTER,data)
    }

    onPlayerExit(data:Offline.PlayerExitData) {
        let {index} = data;
        if (this.logic.playerInfo[index] == null) {
            this.sendError({
                type:eOfflineErrorID.SEAT_NO_PLAYER,
                msg:"seat no player"
            })
            return 
        }
        this.logic.playerInfo[index] = null;
        this.sendMsg(eOfflineServerID.MSG_PLAYER_EXIT,data)
    }

    onPlayerReady(data:Offline.PlayerReadyData) {
        let {index} = data;
        if (this.logic.playerInfo[index] == null) {
            this.sendError({
                type:eOfflineErrorID.SEAT_NO_PLAYER,
                msg:"seat no player"
            })
            return 
        }
        if (this.logic.playerInfo[index].isReady()) {
            this.sendError({
                type:eOfflineErrorID.PLAYER_READY_FAIL,
                msg:"player is Ready"
            })
            return
        }
        this.logic.playerInfo[index].ready();
        this.sendMsg(eOfflineServerID.MSG_PLAYER_READY,data);
        if ( this.logic.playerInfo.filter(v=> v == null || v.isReady() == false).length == 0 ) {
            this.gameStart();
        }
    }

    onPlayerCancelReady(data:Offline.PlayerCancelReadyData) {
        let {index} = data;
        if (this.logic.playerInfo[index] == null) {
            this.sendError({
                type:eOfflineErrorID.SEAT_NO_PLAYER,
                msg:"seat no player"
            })
            return 
        }
        if (!this.logic.playerInfo[index].isReady()) {
            this.sendError({
                type:eOfflineErrorID.PLAYER_CANCEL_READY_FAIL,
                msg:"player is not Ready"
            })
            return
        }
        this.logic.playerInfo[index].cancelReady();
        this.sendMsg(eOfflineServerID.MSG_PLAYER_CANCEL_READY,data);
    }
    
    onDiscardTile(data:Offline.DiscardTileData) {
        let {index, tileID} = data;
        if (index !== this.logic.operator) {
            return this.sendError({
                type: eOfflineErrorID.DISCARD_TILE_ERROR,
                msg: "operator error"
            });
        }
        let player = this.logic.getPlayer(index);
        if (!Rule.hasTile(player.hand, tileID)) {
            return this.sendError({
                type: eOfflineErrorID.DISCARD_TILE_ERROR,
                msg: "discard tile error"
            });
        }
        this.processDiscardTile(index, tileID, data);
    }

    private processDiscardTile(index: number, tileID: number, data: Offline.DiscardTileData) {
        let configs = this.logic.discardTile(index, tileID);
        this.sendMsg(eOfflineServerID.MSG_GAME_DISCARD_TILE, data);

        let someOneNeedWait = false;
        configs.forEach((config, i) => {
            if (i === index) {
                this.waitOperate[i] = false;
                return;
            }
            this.waitOperate[i] = this.checkNeedOperate(config);
            someOneNeedWait ||= this.waitOperate[i];
            if (this.waitOperate[i]) {
                this.sendWaitOperateMsg(i, config);
            }
        });

        if (!someOneNeedWait) {
            this.drawTile();
        }
    }

    private checkNeedOperate(config: Offline.OperateConfig): boolean {
        const {
            canChi_front,
            canChi_middle,
            canChi_back,
            canPeng,
            canGang_an,
            canGang_bu,
            canGang_ming,
            canWin
        } = config;
        return canChi_front || canChi_middle || canChi_back || canGang_an || canGang_bu || canGang_ming || canPeng || canWin;
    }

    private sendWaitOperateMsg(index: number, config: Offline.OperateConfig) {
        let sendData: Offline.GameWaitOperateData = {
            index: index,
            config: config
        };
        this.sendMsg(eOfflineServerID.MSG_GAME_WAIT_OPERATE, sendData);
    }

    onGangTile(data:Offline.GangTileData) {
        let {index, type, tileID} = data;
        if (!this.checkOperator(index)) return;
        let player = this.logic.getPlayer(index);
        let hand = player.hand;
        let discardTile = this.logic.getDiscardTile();

        const gangConditions = {
            [eGangType.an_gang]: () => Rule.canGang(hand, tileID, 4),
            [eGangType.ming_gang]: () => discardTile && discardTile.id == tileID && Rule.canGang(hand, tileID),
            [eGangType.bu_gang]: () => Rule.hasTile(hand, tileID)
        };

        if (gangConditions[type]?.()) {
            this.logic.gangTile(index, tileID, type);
            this.sendMsg(eOfflineServerID.MSG_GAME_GANG_TILE, data);
            this.drawTile();
            return;
        }

        this.sendError({
            type: eOfflineErrorID.GANG_TILE_ERROR,
            msg: "gang tile error"
        });
    }

    onPengTile(data:Offline.PengTileData){
        let {index,tileID} = data;
        if (!this.checkOperator(index)) return;
        let player = this.logic.getPlayer(index);
        let hand = player.hand;
        let discardTile = this.logic.getDiscardTile();
        if ( discardTile && discardTile.id == tileID && Rule.canPeng(hand,tileID) ) {
            this.logic.pengTile(index,tileID);
            this.sendMsg(eOfflineServerID.MSG_GAME_PENG_TILE,data);
            return 
        }
        this.sendError({
            type : eOfflineErrorID.PENG_TILE_ERROR,
            msg : "peng tile error"
        })
    }

    onChiTile(data:Offline.ChiTileData){
        let {index,type,tileID} = data;
        if (!this.checkOperator(index)) return;
        let player = this.logic.getPlayer(index);
        let hand = player.hand;
        let discardTile = this.logic.getDiscardTile();
        if (discardTile && discardTile.id == tileID ) {
            if ( Rule.canChi(hand,tileID,type) ) {
                this.logic.chiTile(index,tileID,type);
                this.sendMsg(eOfflineServerID.MSG_GAME_CHI_TILE,data);
                return
            }
        }
        this.sendError({
            type : eOfflineErrorID.CHI_TILE_ERROR,
            msg : "chi tile error"
        })
    }

    onHuTile(data:Offline.HuTileData){
        let {index} = data;
        if (!this.checkOperator(index)) return;
        let player = this.logic.getPlayer(index);
        let hand = player.hand;
        let discardTile = this.logic.getDiscardTile();
        if ( discardTile ) {
            if ( Rule.canWin(hand,discardTile) ) {
                this.sendMsg(eOfflineServerID.MSG_GAME_HU_TILE,data);
                this.sendMsg(eOfflineServerID.MSG_GAME_END);
                return
            }
        } else {
            if ( Rule.canWin(hand,null) ) {
                this.sendMsg(eOfflineServerID.MSG_GAME_HU_TILE,data);
                this.sendMsg(eOfflineServerID.MSG_GAME_END);
                return
            }
        }
        this.sendError({
            type : eOfflineErrorID.OPERATE_ERROR,
            msg : "hu tile error"
        })
    }

    onCancelOperate(data:Offline.CancelOperateData) {
        let {index} = data;
        if ( this.logic.status == OfflineGameStatus.game_wait_draw ) {
            this.waitOperate[index] = false;
            let someOneNeedWait = this.waitOperate.filter(v=>v==true).length > 0;
            if(!someOneNeedWait) {
                this.drawTile();
            }
        } else if ( this.logic.status == OfflineGameStatus.game_wait_discard ) {
            // 自己摸牌时候取消操作 忽略
        }
    }

    gameStart() {
        this.sendMsg(eOfflineServerID.MSG_GAME_START)
        this.logic.startGame()
        let handTile:number[][] = []
        this.logic.getPlayers().forEach((player,index) => {
            handTile[index] = player.hand.getTiles().map(v=>v.id);
        });
        let data:Offline.SendTileData = {
            handTile:handTile
        }
        this.sendMsg(eOfflineServerID.MSG_GAME_SEND_TILE,data);
        this.drawTile();
    }

    drawTile() {
        let drawTileData = this.logic.drawTile();
        this.sendMsg(eOfflineServerID.MSG_GAME_DRAW_TILE,drawTileData);
    }

    checkOperator(index:number) {
        if(this.waitOperate[index] == false) {
            this.sendError({
                type : eOfflineErrorID.OPERATE_ERROR,
                msg : "operate tile error"
            })
            return false;
        }
        return true
    }
}

export class PlayerInfo {
    info
    private _ready = false;

    constructor(info) {
        this.info = info;
    }

    ready() {
        this._ready = true;
    }

    cancelReady() {
        this._ready = false;
    }

    isReady() {
        return this._ready;
    }
}

enum OfflineGameStatus {
    game_idle,
    game_send,
    game_wait_draw,
    game_wait_discard,
}

export class OfflineGameLogic {
    playerCount = 4;
    playerInfo:PlayerInfo[] = new Array(4).fill(null);
    private table:Table = new Table(4,144);
    status:OfflineGameStatus = OfflineGameStatus.game_idle;
    /**
     * 庄家
     */
    declarer:number = 0;
    /**
     * 当前操作者
     */
    operator:number = 0;
    /**
     * 当前弃牌
     */
    private _discardTile:Tile = null;

    /**
     * 开始游戏
     */
    startGame() {
        this.status = OfflineGameStatus.game_send;
        this.table.startGame();
        this.operator = this.declarer;
        this.status = OfflineGameStatus.game_wait_draw;
    }
    /**
     * 摸牌
     * @returns 
     */
    drawTile():Offline.DrawTileData {
        let tile = this.table.drawTile(this.operator);
        let config = this.thinkGH(this.operator);
        this._discardTile = null;
        /**
         * 判断自己是否能杠牌
         */
        this.status = OfflineGameStatus.game_wait_discard;
        return {
            operator : this.operator,
            tileID : tile.id,
            config : config,
        };
    }


    discardTile(playerID:ePlayerID,tileID:number):Offline.OperateConfig[] {
        this.table.discard(playerID,tileID);
        this._discardTile = Tile.createByCardID(tileID);
        this.operator = (playerID+1)%this.playerCount;
        this.status = OfflineGameStatus.game_wait_draw;
        return this.table.players.map((player,i)=>{
            return this.thinkCPGH(i);
        })
    }

    chiTile(playerID:ePlayerID,tileID:number,type:eChiType) {
        this.table.chiTile(playerID,Tile.createByCardID(tileID),type);
        this.operator = playerID;
        this.status = OfflineGameStatus.game_wait_discard;
    }

    gangTile(playerID:ePlayerID,tileID:number,type:eGangType) {
        this.table.gangTile(playerID,Tile.createByCardID(tileID),type);
        this.operator = playerID;
        this.status = OfflineGameStatus.game_wait_draw;
    }

    pengTile(playerID:ePlayerID,tileID:number) {
        this.table.pengTile(playerID,Tile.createByCardID(tileID));
        this.operator = playerID;
        this.status = OfflineGameStatus.game_wait_discard;
    }

    getDiscardTile() {
        return this._discardTile;
    }

    getPlayers() {
        return this.table.players;
    }

    getPlayer(index:number) {
        return this.table.players[index];
    }

    thinkCPGH(playerID:ePlayerID):Offline.OperateConfig {
        assert(this._discardTile != null,"discard tile is null");
        let player = this.table.players[playerID];
        let hand = player.hand;
        return {
            tileID : this._discardTile.id,
            canChi_front : Rule.canChi(hand,this._discardTile,eChiType.front),
            canChi_middle : Rule.canChi(hand,this._discardTile,eChiType.middle),
            canChi_back : Rule.canChi(hand,this._discardTile,eChiType.back),
            canPeng : Rule.canPeng(hand,this._discardTile),
            canGang_ming : Rule.canGang(hand,this._discardTile),
            canGang_bu : false,
            buGang : [],
            canGang_an : false,
            anGang : [],
            canWin : Rule.canWin(hand,this._discardTile),
        }
    }
    /**
     * 摸牌判断杠胡
     * @param playerID 
     * @param tileID 
     * @returns 
     */
    thinkGH(playerID:ePlayerID):Offline.OperateConfig {
        let player = this.table.players[playerID];
        let hand = player.hand;
        let anGang = this.table.getAnGangTiles(playerID);
        let buGang = this.table.getBuGangTiles(playerID);
        return {
            tileID : -1,
            canChi_front : false,
            canChi_middle : false,
            canChi_back : false,
            canPeng : false,
            canGang_ming : false,
            canGang_bu : buGang.length > 0,
            buGang : buGang.map(v=>v.id),
            canGang_an : anGang.length > 0,
            anGang : anGang.map(v=>v.id),
            canWin : Rule.canWin(hand,null),
        }
    }
}