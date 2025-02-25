import { Hand } from "./Hand";
import { AI } from "./AI";
import { Tile } from "./Tile";

export class Player {
    public hand: Hand;
    public ai: AI;

    constructor() {
        this.hand = new Hand();
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