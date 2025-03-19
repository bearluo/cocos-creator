import { Tile, TileType } from "./Tile";
import { Hand } from "./Hand";
import { eChiType } from "./Config";

export interface HuTableData {
    WTTTable: Map<string,number>;
    FZTable: Map<string,number>;
}
/**
 * 检测是否满足 3n+2
 * @param count 
 * @returns 
 */
function checkEyeCount(count:number) {
    return count == 2 || count == 5 || count == 8 || count == 11 || count == 14;
}
/**
 * 检测是否满足 3n
 * @param count 
 * @returns 
 */
function check3NCount(count:number) {
    return count == 0 || count == 3 || count == 6 || count == 9 || count == 12;
}

function check3N(tab:number[],count:number) {
    return count == 0 || Rule.data.WTTTable.has(tab.join(''));
}

function checkFengZi3N(tab:number[],count:number) {
    return count == 0 || Rule.data.FZTable.has(tab.join(''));
}

function checkHu(data:{
    wan:number[],
    tong:number[],
    tiao:number[],
    fengZi:number[],
    tongCount:number,
    tiaoCount:number,
    wanCount:number,
    fengZiCount:number,
}) {
    let {wanCount,tongCount,tiaoCount,fengZiCount, wan ,tong, tiao, fengZi} = data;
    if(checkEyeCount(wanCount) && check3NCount(tongCount) && check3NCount(tiaoCount) && check3NCount(fengZiCount)) {
        if ( check3N(tiao,tiaoCount) && check3N(tong,tongCount) && checkFengZi3N(fengZi,fengZiCount) ) {
            for(let i = 0; i < 9; i++) {
                if(wan[i] >= 2) {
                    wan[i] -= 2;
                    wanCount -= 2;
                    if(check3N(wan,wanCount)) {
                        return true;
                    }
                    wan[i] += 2;
                    wanCount += 2;
                }
            }
        }
    }
    if(checkEyeCount(tongCount) && check3NCount(wanCount) && check3NCount(tiaoCount) && check3NCount(fengZiCount)) {
        if ( check3N(wan,wanCount) && check3N(tiao,tiaoCount) && checkFengZi3N(fengZi,fengZiCount) ) {
            for(let i = 0; i < 9; i++) {
                if(tong[i] >= 2) {
                    tong[i] -= 2;
                    tongCount -= 2;
                    if(check3N(tong,tongCount)) {
                        return true;
                    }
                    tong[i] += 2;
                    tongCount += 2;
                }
            }
        }
    }
    if(checkEyeCount(tiaoCount) && check3NCount(wanCount) && check3NCount(tongCount) && check3NCount(fengZiCount)) {
        if ( check3N(wan,wanCount) && check3N(tong,tongCount) && checkFengZi3N(fengZi,fengZiCount) ) {
            for(let i = 0; i < 9; i++) {
                if(tiao[i] >= 2) {
                    tiao[i] -= 2;
                    tiaoCount -= 2;
                    if(check3N(tiao,tiaoCount)) {
                        return true;
                    }
                    tiao[i] += 2;
                    tiaoCount += 2;
                }
            }
        }
    }
    if(checkEyeCount(fengZiCount) && check3NCount(wanCount) && check3NCount(tongCount) && check3NCount(tiaoCount)) {
        if ( check3N(wan,wanCount) && check3N(tong,tongCount) && check3N(tiao,tiaoCount) ) {
            for(let i = 0; i < 9; i++) {
                if(fengZi[i] >= 2) {
                    fengZi[i] -= 2;
                    fengZiCount -= 2;
                    if(checkFengZi3N(fengZi,fengZiCount)) {
                        return true;
                    }
                    fengZi[i] += 2;
                    fengZiCount += 2;
                }
            }
        }
    }
    return false;
}

export class Rule {
    public static data:HuTableData = {
        WTTTable: new Map<string,number>(),
        FZTable: new Map<string,number>(),
    };

    // 判断是否可以胡牌
    static canWin(hand: Hand, tile?: Tile): boolean {
        const tiles:Tile[] = [];
        tile && tiles.push(tile);
        tiles.push(...hand.getTiles());
        let tong:number[] = new Array(9).fill(0);
        let tongCount:number = 0;
        let tiao:number[] = new Array(9).fill(0);
        let tiaoCount:number = 0;
        let wan:number[] = new Array(9).fill(0);
        let wanCount:number = 0;
        let fengZi:number[] = new Array(7).fill(0);
        let fengZiCount:number = 0;
        tiles.forEach(t=>{
            if ( t.type == TileType.WAN ) {
                wan[t.value-1]++;
                wanCount++;
            } else if ( t.type == TileType.TONG ) {
                tong[t.value-1]++;
                tongCount++;
            } else if ( t.type == TileType.TIAO ) {
                tiao[t.value-1]++;
                tiaoCount++;
            } else if ( t.type == TileType.FENG ) {
                fengZi[t.value-1]++;
                fengZiCount++;
            } else if ( t.type == TileType.ZI ) {
                fengZi[t.value+3]++;
                fengZiCount++;
            }
        })

        return checkHu({
            wan,
            tong,
            tiao,
            fengZi,
            tongCount,
            tiaoCount,
            wanCount,
            fengZiCount
        });
    }

    // 判断是否可以碰牌
    static canPeng(hand: Hand, tile: Tile|number): boolean {
        let id = 0;
        if ( typeof tile == "number" ) {
            id = tile;
        } else {
            id = tile.id;
        }
        const tiles = hand.getTiles();
        const count = tiles.filter(t => t.id === id).length;
        return count >= 2;
    }

    // 判断是否可以杠牌
    static canGang(hand: Hand, tile: Tile|number, needCount:number = 3): boolean {
        let id = 0;
        if ( typeof tile == "number" ) {
            id = tile;
        } else {
            id = tile.id;
        }
        const tiles = hand.getTiles();
        const count = tiles.filter(t => t.id === id).length;
        return count >= needCount;
    }

    // 判断是否可以吃牌
    static canChi(hand: Hand, tile: Tile|number, type:eChiType): boolean {
        if ( typeof tile == "number" ) {
            tile = Tile.createByCardID(tile);
        }
        let bSuccess = true;
        if ( tile.type == TileType.WAN || tile.type == TileType.TONG || tile.type == TileType.TIAO ) {
            let id = tile.id
            if ( type == eChiType.front ) {
                bSuccess &&= Rule.hasTile(hand,id+1) && Rule.hasTile(hand,id+2);
            } else if ( type == eChiType.middle ) {
                bSuccess &&= Rule.hasTile(hand,id-1) && Rule.hasTile(hand,id+1);
            } else if ( type == eChiType.back ) {
                bSuccess &&= Rule.hasTile(hand,id-2) && Rule.hasTile(hand,id-1);
            } else {
                bSuccess = false;
            }
        } else {
            bSuccess = false;
        }
        return bSuccess
    }
    /**
     * 判断是否存在手牌
     * @param hand 
     * @param tile 
     * @returns 
     */
    static hasTile(hand: Hand, tile: Tile | number): boolean {
        let id = 0;
        if ( typeof tile == "number" ) {
            id = tile;
        } else {
            id = tile.id;
        }
        const tiles = hand.getTiles();
        return tiles.findIndex(t => t.id === id) != -1;
    }

}