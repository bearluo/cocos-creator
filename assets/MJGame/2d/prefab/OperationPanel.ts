import { _decorator, Component, Node } from 'cc';
import { eChiType, eGangType, ePlayerID, Offline } from '../../core/Config';
import { MJBase } from './MJBase';
import { uiFunc } from 'db://assets/framework/common/FWFunction';
import { Log } from 'db://assets/framework/common/FWLog';
import { FWEvent } from 'db://assets/framework/events/FWEvents';
import { TileMode } from '../../core/Tile';
const { ccclass, property } = _decorator;

enum OperationPanelBtn {
    hu,
    gang,
    chi,
    peng,
    guo,
    max,
}

enum ChiBtn {
    front,
    middle,
    back,
    cancel,
    max,
}

enum GangBtn {
    gang_1,
    gang_2,
    gang_3,
    cancel,
    max,
}

export interface MJGame_OperationPanel_event_protocol {
    /**
     * 刚牌
     */
    gang_tile
    /**
     * 吃牌
     */
    chi_tile
    /**
     * 碰牌
     */
    peng_tile
    /**
     * 胡牌
     */
    hu_tile
    /**
     * 取消
     */
    cancel
}

@ccclass('OperationPanel')
export class OperationPanel extends Component {
    event:FWEvent<MJGame_OperationPanel_event_protocol> = new FWEvent();
    @property(Node)
    btnLayout:Node;
    @property(Node)
    chiLayout:Node;
    @property(Node)
    gangLayout:Node;

    private btns:Node[] = new Array(OperationPanelBtn.max);
    private chiBtns:Node[] = new Array(ChiBtn.max);
    private gangBtns:Node[] = new Array(GangBtn.max);
    private gangData:Offline.GangTileData[] = [];

    config:Offline.OperateConfig

    start() {
        this.btnLayout.active = false;
        this.chiLayout.active = false;
        this.gangLayout.active = false;

        for (const name of Object.keys(OperationPanelBtn)) {
            let node = this.btnLayout.getChildByName(name);
            if ( node ) {
                let key = OperationPanelBtn[name]
                this.btns[key] = node;
                uiFunc.onClick(node,this.onOperationPanelBtnClick.bind(this,key))
            }
        }

        for (const name of Object.keys(ChiBtn)) {
            let node = this.chiLayout.getChildByName(name);
            if ( node ) {
                let key = ChiBtn[name]
                this.chiBtns[key] = node;
                uiFunc.onClick(node,this.onChiBtnClick.bind(this,key))
            }
        }

        for (const name of Object.keys(GangBtn)) {
            let node = this.gangLayout.getChildByName(name);
            if ( node ) {
                let key = GangBtn[name]
                this.gangBtns[key] = node;
                uiFunc.onClick(node,this.onGangBtnClick.bind(this,key))
            }
        }
    }

    update(deltaTime: number) {
        
    }

    onOperationPanelBtnClick(type:OperationPanelBtn) {
        Log.printDebug("onOperationPanelBtnClick",type);
        let {
            tileID,
            canGang_an,
            canGang_bu,
            canGang_ming,
        } = this.config;
        this.btnLayout.active = false;
        if(type == OperationPanelBtn.chi) {
            let {
                canChi_front,
                canChi_middle,
                canChi_back,
            } = this.config;
            let count = Number(canChi_front) + Number(canChi_middle) + Number(canChi_back);
            if (count > 1) {
                this.showChiBtn();
            } else {
                let data:Offline.ChiTileData = {
                    index:ePlayerID.Bottom,
                    tileID:tileID,
                    type:canChi_front ? eChiType.front : (canChi_middle ? eChiType.middle : eChiType.back)
                }
                this.event.emit(this.event.key.chi_tile,data);
            }
        } else if(type == OperationPanelBtn.gang) {
            if(canGang_ming) {
                let data:Offline.GangTileData = {
                    index:ePlayerID.Bottom,
                    tileID:tileID,
                    type:eGangType.ming_gang
                }
                this.event.emit(this.event.key.gang_tile,data);
            } else if (canGang_an || canGang_bu){
                this.showGangBtn();
            }
        } else if(type == OperationPanelBtn.peng) {
            let data:Offline.PengTileData = {
                index:ePlayerID.Bottom,
                tileID:tileID,
            }
            this.event.emit(this.event.key.peng_tile,data);
        } else if(type == OperationPanelBtn.hu) {
            let data:Offline.PengTileData = {
                index:ePlayerID.Bottom,
                tileID:tileID,
            }
            this.event.emit(this.event.key.hu_tile,data);
        } else if(type == OperationPanelBtn.guo) {
            let data:Offline.CancelOperateData = {
                index:ePlayerID.Bottom,
            }
            this.event.emit(this.event.key.cancel,data);
        }
    }

    onChiBtnClick(type:ChiBtn) {
        Log.printDebug("onChiBtnClick",type);
        this.chiLayout.active = false;
        if(type == ChiBtn.cancel) {
            this.btnLayout.active = true;
            return ;
        }
        let data:Offline.ChiTileData = {
            index:ePlayerID.Bottom,
            tileID:this.config.tileID,
            type:type == ChiBtn.front ? eChiType.front : (type == ChiBtn.middle ? eChiType.middle : eChiType.back)
        }
        this.event.emit(this.event.key.chi_tile,data);
    }

    onGangBtnClick(type:GangBtn) {
        Log.printDebug("onGangBtnClick",type);
        this.gangLayout.active = false;
        if(type == GangBtn.cancel) {
            this.btnLayout.active = true;
        }
        let gangData:Offline.GangTileData[] = this.gangData;
        let data:Offline.GangTileData = type == GangBtn.gang_1 ? gangData[0] : (type == GangBtn.gang_2 ? gangData[1] : gangData[2]);
        this.event.emit(this.event.key.gang_tile,data);
    }

    showOperationBtn(config:Offline.OperateConfig) {
        this.config = config;
        let {
            canChi_front,
            canChi_middle,
            canChi_back,
            canPeng,
            canGang_an,
            canGang_bu,
            canGang_ming,
            canWin,
        } = config;
        let needOperate = canChi_front || canChi_middle || canChi_back || canGang_an || canGang_bu || canGang_ming || canPeng || canWin;
        if (!needOperate) {
            return ;
        }
        this.chiLayout.active = false;
        this.btnLayout.active = true;
        this.gangLayout.active = false;
        
        this.btns[OperationPanelBtn.chi].active = canChi_front || canChi_middle || canChi_back;
        this.btns[OperationPanelBtn.gang].active = canGang_an || canGang_bu || canGang_ming;
        this.btns[OperationPanelBtn.guo].active = true;
        this.btns[OperationPanelBtn.hu].active = canWin;
        this.btns[OperationPanelBtn.peng].active = canPeng;
    }

    private showChiBtn() {
        let {
            tileID,
            canChi_front,
            canChi_middle,
            canChi_back,
        } = this.config;

        this.chiLayout.active = true;
        this.btnLayout.active = false;
        this.gangLayout.active = false;

        this.chiBtns[ChiBtn.front].active = canChi_front;
        this.chiBtns[ChiBtn.middle].active = canChi_middle;
        this.chiBtns[ChiBtn.back].active = canChi_back;

        this.updateChiBtn(ChiBtn.front,tileID);
        this.updateChiBtn(ChiBtn.middle,tileID);
        this.updateChiBtn(ChiBtn.back,tileID);
    }

    updateChiBtn(type:ChiBtn,tileID:number) {
        let node = this.chiBtns[type];
        let tile:MJBase[] = [];
        for (let index = 0,nameIndex = 1; index < 3; index++,nameIndex++) {
            tile[index] = node.getChildByName("mj_"+nameIndex)?.getComponent(MJBase);
        }
        let offset = type == ChiBtn.front ? 0 : (type == ChiBtn.middle ? -1 : -2);
        for (let index = 0,id=tileID+offset; index < 3; index++,id++) {
            tile[index].id = id;
        }
    }

    private showGangBtn() {
        let {
            anGang,
            buGang,
        } = this.config;
        this.chiLayout.active = false;
        this.btnLayout.active = false;
        this.gangLayout.active = true;

        let gangData:Offline.GangTileData[] = this.gangData;
        gangData.length = 0;
        anGang.forEach(v=>{
            let data:Offline.GangTileData = {
                index:ePlayerID.Bottom,
                tileID:v,
                type:eGangType.an_gang,
            }
            gangData.push(data)
        })
        buGang.forEach(v=>{
            let data:Offline.GangTileData = {
                index:ePlayerID.Bottom,
                tileID:v,
                type:eGangType.bu_gang,
            }
            gangData.push(data)
        })

        this.chiBtns[GangBtn.gang_1].active = gangData[0] != null;
        this.chiBtns[GangBtn.gang_2].active = gangData[1] != null;
        this.chiBtns[GangBtn.gang_3].active = gangData[2] != null;

        gangData[0] && this.updateGangBtn(GangBtn.gang_1,gangData[0]);
        gangData[1] && this.updateGangBtn(GangBtn.gang_2,gangData[1]);
        gangData[2] && this.updateGangBtn(GangBtn.gang_3,gangData[2]);
    }

    
    updateGangBtn(index:GangBtn,data:Offline.GangTileData) {
        let {tileID,type} = data;
        let node = this.gangBtns[index];
        let tile:MJBase[] = [];
        for (let index = 0,nameIndex = 1; index < 4; index++,nameIndex++) {
            tile[index] = node.getChildByName("mj_"+nameIndex)?.getComponent(MJBase);
            tile[index].id = tileID;
        }

        // if (type == eGangType.an_gang) {
        //     for (let index = 1; index < 3; index++) {
        //         tile[index].mode = TileMode.;
        //     }
        // }
    }
}


