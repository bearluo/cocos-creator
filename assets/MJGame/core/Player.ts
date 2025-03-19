import { Hand } from "./Hand";
import { AI } from "./AI";
import { Tile } from "./Tile";
import { eChiType, eGangType } from "./Config";
import { CPG } from "./CPG";

export class Player {
    public hand: Hand;
    public cpg: CPG;
    public ai: AI;

    constructor() {
        this.hand = new Hand();
        this.cpg = new CPG();
        this.ai = new AI(this.hand);
    }

    /**
     * 玩家摸牌
     * @param tile - 摸到的牌
     */
    drawTile(tile: Tile): void {
        this.hand.addTile(tile);
    }

    /**
     * 玩家出牌
     * @param tile - 摸到的牌
     */
    discardTile(tile: Tile): void {
        this.hand.removeTile(tile);
    }

    /**
     * 玩家杠牌
     */
    gangTile(tile: Tile,type:eGangType) {
        if ( type == eGangType.ming_gang ) {
            this.hand.removeTile(tile);
            this.hand.removeTile(tile);
            this.hand.removeTile(tile);
        }else if ( type == eGangType.an_gang ) {
            this.hand.removeTile(tile);
            this.hand.removeTile(tile);
            this.hand.removeTile(tile);
            this.hand.removeTile(tile);
        }else if ( type == eGangType.bu_gang ) {
            this.hand.removeTile(tile);
        }
        this.cpg.gang(tile,type);
    }
    /**
     * 碰牌
     * @param tile 
     */
    pengTile(tile: Tile) {
        this.hand.removeTile(tile);
        this.hand.removeTile(tile);
        this.cpg.peng(tile);
    }

    /**
     * 吃牌
     */
    chiTile(tile: Tile,type:eChiType) {
        let id = tile.id
        if ( type == eChiType.front ) {
            tile.id = id + 1;
            this.hand.removeTile(tile);
            tile.id = id + 2;
            this.hand.removeTile(tile);
        }else if ( type == eChiType.middle ) {
            tile.id = id - 1;
            this.hand.removeTile(tile);
            tile.id = id + 1;
            this.hand.removeTile(tile);
        }else if ( type == eChiType.back ) {
            tile.id = id - 2;
            this.hand.removeTile(tile);
            tile.id = id - 1;
            this.hand.removeTile(tile);
        }
        this.cpg.chi(tile,type);
    }
    /**
     * 胡牌
     * @param tile 
     */
    huTile(tile: Tile) {

    }
    /**
     * 获得暗杠牌
     */
    getAnGang() {
        return this.hand.getAnGang();
    }
    /**
     * 获得明杠牌
     */
    getBuGang() {
        return this.hand.getBuGang(this.cpg);
    }
    /**
     * 清理
     */
    clearTiles() {
        this.hand.clearTiles();
        this.cpg.clearTiles();
    }

    /**
     * ai 思考出牌
     * @returns 出的牌，如果无牌可出则返回 null
     */
    playTile(): Tile | null {
        return this.ai.play();
    }

    /**
     * 打印玩家手牌
     */
    printHand(): void {
        console.log("玩家手牌:");
        this.hand.printHand();
    }
}