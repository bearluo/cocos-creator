import { Tile, TileType } from "./Tile";
import { Player } from "./Player";
import { Pool } from "cc";

export interface TableView {
    /**
     * 重置出牌堆
     * @param playerID 
     * @param IDs 
     */
    resetDiscardPile(playerID:number,tiles:Tile[]): void;
    /**
     * 出牌
     */
    discard(playerID:number,tile:Tile): void;
}

export class Table {
    private players: Player[] = [];
    private wall: Tile[] = []; // 牌堆
    private discardPile: Tile[][] = []; // 已出牌堆
    private lastDiscardPalyer:number = -1;
    public tableView:TableView;

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
        const types = [TileType.WAN, TileType.TIAO, TileType.TONG];
        for (const type of types) {
            for (let value = 1; value <= 9; value++) {
                for (let i = 0; i < 4; i++) {
                    this.wall.push(new Tile(type, value));
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
        this.lastDiscardPalyer = playerID;
        let tile = Tile.createByCardID(id);
        this.discardPile[playerID].push(tile);
        
        this.tableView?.discard(playerID,tile);
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

        this.tableView?.resetDiscardPile(playerID,discardPile);
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
        this.dealTiles();
        this.printTable();
    }
}