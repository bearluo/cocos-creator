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
    shouldPong(tile: Tile): boolean {
        return Rule.canPong(this.hand, tile);
    }

    // AI 判断是否杠牌
    shouldKong(tile: Tile): boolean {
        return Rule.canKong(this.hand, tile);
    }

    // AI 判断是否胡牌
    shouldWin(): boolean {
        return Rule.canWin(this.hand);
    }
}