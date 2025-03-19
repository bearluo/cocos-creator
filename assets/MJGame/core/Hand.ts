import { CPG } from "./CPG";
import { Rule } from "./Rule";
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
        const index = this.tiles.findIndex(t => t.id === tile.id);
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
    /**
     * 获得暗杠牌
     */
    getAnGang():Tile[] {
        let tiles:Tile[] = [];
        let count = 0;
        let preTile:Tile = null;
        this.tiles.forEach(tile=>{
            if (preTile == null || preTile.id == tile.id) {
                count++;
            } else {
                if(count == 4){
                    tiles.push(preTile);
                }
                count = 0;
            }
            preTile = tile;
        })
        return tiles;
    }

    /**
     * 获得补杠牌
     */
    getBuGang(cpg:CPG):Tile[] {
        let tiles:Tile[] = [];
        cpg.getPengTiles().forEach(peng=>{
            if(peng.tiles[0]) {
                if( Rule.hasTile(this,peng.tiles[0]) ){
                    tiles.push(peng.tiles[0]);
                }
            }
        });
        return tiles;
    }

    // 获取手牌
    getTiles(): Tile[] {
        return this.tiles;
    }

    clearTiles() {
        this.tiles.length = 0;
    }

    // 打印手牌
    printHand(): void {
        console.log(this.tiles.map(tile => tile.toString()).join(" "));
    }
}