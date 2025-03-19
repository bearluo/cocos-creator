import { Tile } from "./Tile";
import { Hand } from "./Hand";
import { Rule } from "./Rule";

export class AI {
    private hand: Hand;

    constructor(hand: Hand) {
        this.hand = hand;
    }

    // AI 出牌
    play(): Tile | null {
        const tiles = this.hand.getTiles();
        if (tiles.length === 0) return null;

        // 简单策略：出第一张牌
        return tiles[0];
    }

    // AI 判断是否碰牌
    shouldPeng(tile: Tile): boolean {
        return Rule.canPeng(this.hand, tile);
    }

    // AI 判断是否杠牌
    shouldGang(tile: Tile): boolean {
        return Rule.canGang(this.hand, tile);
    }

    // AI 判断是否胡牌
    shouldWin(tile: Tile): boolean {
        return Rule.canWin(this.hand, tile);
    }

    // AI 判断是否吃牌
    shouldChi(tile: Tile): boolean {
        const tiles = this.hand.getTiles();
        const sameTypeTiles = tiles.filter(t => t.type === tile.type);
        let count = new Array(5).fill(0);
        sameTypeTiles.forEach(t=>{
            let index = t.value - tile.value + 2;
            if (index >= 0 && index < 5) {
                count[index]++;
            }
        })
        // 要吃的子
        count[2]++;
        for (let index = 0; index < 3; index++) {
            if( count[index] > 0 && count[index+1] > 0 && count[index+2] > 0 ) return true;
        }
        return false;
    }
}