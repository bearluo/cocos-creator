import { _decorator, Component, error, Node } from 'cc';
import { ePlayerID } from './Config';
import { I_Internet } from './Internet';
import { Player } from './Player';
import { PlayerID } from './PlayerID';
import { Tile } from './Tile';
import { HuTableData, Rule } from './Rule';
const { ccclass, property } = _decorator;

export class Manager {
    internet:I_Internet
    playerID:PlayerID

    players:Player[] = [];

    initManager(playerID:PlayerID,internet:I_Internet,data:HuTableData) {
        this.playerID = playerID;
        this.internet = internet;
        Rule.data = data;
    }

    addSelf(playID:ePlayerID) {
        this.players[playID] = new Player();
    }

    addPlayer(playID:ePlayerID) {
        this.players[playID] = new Player();
    }

    removePlayer(playID:ePlayerID) {
        this.players[playID] = null;
    }

    playerReady(playID:ePlayerID,bReady:boolean) {

    }

    sendTile(playerTileIDs:number[][]) {
        this.players.forEach((player,index)=>{
            let tileIDs = playerTileIDs[index];
            tileIDs.forEach(tileID=>{
                player.drawTile(Tile.createByCardID(tileID));
            })
        })
    }

    drawTile(playID:ePlayerID,tileID:number) {
        let player = this.players[playID];
        player.drawTile(Tile.createByCardID(tileID));
    }

    discardTile(playID:ePlayerID,tileID:number) {
        let player = this.players[playID];
        player.discardTile(Tile.createByCardID(tileID));
    }


    getHandTile() {
        let playerTileIDs:Tile[][] = []
        this.players.forEach((player,index)=>{
            playerTileIDs[index] = player.hand.getTiles();
        })
        return playerTileIDs;
    }
}


