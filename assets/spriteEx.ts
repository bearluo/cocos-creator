import { _decorator, Component, director, Node, RenderData, Sprite, UIVertexFormat } from 'cc';
const { ccclass, property } = _decorator;

//new accessor
@ccclass('spriteEx')
export class spriteEx extends Sprite {
    static accessor
    /**
     * @en Request new render data object.
     * @zh 请求新的渲染数据对象。
     * @return The new render data
     */
    public requestRenderData (drawInfoType = 0) {
        if (spriteEx.accessor == null) {
            spriteEx.accessor = RenderData.createStaticVBAccessor(UIVertexFormat.vfmtPosUvColor);
            director.root.batcher2D.registerBufferAccessor(-1,spriteEx.accessor);
        }
        const data = RenderData.add(UIVertexFormat.vfmtPosUvColor,spriteEx.accessor);
        data.initRenderDrawInfo(this, drawInfoType);
        this._renderData = data;
        return data;
    }

    /**
     * @en Destroy current render data.
     * @zh 销毁当前渲染数据。
     */
    public destroyRenderData () {
        if (!this.renderData) {
            return;
        }
        this.renderData.removeRenderDrawInfo(this);
        RenderData.remove(this.renderData);
        this._renderData = null;
    }
}