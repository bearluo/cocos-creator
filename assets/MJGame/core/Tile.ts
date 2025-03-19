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
    BOTTOM_HAND: 13,
    LEFT_HAND: 13,
    RIGHT_HAND: 13,
    TOP_HAND: 13,

    BOTTOM_QP : 32,
    BOTTOM_CPG_Z : 18,
    BOTTOM_CPG_B : 18,
    BOTTOM_DP: 0,
    BOTTOM_HP: 0,
    
    TOP_QP: 32,
    TOP_CPG_Z: 18,
    TOP_CPG_B: 18,
    TOP_DP: 0,
    TOP_HP: 0,
    
    LEFT_QP: 32,
    LEFT_CPG_Z: 18,
    LEFT_CPG_B: 18,
    LEFT_DP: 0,
    LEFT_HP: 0,
    
    RIGHT_QP: 32,
    RIGHT_CPG_Z: 18,
    RIGHT_CPG_B: 18,
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
        type:TileType,
        visible:false
    })
    private _type: TileType;
    @property({
        type:CCInteger,
        visible:false
    })
    private _value: number;
    @property({
        type:CCInteger,
        visible:false
    })
    private _id: number;
    static createByCardID(id:number) {
        return new Tile(Tools.getTileTypeByID(id), Tools.getTileValueByID(id));
    }

    constructor(type: TileType,value: number) {
        this._type = type;
        this._value = value;
        this._id = type | value;
    }
    /**
     * 根据id type 和 value 更新id值
     */
    refreshID() {
        this._id = this._type | this._value;
    }
    /**
     * 根据id 更新 type 和 value
     */
    refreshTypeAndValue() {
        let type = Tools.getTileTypeByID(this._id);
        let value = Tools.getTileValueByID(this._id);
        this._type = type;
        this._value = value;
    }
    
    @property
    set id(id:number) {
        if (this._id == id) return;
        this._id = id;
        this.refreshTypeAndValue();
    }

    get id() {
        return this._id;
    }

    
    @property
    set value(value:number) {
        if (this._value == value) return;
        this._value = value;
        this.refreshID();
    }

    get value() {
        return this._value;
    }

    @property({
        type:TileType
    })
    set type(type:TileType) {
        if (this._type == type) return;
        this._type = type;
        this.refreshID();
    }

    get type() {
        return this._type;
    }

    toString(): string {
        return `${this._value}${TileTypeName[TileType[this._type]]}`;
    }

    clone(): Tile {
        return new Tile(this._type, this._value);
    }
}
