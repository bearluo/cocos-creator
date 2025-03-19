import { Tile, TileType } from "./Tile";
import { Player } from "./Player";
import { assert, Pool } from "cc";


export class Table {
    public players: Player[] = [];
    public wall: Tile[] = []; // 牌堆
    public discardPile: Tile[][] = []; // 已出牌堆
    public lastDiscardPlayer:number = -1;

    constructor(playerCount: number = 4,tileCount:number = 144) {
        // 初始化玩家
        for (let i = 0; i < playerCount; i++) {
            this.players.push(new Player());
            this.discardPile[i] = [];
        }

        // 初始化牌堆
        this.initializeWall();
    }
    /**
     * 初始化牌堆
     */
    private initializeWall(): void {
        {
            const types = [TileType.WAN, TileType.TIAO, TileType.TONG];
            for (const type of types) {
                for (let value = 1; value <= 9; value++) {
                    for (let i = 0; i < 4; i++) {
                        this.wall.push(new Tile(type, value));
                    }
                }
            }
        }
        {
            for (let value = 1; value <= 4; value++) {
                for (let i = 0; i < 4; i++) {
                    this.wall.push(new Tile(TileType.FENG, value));
                }
            }
            for (let value = 1; value <= 3; value++) {
                for (let i = 0; i < 4; i++) {
                    this.wall.push(new Tile(TileType.ZI, value));
                }
            }
        }
        this.shuffleWall();
    }

    /**
     * 洗牌
     */
    private shuffleWall(): void {
        for (let i = this.wall.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.wall[i], this.wall[j]] = [this.wall[j], this.wall[i]];
        }
    }

    /**
     * 回收牌
     */
    clearTiles() {
        for (let i = 0; i < this.discardPile.length; i++) {
            this.wall.push(...this.discardPile[i]);
            this.discardPile[i].length = 0;
        }
        for (let i = 0; i < this.players.length; i++) {
            this.wall.push(...this.players[i].hand.getTiles());
            this.wall.push(...this.players[i].cpg.getChiTiles().map(chi=>chi.tiles).flat());
            this.wall.push(...this.players[i].cpg.getGangTiles().map(gang=>gang.tiles).flat());
            this.wall.push(...this.players[i].cpg.getPengTiles().map(peng=>peng.tiles).flat());
            this.players[i].clearTiles();
        }
        this.shuffleWall();
    }


    /**
     * 发牌
     */
    public dealTiles(): void {
        for (let i = 0; i < 13; i++) {
            for (const player of this.players) {
                const tile = this.wall.pop();
                if (tile) {
                    player.drawTile(tile);
                }
            }
        }
    }

    /**
     * 出牌
     */
    public discard(playerID:number,id:number) {
        this.lastDiscardPlayer = playerID;
        let tile = Tile.createByCardID(id);
        this.discardPile[playerID].push(tile);
        this.players[playerID].discardTile(tile);
    }

    /**
     * 重置出牌堆
     * @param playerID 
     * @param IDs 
     */
    resetDiscardPile(playerID:number,IDs:number[]) {
        let discardPile = this.discardPile[playerID];
        discardPile.length = 0;
        IDs.forEach(id=>{
            this.discardPile[playerID].push(Tile.createByCardID(id));
        })
    }

    /**
     * 打印牌桌状态
     */
    public printTable(): void {
        console.log("牌桌状态:");
        for (let i = 0; i < this.players.length; i++) {
            console.log(`玩家 ${i + 1}:`);
            this.players[i].printHand();
        }
        console.log(`剩余牌堆: ${this.wall.length} 张`);
        for (let i = 0; i < this.players.length; i++) {
            console.log(`玩家 ${i + 1}:`);
            console.log(`已出牌堆: ${this.discardPile[i].map(tile => tile.toString()).join(" ")}`);
        }
    }

    /**
     * 开始游戏
     */
    public startGame(): void {
        this.clearTiles();
        this.dealTiles();
        this.printTable();
    }

    /**
     * 摸牌
     */
    public drawTile(index:number) {
        let player = this.players[index];
        assert(player != null,"index error");
        const tile = this.wall.pop();
        assert(tile != null,"tile error");
        player.drawTile(tile);
        return tile;
    }

    /**
     * 吃牌
     * @param index 
     * @param tile 
     * @param type 
     */
    chiTile(index:number,tile:Tile,type:number) {
        let player = this.players[index];
        player.chiTile(tile,type);
    }
    /**
     * 杠牌
     * @param index 
     * @param tile 
     * @param type 
     */
    gangTile(index:number,tile:Tile,type:number) {
        let player = this.players[index];
        player.gangTile(tile,type);
    }
    /**
     * 碰牌
     * @param index 
     * @param tile 
     */
    pengTile(index:number,tile:Tile) {
        let player = this.players[index];
        player.pengTile(tile);
    }
    /**
     * 胡牌
     * @param index 
     * @param tile 
     */
    huTile(index:number,tile:Tile) {
        let player = this.players[index];
        player.huTile(tile);
    }

    public getAnGangTiles(index:number) {
        let player = this.players[index];
        return player.hand.getAnGang();
    }

    public getBuGangTiles(index:number) {
        let player = this.players[index];
        return player.hand.getBuGang(player.cpg);
    }
}