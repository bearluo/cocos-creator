import { _decorator, Component, Node } from 'cc';
import { TablePrefab } from '../prefab/TablePrefab';
import { ePlayerID, FourPlayerID, PlayerID } from '../../core/Config';

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('table_test_scene')
@executeInEditMode
export class table_test_scene extends Component {
    playerID:PlayerID = new FourPlayerID();
    @property({
        type:TablePrefab,
        tooltip:"桌子预设",
    })
    table:TablePrefab

    _playerID:ePlayerID;
    
    @property({
        type:ePlayerID,
        tooltip:"用来生成各个麻将坐标的",
    })
    set test(id:ePlayerID) {
        this._playerID = id;
        this.resetDiscardPile();
    }

    get test() {
        return this._playerID;
    }
    
    start() {
        this.table.start();
    }

    update(deltaTime: number) {
        
    }

    resetDiscardPile() {
        let cardIDs = [];
        for (let index = 0; index <= 21; index++) {
            cardIDs[index] = 1;
        }
        // this.playerID.array().forEach(v=>{
        //     this.table.resetDiscardPile(v,cardID);
        // })
        this.table.resetDiscardPile(this._playerID,cardIDs);
    }

}


