import { _decorator, assert, ccenum, Component, Node } from 'cc';
import { TileMode,TileType } from '../core/Tile';
const { ccclass, property } = _decorator;

export interface I_CPGPile {
    type:eCPGType;
    tileIDs:number[];
    chiType?:eChiType;
    gangType?:eGangType;
}

export enum eCPGType {
    /**
     * 吃
     */
    chi,
    /**
     * 碰
     */
    peng,
    /**
     * 杠
     */
    gang,
}

export enum eGangType {
    /**
     * 明杠
     */
    ming_gang,
    /**
     * 暗杠
     */
    an_gang,
    /**
     * 补杠
     */
    bu_gang,
}

export enum eChiType {
    /**
     * 前吃
     */
    front,
    /**
     * 中吃
     */
    middle,
    /**
     * 后吃
     */
    back,
}

export enum ePlayerID {
    Bottom = 0,
    Right = 1,
    Top = 2,
    Left = 3,
}
ccenum(ePlayerID);


export enum eOfflineServerID {
    /**
     * 玩家进入
     */
    MSG_PLAYER_ENTER,
    /**
     * 玩家退出
     */
    MSG_PLAYER_EXIT,
    /**
     * 玩家准备
     */
    MSG_PLAYER_READY,
    /**
     * 玩家取消准备
     */
    MSG_PLAYER_CANCEL_READY,


    /**
     * 牌局开始
     */
    MSG_GAME_START,
    /**
     * 发牌
     */
    MSG_GAME_SEND_TILE,
    /**
     * 摸牌
     */
    MSG_GAME_DRAW_TILE,
    /**
     * 弃牌
     */
    MSG_GAME_DISCARD_TILE,
    /**
     * 等待操作
     */
    MSG_GAME_WAIT_OPERATE,
    /**
     * 杠牌
     */
    MSG_GAME_GANG_TILE,
    /**
     * 碰牌
     */
    MSG_GAME_PENG_TILE,
    /**
     * 吃牌
     */
    MSG_GAME_CHI_TILE,
    /**
     * 胡牌
     */
    MSG_GAME_HU_TILE,
    /**
     * 游戏结束
     */
    MSG_GAME_END,
    
    /**
     * 游戏错误
     */
    MSG_GAME_ERROR,
}

export enum eOfflineErrorID {
    /**
     * 座位有玩家了
     */
    SEAT_HAS_PLAYER,
    /**
     * 座位没有玩家
     */
    SEAT_NO_PLAYER,
    /**
     * 出牌错
     */
    DISCARD_TILE_ERROR,
    /**
     * 杠牌错误
     */
    GANG_TILE_ERROR,
    /**
     * 碰牌错误
     */
    PENG_TILE_ERROR,
    /**
     * 吃牌错误
     */
    CHI_TILE_ERROR,
    /**
     * 操作错误
     */
    OPERATE_ERROR,
    /**
     * 玩家准备失败
     */
    PLAYER_READY_FAIL,
    /**
     * 玩家取消准备失败
     */
    PLAYER_CANCEL_READY_FAIL,
    
}

export namespace Offline {
    export interface SeatIDData {
        /**
         * 座位号
         */
        index:number,
    }
    export interface PlayerEnterData extends SeatIDData{
        /**
         * 用户数据
         */
        info: {
            /**
             * 是否是自己
             */
            bSelf:boolean
        }
    }
    export interface PlayerExitData extends SeatIDData {
    }
    export interface PlayerReadyData extends SeatIDData {
    }
    export interface PlayerCancelReadyData extends SeatIDData {
    }
    export interface DiscardTileData extends SeatIDData {
        /**
         * 牌id
         */
        tileID:number,
    }
    export interface GangTileData extends SeatIDData {
        /**
         * 牌id
         */
        tileID:number,
        /**
         * 杠牌类型 {@link eGangType}
         */
        type:eGangType,
    }
    export interface PengTileData extends SeatIDData {
        /**
         * 牌id
         */
        tileID:number,
    }
    export interface ChiTileData extends SeatIDData {
        /**
         * 牌id
         */
        tileID:number,
        /**
         * 吃牌类型 {@link eChiType}
         */
        type:eChiType,
    }
    export interface HuTileData extends SeatIDData {
    }
    export interface CancelOperateData extends SeatIDData {
    }
    export interface DrawTileData {
        /**
         * 操作对象
         */
        operator:number,
        /**
         * 牌id
         */
        tileID:number,
        /**
         * 手牌分析
         */
        config:OperateConfig,
    }
    export interface SendTileData {
        /**
         * 手牌
         */
        handTile:number[][],
    }
    
    export interface OperateConfig {
        /**
         * 牌id
         */
        tileID : number,
        /**
         * 前吃
         */
        canChi_front: boolean;
        /**
         * 中吃
         */
        canChi_middle: boolean;
        /**
         * 后吃
         */
        canChi_back: boolean;
        /**
         * 碰
         */
        canPeng: boolean;
        /**
         * 暗杠
         */
        canGang_an: boolean;
        /**
         * 暗杠数组
         */
        anGang:number[];
        /**
         * 补杠
         */
        canGang_bu: boolean;
        /**
         * 补杠数组
         */
        buGang:number[];
        /**
         * 明杠
         */
        canGang_ming: boolean;
        /**
         * 胡
         */
        canWin: boolean;
    }

    export interface GameWaitOperateData extends SeatIDData {
        /**
         * 操作配置
         */
        config:OperateConfig,
    }
    
    export interface OfflineErrorData {
        /**
         * 错误码 {@link eOfflineErrorID}
         */
        type: eOfflineErrorID,
        /**
         * 错误消息
         */
        msg: string
    }
}



