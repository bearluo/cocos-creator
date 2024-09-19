import { _decorator, Color, Component, EditBox, instantiate, Label, Node, Pool, Prefab, ScrollView, Sprite, UITransform } from 'cc';
import { IMonster, ISceneConfig, IWayPathAnchors, WayPathAnchors } from '../../common/SceneConfig';
import { qAsset, uiFunc } from '../../../framework/common/FWFunction';
import { FWUIDialog } from '../../../framework/ui/FWUIDialog';
import { game, gameFunc } from '../../common/constant';
import { log } from '../../../framework/common/FWLog';
import { ScrollViewContent } from '../../../framework/components/ScrollViewContent';
import { map_id, MapBundleName, MapConfig } from '../../map/share';
const { ccclass, property,type } = _decorator;

@ccclass('MapEdit')
export class MapEdit extends FWUIDialog {
    scrollView:ScrollView;
    scrollViewContent:ScrollViewContent;

    mapNode:Node;

    selectClickListener:(index:number,data:ScrollViewItemData)=>void;
    
    private _selectNode:Node;

    protected onLoad(): void {
        this.mapNode = this.node.getChildByPath("Node_map/view/content");
        this.scrollView = this.node.getChildByName("ScrollView").getComponent(ScrollView);
        this.scrollViewContent = this.scrollView.content.getComponent(ScrollViewContent);
        this.scrollViewContent.initListener = this.initMapList.bind(this)

        // uiFunc.onClickSfx(this.node.getChildByName("Button_edit"),this.onEditClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByName("Button_select"),this.onSelectWayPathClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByName("Button_close"),this.onClickClose.bind(this));

    }

    protected start(): void {
        this.scrollViewContent.updateList(MapConfig)
    }
    

    initMapList(index: number, node: Node, data: string) {
        let name = map_id[index];
        let item = node.addComponent(ScrollViewItem);
        item.selectClickListener = this.onSelectClick.bind(this);
        item.loadConfig({
            name:name.toString(),
            path:data,
        })
    }

    onSelectClick(index:number,data: ScrollViewItemData) {
        let oldNode = this._selectNode;
        let newNode = this.scrollView.content.children[index];
        this._selectNode = newNode;
        oldNode?.getComponent(ScrollViewItem).onUnSelect();
        newNode?.getComponent(ScrollViewItem).onSelect();
        
        
        this.mapNode.destroyAllChildren();
        qAsset.loadAsset(MapBundleName,data.path,Prefab).then(prefab=>{
            let newNode = instantiate(prefab);
            newNode.parent = this.mapNode;
        });
    }

    onSelectWayPathClick() {
        if(this._selectNode) {
            let item = this._selectNode.getComponent(ScrollViewItem)
            let config = item.data;
            let index = this.scrollView.content.children.findIndex(v=>v==this._selectNode);
            this.selectClickListener?.(index,config);
            this.hide();
        }
    }

    onDestroy(): void {
    }
}

interface ScrollViewItemData {
    name:string,
    path:string
}

class ScrollViewItem extends Component {
    itemName:Label;
    bg:Sprite;
    data:ScrollViewItemData;
    selectClickListener:Function;

    protected onLoad(): void {
        this.itemName = this.node.getChildByName("name").getComponent(Label);
        this.bg = this.node.getComponent(Sprite);
        uiFunc.onClickSfx(this.node,this.onSelectClick.bind(this));
        this.onUnSelect();
    }

    onSelectClick() {
        this.selectClickListener?.(this.node.getSiblingIndex(),this.data);
    }

    onUnSelect() {
        this.bg.color = Color.GRAY;
    }

    onSelect() {
        this.bg.color = Color.GREEN;
    }

    loadConfig(data:ScrollViewItemData) {
        let {name} = this.data = data;
        this.itemName.string = name
    }
}

