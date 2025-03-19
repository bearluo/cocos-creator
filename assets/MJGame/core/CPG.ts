import { eChiType, eGangType } from "./Config";
import { Tile, TileType } from "./Tile";

interface IChiPile {
    type: eChiType;
    tiles: Tile[];
}
interface IPengPile {
    tiles: Tile[];
}

interface IGangPile {
    tiles: Tile[];
    type: eGangType;
}

export class CPG {
    private chiTiles: IChiPile[] = [];
    private pengTiles: IPengPile[] = [];
    private gangTiles: IGangPile[] = [];

    // 吃牌
    chi(tile: Tile,type:eChiType): void {
        let tiles: Tile[] = [];
        switch (type) {
            case eChiType.front:
                tiles.push(tile.clone());
                tiles.push(new Tile(tile.type, tile.value + 1));
                tiles.push(new Tile(tile.type, tile.value + 2));
                break;
            case eChiType.middle:
                tiles.push(new Tile(tile.type, tile.value - 1));
                tiles.push(tile.clone());
                tiles.push(new Tile(tile.type, tile.value + 1));
                break;
            case eChiType.back:
                tiles.push(new Tile(tile.type, tile.value - 2));
                tiles.push(new Tile(tile.type, tile.value - 1));
                tiles.push(tile.clone());
                break;
        }
        this.chiTiles.push({tiles: tiles, type: type});
    }

    // 碰牌
    peng(tile: Tile): void {
        this.pengTiles.push({tiles: [tile.clone(), tile.clone(), tile.clone()]});
    }

    // 杠牌
    gang(tile: Tile,type:eGangType): void {
        this.gangTiles.push({tiles: [tile.clone(), tile.clone(), tile.clone(), tile.clone()], type: type});
    }

    // 获取吃的牌堆
    getChiTiles(): IChiPile[] {
        return this.chiTiles;
    }

    // 获取碰的牌堆
    getPengTiles(): IPengPile[] {
        return this.pengTiles;
    }

    // 获取杠的牌堆
    getGangTiles(): IGangPile[] {
        return this.gangTiles;
    }

    clearTiles() {
        this.chiTiles.length = 0;
        this.pengTiles.length = 0;
        this.gangTiles.length = 0;
    }
}