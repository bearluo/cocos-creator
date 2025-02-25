import { Tile, TileType } from "./Tile";

export class Hand {
    private tiles: Tile[] = [];

    // 添加牌
    addTile(tile: Tile): void {
        this.tiles.push(tile);
        this.sortTiles();
    }

    // 移除牌
    removeTile(tile: Tile): void {
        const index = this.tiles.findIndex(t => t.type === tile.type && t.value === tile.value);
        if (index !== -1) {
            this.tiles.splice(index, 1);
        }
    }

    // 排序手牌
    sortTiles(): void {
        this.tiles.sort((a, b) => {
            if (a.type === b.type) {
                return a.value - b.value;
            }
            return a.type - b.type;
        });
    }

    // 获取手牌
    getTiles(): Tile[] {
        return this.tiles;
    }

    // 打印手牌
    printHand(): void {
        console.log(this.tiles.map(tile => tile.toString()).join(" "));
    }
}