import { _decorator, assert, CCBoolean, CCInteger, Component, Node, Sprite, Vec2, Vec3 } from 'cc';
import { Tile, TileMode, TileModeMaxIndex, TileType, TileTypeMaxIndex } from '../../core/Tile';
import string from 'sprintf-js';
import { TileConfig,Config } from './MJConfig';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('MJBase')
// @executeInEditMode
export class MJBase extends Component {
    @property({
        type:Tile,
        visible:false,
    })
    tile:Tile = new Tile(TileType.WAN,1);
    @property
    private _mode:TileMode = TileMode.IDLE;
    /**
     * 同一模式下的牌按牌的下标做不同区分
     */
    @property
    private _modeIndex:number = 0;

    @property(Node)
    bg:Node;
    @property(Node)
    icon:Node;
    

    protected onLoad(): void {
    }

    @property({
        type:TileMode,
        tooltip:"牌模式",
    })
    set mode(value:number) {
        this._mode = value;
        this.refreshMode();
    }

    get mode() {
        return this._mode;
    }

    @property({
        type:CCInteger,
        tooltip:"模式index",
        min:0,
        max: function (this: MJBase) {
            return TileModeMaxIndex[TileMode[this.mode]]
        }
    })
    set modeIndex(value:number) {
        assert(value>=0 && value<=TileModeMaxIndex[TileMode[this.mode]], `modeIndex:${value} 需要在[0,${TileModeMaxIndex[TileMode[this.mode]]}]范围内`);
        this._modeIndex = value;
        this.refreshMode();
    }

    get modeIndex() {
        return this._modeIndex;
    }

    
    @property({
        type:CCInteger,
        tooltip:"牌值",
        min:1,
        max:function(this: MJBase) {
            return TileTypeMaxIndex[TileType[this.type]]
        }
    })
    set value(value:number) {
        this.tile.value = value;
        this.refreshIcon();
    }

    get value() {
        return this.tile.value;
    }

    @property({
        type:TileType,
        tooltip:"牌类型",
    })
    set type(value:TileType) {
        this.tile.type = value;
        this.refreshIcon();
    }

    get type() {
        return this.tile.type;
    }

    @property({
        type:CCInteger,
        tooltip:"牌id值",
    })
    set id(id:number) {
        this.tile.id = id;
        this.refreshIcon();
    }

    get id() {
        return this.tile.id;
    }
    
    start() {
        this.refreshIcon();
        this.refreshMode();
    }

    update(deltaTime: number) {
        
    }

    refreshIcon() {
        let icon = Config.icon[this.type>>4];
        let path:string;
        if (Array.isArray(icon)) {
            path = icon[this.value];
        } else {
            path = string.sprintf(icon,this.value);
        }
        let sprite = this.icon.getComponent(Sprite);
        if ( TileMode.BOTTOM_HAND == this.mode ) {
        } else {
            path = path + "_1"
        }
        sprite.spriteFrame = sprite.spriteAtlas.getSpriteFrame(path);
    }

    refreshMode() {
        let path = Config.BG[this.mode];
        let sprite = this.bg.getComponent(Sprite);
        /**
         * 控制背景图
         */
        sprite.spriteFrame = sprite.spriteAtlas.getSpriteFrame(path);
        /**
         * 控制icon显示
         */
        if ( TileMode.LEFT_HAND == this.mode ||
            TileMode.TOP_HAND == this.mode ||
            TileMode.RIGHT_HAND == this.mode ||
            TileMode.LEFT_CPG_B == this.mode ||
            TileMode.TOP_CPG_B == this.mode ||
            TileMode.RIGHT_CPG_B == this.mode ||
            TileMode.BOTTOM_CPG_B == this.mode
        ) {
            this.icon.active = false;
        } else {
            this.icon.active = true;
            this.refreshIcon();
            this.refreshIconSize();
        }
        this.refreshBackgroudSize();
    }

    refreshIconSize() {
        let tilePos = TileConfig[this.mode];
        if ( !tilePos ) return ;
        let {pos,rotation,scale} = tilePos;
        if (pos) {
            if (Array.isArray(pos)) {
                this.icon.setPosition(pos[this.modeIndex].x,pos[this.modeIndex].y);
            } else {
                this.icon.setPosition(pos.x,pos.y);
            }
        } else {
            this.icon.setPosition(0,0);
        }
        if (rotation) {
            if (Array.isArray(rotation)) {
                this.icon.setRotation(rotation[this.modeIndex].x,rotation[this.modeIndex].y,rotation[this.modeIndex].z,rotation[this.modeIndex].w);
            } else {
                this.icon.setRotation(rotation.x,rotation.y,rotation.z,rotation.w);
            }
        } else {
            this.icon.setRotation(0,0,0,0);
        }
        if (scale) {
            if (Array.isArray(scale)) {
                this.icon.setScale(scale[this.modeIndex].x,scale[this.modeIndex].y);
            } else {
                this.icon.setScale(scale.x,scale.y);
            }
        } else {
            this.icon.setScale(1,1);
        }
    }

    
    refreshBackgroudSize() {
        let tilePos = TileConfig[this.mode];
        if ( !tilePos ) return ;
        let {b_pos : pos,b_rotation : rotation,b_scale : scale} = tilePos;
        if (pos) {
            if (Array.isArray(pos)) {
                this.bg.setPosition(pos[this.modeIndex].x,pos[this.modeIndex].y);
            } else {
                this.bg.setPosition(pos.x,pos.y);
            }
        } else {
            this.bg.setPosition(0,0);
        }
        if (rotation) {
            if (Array.isArray(rotation)) {
                this.bg.setRotation(rotation[this.modeIndex].x,rotation[this.modeIndex].y,rotation[this.modeIndex].z,rotation[this.modeIndex].w);
            } else {
                this.bg.setRotation(rotation.x,rotation.y,rotation.z,rotation.w);
            }
        } else {
            this.bg.setRotation(0,0,0,0);
        }
        if (scale) {
            if (Array.isArray(scale)) {
                this.bg.setScale(scale[this.modeIndex].x,scale[this.modeIndex].y);
            } else {
                this.bg.setScale(scale.x,scale.y);
            }
        } else {
            this.bg.setScale(1,1);
        }
    }
    /**
     * 点击测试
     * @param screenPoint 
     * @param windowId 
     * @returns 
     */
    hitTest(screenPoint: Vec2, windowId?: number) {
        return this.bg._uiProps.uiTransformComp!.hitTest(screenPoint, windowId);
    }
}

