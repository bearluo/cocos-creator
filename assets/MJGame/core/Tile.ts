import { _decorator, assert, CCBoolean, CCInteger, Component, Node, Sprite, Vec2, Vec3 } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;
import { ccenum } from "cc";
import { Tools } from "../utils/Tools";

export enum TileType {
    WAN = 0x00,      // 万
    TIAO = 0x10,     // 条
    TONG = 0x20,     // 筒
    FENG = 0x30,     // 风牌（东、南、西、北）
    ZI = 0x40        // 字牌（中、发、白）
}
ccenum(TileType);
export const TileTypeMaxIndex = {
    WAN : 9,      // 万
    TIAO : 9,     // 条
    TONG : 9,     // 筒
    FENG : 4,     // 风牌（东、南、西、北）
    ZI : 3        // 字牌（中、发、白）
}

export enum TileMode {
    IDLE = 0,
    BOTTOM_HAND,
    LEFT_HAND,
    RIGHT_HAND,
    TOP_HAND,

    BOTTOM_QP,
    BOTTOM_CPG_Z,
    BOTTOM_CPG_B,
    
    TOP_QP,
    TOP_CPG_Z,
    TOP_CPG_B,
    
    LEFT_QP,
    LEFT_CPG_Z,
    LEFT_CPG_B,
    
    RIGHT_QP,
    RIGHT_CPG_Z,
    RIGHT_CPG_B,
    
}
ccenum(TileMode);
export const TileModeMaxIndex = {
    IDLE : 0,
    BOTTOM_HAND: 0,
    LEFT_HAND: 0,
    RIGHT_HAND: 0,
    TOP_HAND: 0,

    BOTTOM_QP : 21,
    BOTTOM_CPG_Z : 0,
    BOTTOM_CPG_B : 0,
    BOTTOM_DP: 0,
    BOTTOM_HP: 0,
    
    TOP_QP: 21,
    TOP_CPG_Z: 0,
    TOP_CPG_B: 0,
    TOP_DP: 0,
    TOP_HP: 0,
    
    LEFT_QP: 21,
    LEFT_CPG_Z: 0,
    LEFT_CPG_B: 0,
    LEFT_DP: 0,
    LEFT_HP: 0,
    
    RIGHT_QP: 21,
    RIGHT_CPG_Z: 0,
    RIGHT_CPG_B: 0,
    RIGHT_DP: 0,
    RIGHT_HP: 0,
}

export enum TileTypeName {
    WAN = "万",      // 万
    TIAO = "条",     // 条
    TONG = "筒",     // 筒
    FENG = "风",     // 风牌（东、南、西、北）
    ZI = "字"        // 字牌（中、发、白）
}

@ccclass('MJGame.Tile')
export class Tile {
    @property({
        type:TileType
    })
    public type: TileType;
    @property
    public value: number;
    @property
    public id: number;
    static createByCardID(id:number) {
        return new Tile(Tools.getTileTypeByID(id), Tools.getTileValueByID(id));
    }

    constructor(type: TileType,value: number) {
        this.type = type;
        this.value = value;
        this.id = type | value;
    }
    /**
     * 根据id type 和 value 更新id值
     */
    refreshID() {
        this.id = this.type | this.value;
    }
    /**
     * 根据id 更新 type 和 value
     */
    refreshTypeAndValue() {
        let type = Tools.getTileTypeByID(this.id);
        let value = Tools.getTileValueByID(this.id);
        this.type = type;
        this.value = value;
    }

    toString(): string {
        return `${this.value}${TileTypeName[TileType[this.type]]}`;
    }
}
