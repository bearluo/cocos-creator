import { _decorator, CCBoolean, Component, Node, Vec2, Vec3 } from 'cc';
import { MJBase } from '../prefab/MJBase';
import { TablePosConfig } from '../prefab/TablePosConfig';
import { TablePrefab } from '../prefab/TablePrefab';
import { ePlayerID } from '../../core/Config';

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('table_pos_config')
@executeInEditMode
export class table_pos_config extends Component {
    @property({
        type:TablePrefab
    })
    obj:TablePrefab = null;
    @property
    _testData = TablePosConfig;
    @property({
        type:ePlayerID,
    })
    playID:ePlayerID
    
    @property({
        type:CCBoolean,
        tooltip:"用来生成各个麻将坐标的",
    })
    set test(id:boolean) {
        let config = this._testData[this.playID] = this._testData[this.playID] || {}
        let posConfig = config.discardPilePos = config.discardPilePos || []
        let tileObjs = this.obj.discardPile[this.playID];
        tileObjs.forEach((v,index)=>{
            let pos = v.node.position;
            posConfig[index] = new Vec2(pos.x,pos.y);
        })
        Editor.Clipboard.write("text",JSON.stringify(config, null, 4))
    }

    get test() {
        return false;
    }
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}