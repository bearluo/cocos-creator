import { _decorator, CCBoolean, Component, Node, Vec2 } from 'cc';
import { TablePrefab } from '../prefab/TablePrefab';
import { eChiType, eCPGType, eGangType, ePlayerID, I_CPGPile } from '../../core/Config';
import { FourPlayerID, PlayerID } from '../../core/PlayerID';
import { TableTileCount } from '../prefab/TablePosConfig';
import { OperationPanel } from '../prefab/OperationPanel';

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('table_test_scene')
@executeInEditMode
export class table_test_scene extends Component {
    @property({
        type:TablePrefab,
        tooltip:"桌子预设",
    })
    table:TablePrefab
    @property({
        type:OperationPanel,
        tooltip:"操作面板",
    })
    operationPanel:OperationPanel
    
    
    @property({
        type:CCBoolean,
        tooltip:"用来生成各个麻将坐标的",
    })
    set refresh(id:boolean) {
        this.testAdd();
    }

    get refresh() {
        return false;
    }
    
    @property({
        type:CCBoolean,
        tooltip:"用来生成各个麻将坐标的",
    })
    set write(id:boolean) {
        Editor.Clipboard.write("text",this.toString())
    }

    get write() {
        return false;
    }
    
    start() {
        this.table.start();
    }

    update(deltaTime: number) {
        
    }

    print() {
        console.log("123");
    }

    toString() {
        let config = {
            discardPile:[],
            handPile:[],
            cpgPile:[],
        } as any;
        for (let index = 0; index < this.table.playerCount; index++) {
            let discardPile = config.discardPile[index] = [];
            this.table.discardPile[index].forEach((v,index)=>{
                let pos = v.node.position;
                discardPile[index] = new Vec2(pos.x,pos.y);
            })
            let handPile = config.handPile[index] = [];
            this.table.handPile[index].forEach((v,index)=>{
                let pos = v.node.position;
                handPile[index] = new Vec2(pos.x,pos.y);
            })
            // let cpgPile = config.cpgPile[index] = [];
            // this.table.cpgPile[index].forEach((v,index)=>{
            //     let pos = v.node.position;
            //     cpgPile[index] = new Vec2(pos.x,pos.y);
            // })
        }
        return JSON.stringify(config, null, 4);
    }

    testAdd() {
        this.table.node.removeAllChildren();
        for (let index = 0; index < this.table.playerCount; index++) {
            this.table.discardPile[index] = [];
        }
        let discardPileCardIDs = [];
        for (let index = 0; index < TableTileCount.discardPile; index++) {
            discardPileCardIDs[index] = 1;
        }
        for (let index = 0; index < this.table.playerCount; index++) {
            this.table.resetDiscardPile(index,discardPileCardIDs);
        }

        for (let index = 0; index < this.table.playerCount; index++) {
            this.table.handPile[index] = [];
        }
        let handPileCardIDs = [];
        for (let index = 0; index < TableTileCount.handPile; index++) {
            handPileCardIDs[index] = 1;
        }
        for (let index = 0; index < this.table.playerCount; index++) {
            this.table.resetHandPile(index,handPileCardIDs);
        }

        for (let index = 0; index < this.table.playerCount; index++) {
            this.table.cpgPile[index] = [];
        }
        let cpgPileCardIDs:I_CPGPile[] = [
            {type:eCPGType.chi,tileIDs:[1,2,3],chiType:eChiType.front},
            {type:eCPGType.peng,tileIDs:[4,4,4]},
            {type:eCPGType.gang,tileIDs:[5,5,5,5],gangType:eGangType.an_gang},
            {type:eCPGType.gang,tileIDs:[5,5,5,5],gangType:eGangType.ming_gang},
        ];
        for (let index = 0; index < this.table.playerCount; index++) {
            this.table.resetCPGPile(index,cpgPileCardIDs);
        }
    }

    testShowOperationBtn() {
        this.operationPanel.showOperationBtn({
            tileID : 3,
            canChi_front : true,
            canChi_middle : true,
            canChi_back : false,
            canPeng : true,
            canGang_ming : false,
            canGang_bu : true,
            buGang : [3,4],
            canGang_an : true,
            anGang : [5],
            canWin : false,
        })
    }
}


