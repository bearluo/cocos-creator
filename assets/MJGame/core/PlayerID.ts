import { assert } from "cc";
import { ePlayerID } from "./Config";

export abstract class PlayerID {
    id = ePlayerID;
    /**
     * 返回座位数组
     */
    abstract array():ePlayerID[];
    /**
     * 获得下一个出牌用户
     * @param playerID 
     */
    abstract getNextPlayer(playerID:ePlayerID):ePlayerID;
}

export class TWOPlayerID extends PlayerID {
    array(): ePlayerID[] {
        return [ePlayerID.Bottom,ePlayerID.Top];
    }
    getNextPlayer(playerID:ePlayerID) {
        assert(playerID == ePlayerID.Top || playerID == ePlayerID.Bottom,"座位id错误")
        return playerID == ePlayerID.Top ? ePlayerID.Bottom : ePlayerID.Top;
    }
}

export class FourPlayerID extends PlayerID {

    array(): ePlayerID[] {
        return [ePlayerID.Bottom,ePlayerID.Right,ePlayerID.Top,ePlayerID.Left];
    }

    getNextPlayer(playerID:ePlayerID) {
        assert(playerID == ePlayerID.Top || playerID == ePlayerID.Bottom || playerID == ePlayerID.Left || playerID == ePlayerID.Right,"座位id错误")
        return (playerID + 1) % 4;
    }
}