import { assert, BlockInputEvents, Color, color, Component, Sprite, SpriteFrame } from "cc";
import { constant } from "../common/FWConstant";
/**
 * 遮罩
 */
export class FWUIMask extends Component {
    protected start(): void {
        //添加触摸吞噬
        this.node.addComponent(BlockInputEvents);
        //添加Sprite
        let sprite = this.node.addComponent(Sprite);
        //调整颜色
        sprite.color = constant.color.mask;
        //调整尺寸模式
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        //设置SpriteFrame
        // sprite.spriteFrame = constant.default_sprite_splash;
        //设置SpriteFrame
        app.manager.asset.loadBundle({
            name: "framework",
            onComplete: (err:Error,bundle) => {
                assert(err == null,err?.message)
                bundle.load({
                    paths: "res/img/default_sprite_splash/spriteFrame",
                    assetType: SpriteFrame,
                    onComplete: (err,res:SpriteFrame) => {
                        //更换精灵
                        sprite.spriteFrame = res;
                    }
                })
            }
        })
    }
}