import { _decorator, CCBoolean, Component, Node, Vec2, Vec3, Vec4 } from 'cc';
import { TileConfig } from '../prefab/MJConfig';
import { MJBase } from '../prefab/MJBase';

const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('tile_pos_config')
@executeInEditMode
export class tile_pos_config extends Component {
    @property({
        type:MJBase
    })
    obj:MJBase = null;
    @property
    _testData = TileConfig;
    
    @property({
        type:CCBoolean,
        tooltip:"用来生成各个麻将坐标的",
    })
    set test(id:boolean) {
        let config = this._testData[this.obj.mode] = this._testData[this.obj.mode] || {}
        let posConfig = config.pos = config.pos || []
        let rotationConfig = config.rotation = config.rotation || []
        let scaleConfig = config.scale = config.scale || []
        let pos = this.obj.icon.position;
        let rotation = this.obj.icon.rotation;
        let scale = this.obj.icon.scale;
        posConfig[this.obj.modeIndex] = new Vec2(pos.x,pos.y);
        rotationConfig[this.obj.modeIndex] = new Vec4(rotation.x,rotation.y,rotation.z,rotation.w);
        scaleConfig[this.obj.modeIndex] = new Vec2(scale.x,scale.y);
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