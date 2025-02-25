import { Tile, TileType } from "./Tile";
import { Hand } from "./Hand";

export class Rule {
    // 判断是否可以胡牌
    static canWin(hand: Hand): boolean {
        const tiles = hand.getTiles();
        // 简单实现：检查是否有 4 组牌 + 1 对将牌
        // 更复杂的实现需要判断顺子、刻子等
        return tiles.length === 14; // 示例逻辑
    }

    // 判断是否可以碰牌
    static canPong(hand: Hand, tile: Tile): boolean {
        const tiles = hand.getTiles();
        const count = tiles.filter(t => t.type === tile.type && t.value === tile.value).length;
        return count >= 2;
    }

    // 判断是否可以杠牌
    static canKong(hand: Hand, tile: Tile): boolean {
        const tiles = hand.getTiles();
        const count = tiles.filter(t => t.type === tile.type && t.value === tile.value).length;
        return count >= 3;
    }
}