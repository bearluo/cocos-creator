import { _decorator, Component, Node } from 'cc';
import { eChiType, eGangType, ePlayerID } from './Config';
import { FWEvent } from '../../framework/events/FWEvents';
const { ccclass, property } = _decorator;


export interface MJGame_Internet_event_protocol {
    /**
     * 游戏开局
     */
    game_start
    /**
     * 游戏结束
     */
    game_end
    /**
     * 用户准备
     */
    player_ready
    /**
     * 摸牌
     */
    draw_tile
    /**
     * 出牌
     */
    discard_tile
    /**
     * 吃牌
     */
    chi_tile
    /**
     * 碰牌
     */
    peng_tile
    /**
     * 杠牌
     */
    gang_tile
    /**
     * 胡牌
     */
    hu_tile
}


export interface I_Internet {
    event:FWEvent<MJGame_Internet_event_protocol>;
    /**
     * 用户进入
     */
    sendPlayerEnter(playID:ePlayerID,info:any);
    /**
     * 用户退出
     */
    sendPlayerExit(playID:ePlayerID);
    /**
     * 用户准备
     */
    sendPlayerReady(playID:ePlayerID);
    /**
     * 用户取消准备
     */
    sendPlayerCancelReady(playID:ePlayerID);
    /**
     * 弃牌
     * @param playID 
     * @param tileID 
     */
    sendDiscardTile(playID:ePlayerID,tileID:number);
    /**
     * 吃牌
     * @param playID 
     * @param tileID 
     * @param type {@link eChiType} 
     */
    sendChiTile(playID:ePlayerID,tileID:number, type:eChiType);
    /**
     * 碰牌
     * @param playID 
     * @param tileID 
     */
    sendPengTile(playID:ePlayerID,tileID:number);
    /**
     * 杠牌
     * @param playID 
     * @param tileID 
     * @param gangType {@link eGangType}
     */
    sendGangTile(playID:ePlayerID,tileID:number,gangType:eGangType);
    /**
     * 胡牌
     * @param playID 
     * @param tileID 
     */
    sendHuTile(playID:ePlayerID,tileID:number);
}

export abstract class Internet implements I_Internet {
    event:FWEvent<MJGame_Internet_event_protocol> = new FWEvent();
    abstract sendDiscardTile(playID:ePlayerID,tileID:number) :void;
    abstract sendChiTile(playID: ePlayerID, tileID: number, type:eChiType) :void;
    abstract sendPengTile(playID: ePlayerID, tileID: number) :void;
    abstract sendGangTile(playID: ePlayerID, tileID: number, gangType: eGangType) :void;
    abstract sendHuTile(playID: ePlayerID, tileID: number) :void;
    abstract sendPlayerReady(playID: ePlayerID) :void;
    abstract sendPlayerCancelReady(playID: ePlayerID) :void;
    abstract sendPlayerEnter(playID: ePlayerID,info: any) : void;
    abstract sendPlayerExit(playID: ePlayerID) : void;
}

export abstract class Server {
    internet:Internet;

    constructor(internet:Internet) {
        this.internet = internet;
    }
}



