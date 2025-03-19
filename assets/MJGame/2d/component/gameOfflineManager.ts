import { _decorator, Component, Node, TextAsset } from 'cc';
import { Manager } from '../../core/Manager';
import { TablePrefab } from '../prefab/TablePrefab';
import { ePlayerID, Offline } from '../../core/Config';
import { eGameStateMachineListeners, GAME_EVENTS, GameStateMachine } from '../machine/gameStateMachine';
import { AnyEventObject, createActor } from 'ccc-xstate';
import { FourPlayerID } from '../../core/PlayerID';
import { OfflineInternet } from '../../core/OfflineInternet';
import { OperationPanel } from '../prefab/OperationPanel';
import { Log } from 'db://assets/framework/common/FWLog';
import { HuTableData } from '../../core/Rule';
const { ccclass, property } = _decorator;

@ccclass('gameOfflineManager')
export class gameOfflineManager extends Component {
    mgr:Manager = new Manager();
    internet:OfflineInternet = new OfflineInternet();

    @property({
        type:TablePrefab
    })
    tab:TablePrefab;
    @property({
        type:OperationPanel
    })
    operationPanel:OperationPanel;
    
    fsm = createActor(GameStateMachine);

    @property({
        type:TextAsset,
    })
    text: TextAsset[] = [];

    onLoad() {
        let WTTTable = new Map<string,number>();
        let FZTable = new Map<string,number>();
        this.text[0].text.split("\n").forEach((value)=>{
            WTTTable.set(value,1);
        });
        this.text[1].text.split("\n").forEach((value)=>{
            FZTable.set(value,1);
        });
        let data:HuTableData = {
            WTTTable: WTTTable,
            FZTable: FZTable
        }
        this.mgr.initManager(new FourPlayerID(),this.internet, data);
        this.fsm.subscribe({
            next(snapshot) {
                console.log(snapshot.value);
            },
            error(err) {
                console.error(err);
            },
            complete() {
                console.log("complete");
            }
        })

        this.fsm.on(eGameStateMachineListeners.onEntryGameIdle,this.onEntryGameIdle.bind(this));
        this.fsm.on(eGameStateMachineListeners.onExitGameIdle,this.onExitGameIdle.bind(this));
        this.fsm.on(eGameStateMachineListeners.onEntryGameEnd,this.onEntryGameEnd.bind(this));
        this.fsm.on(eGameStateMachineListeners.onExitGameEnd,this.onExitGameEnd.bind(this));
        this.fsm.on(eGameStateMachineListeners.onEntryGameWait,this.onEntryGameWait.bind(this));
        this.fsm.on(eGameStateMachineListeners.onExitGameWait,this.onExitGameWait.bind(this));
        this.fsm.on(eGameStateMachineListeners.onEntryGameStart,this.onEntryGameStart.bind(this));
        this.fsm.on(eGameStateMachineListeners.onExitGameStart,this.onExitGameStart.bind(this));


        this.internet.server.bindMsg(this.internet.server.id.MSG_PLAYER_ENTER,this.onPlayerEnter.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_PLAYER_EXIT,this.onPlayerExit.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_PLAYER_READY,this.onPlayerReady.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_PLAYER_CANCEL_READY,this.onPlayerCancelReady.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_GAME_START,this.onGameStart.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_GAME_SEND_TILE,this.onGameSendTile.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_GAME_DRAW_TILE,this.onGameDrawTile.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_GAME_DISCARD_TILE,this.onGameDiscardTile.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_GAME_WAIT_OPERATE,this.onGameWaitOperate.bind(this));
        
        this.internet.server.bindMsg(this.internet.server.id.MSG_GAME_GANG_TILE,this.onGameGangTile.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_GAME_PENG_TILE,this.onGamePengTile.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_GAME_CHI_TILE,this.onGameChiTile.bind(this));
        this.internet.server.bindMsg(this.internet.server.id.MSG_GAME_HU_TILE,this.onGameHuTile.bind(this));

        this.internet.server.bindMsg(this.internet.server.id.MSG_GAME_END,this.onGameEnd.bind(this));
    }

    start() {
        this.tab.event.on(this.tab.event.key.discard_tile,this.onOperateDiscard.bind(this));
        this.operationPanel.event.on(this.operationPanel.event.key.chi_tile,this.onOperateChi.bind(this));
        this.operationPanel.event.on(this.operationPanel.event.key.peng_tile,this.onOperatePeng.bind(this));
        this.operationPanel.event.on(this.operationPanel.event.key.gang_tile,this.onOperateGang.bind(this));
        this.operationPanel.event.on(this.operationPanel.event.key.hu_tile,this.onOperateHu.bind(this));
        this.operationPanel.event.on(this.operationPanel.event.key.cancel,this.onOperateCancel.bind(this));
        
        this.fsm.start();
        this.fsm.send({type:GAME_EVENTS.GAME_WAIT})
        this.internet.sendPlayerEnter(ePlayerID.Bottom,{ bSelf : true });
        this.internet.sendPlayerEnter(ePlayerID.Top,{ bSelf : false });
        this.internet.sendPlayerEnter(ePlayerID.Left,{ bSelf : false });
        this.internet.sendPlayerEnter(ePlayerID.Right,{ bSelf : false });
    }

    update(deltaTime: number) {
        // 单机服务刷新
        this.internet.server.walk(deltaTime);
    }

    onEntryGameIdle(event:AnyEventObject) {
        
    }
    onExitGameIdle(event:AnyEventObject) {
        
    }
    onEntryGameEnd(event:AnyEventObject) {
        
    }
    onExitGameEnd(event:AnyEventObject) {
        
    }
    onEntryGameWait(event:AnyEventObject) {
        
    }
    onExitGameWait(event:AnyEventObject) {
        
    }
    onEntryGameStart(event:AnyEventObject) {
        
    }
    onExitGameStart(event:AnyEventObject) {
        
    }

    onPlayerEnter(data:Offline.PlayerEnterData) {
        let {index,info} = data;
        if( info.bSelf ) {
            this.mgr.addSelf(index);
            this.internet.sendPlayerReady(index);
        } else {
            this.mgr.addPlayer(index);
            this.internet.sendPlayerReady(index);
        }
    }

    onPlayerExit(data:Offline.PlayerExitData) {
        let {index} = data;
        this.mgr.removePlayer(index);
    }

    onPlayerReady(data:Offline.PlayerReadyData) {
        let {index} = data;
        this.mgr.playerReady(index,true);
    }

    onPlayerCancelReady(data:Offline.PlayerCancelReadyData) {
        let {index} = data;
        this.mgr.playerReady(index,false);
    }

    onGameStart() {
        this.fsm.send({type:GAME_EVENTS.PLAYER_ALL_READY})
    }

    onGameSendTile(data:Offline.SendTileData) {
        let {handTile} = data;
        this.mgr.sendTile(handTile);
        this.tab.sendTile(handTile);
        this.fsm.send({type:GAME_EVENTS.SEND_TILE});
    }

    onGameDrawTile(data:Offline.DrawTileData) {
        let {operator,tileID} = data;
        this.mgr.drawTile(operator,tileID);
        this.tab.drawTile(operator,tileID);
        this.fsm.send({type:GAME_EVENTS.DRAW_TILE});

        if(operator!=ePlayerID.Bottom) {
            let tile = this.mgr.players[operator].playTile();
            let data:Offline.DiscardTileData = {
                index:operator,
                tileID:tileID,
            }
            this.onOperateDiscard(data);
        }
    }

    onGameDiscardTile(data:Offline.DiscardTileData) {
        let {index,tileID} = data;
        this.mgr.discardTile(index,tileID);
        this.tab.discardTile(index,tileID);
        this.fsm.send({type:GAME_EVENTS.DISCARD_TILE});
    }

    onGameWaitOperate(data:Offline.GameWaitOperateData) {
        Log.printDebug("onGameWaitOperate",data);
        let {index,config} = data;
        // this.mgr.discardTile(index,tileID);
        if ( index == ePlayerID.Bottom) {
            this.operationPanel.showOperationBtn(config);
        }
        this.fsm.send({type:GAME_EVENTS.WAIT_OPERATE});
        if(index!=ePlayerID.Bottom) {
            // let tile = this.mgr.players[index].playTile();
            // TODO 先取消操作 后续需要ai 思考操作
            this.internet.sendCancelOperate(index);
        }
    }

    onGameGangTile(data:Offline.GangTileData) {
        this.tab.gangTile(data.index,data.tileID,data.type);
        this.fsm.send({type:GAME_EVENTS.GANG_TILE});
    }

    onGamePengTile(data:Offline.PengTileData) {
        this.tab.pengTile(data.index,data.tileID);
        this.fsm.send({type:GAME_EVENTS.PENG_TILE});
    }
    
    onGameChiTile(data:Offline.ChiTileData) {
        this.tab.chiTile(data.index,data.tileID,data.type);
        this.fsm.send({type:GAME_EVENTS.CHI_TILE});
    }

    onGameHuTile(data:Offline.ChiTileData) {
        this.tab.huTile(data.index,data.tileID);
        this.fsm.send({type:GAME_EVENTS.HU_TILE});
    }

    onGameEnd() {
        this.fsm.send({type:GAME_EVENTS.GAME_END});
    }

    /**
     * 用户操作弃牌
     * @param data {@link Offline.DiscardTileData}
     */
    onOperateDiscard(data:Offline.DiscardTileData) {
        this.internet.sendDiscardTile(data.index,data.tileID);
    }
    /**
     * 用户操作碰牌
     * @param data {@link Offline.PengTileData}
     */
    onOperatePeng(data:Offline.PengTileData) {
        this.internet.sendPengTile(data.index,data.tileID);
    }
    /**
     * 用户操作杠牌
     * @param data {@link Offline.GangTileData}
     */
    onOperateGang(data:Offline.GangTileData) {
        this.internet.sendGangTile(data.index,data.tileID,data.type);
    }
    /**
     * 用户操作吃牌
     * @param data {@link Offline.ChiTileData}
     */
    onOperateChi(data:Offline.ChiTileData) {
        this.internet.sendChiTile(data.index,data.tileID,data.type);
    }
    /**
     * 用户操作胡牌
     * @param data {@link Offline.HuTileData}
     */
    onOperateHu(data:Offline.HuTileData) {
        this.internet.sendHuTile(data.index);
    }
    /**
     * 用户操作取消
     * @param data {@link Offline.CancelOperateData}
     */
    onOperateCancel(data:Offline.CancelOperateData) {
        this.internet.sendCancelOperate(data.index);
    }
}


