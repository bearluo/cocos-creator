import { _decorator, Color, Component, EditBox, instantiate, Label, Node, Pool, Prefab, ScrollView, Sprite } from 'cc';
import { IMonster, ISceneConfig, IWayPathAnchors, WayPathAnchors } from '../../common/SceneConfig';
import { qAsset, uiFunc } from '../../../framework/common/FWFunction';
import { FWUIDialog } from '../../../framework/ui/FWUIDialog';
import { game, gameFunc } from '../../common/constant';
import { log } from '../../../framework/common/FWLog';
const { ccclass, property,type } = _decorator;

@ccclass('WayPathEdit')
export class WayPathEdit extends FWUIDialog {
    scrollView:ScrollView;
    scrollViewItem:Node;
    scrollViewItemPool:Pool<Node>;
    editBox:EditBox;
    selectClickListener:(index:number,wayPathAnchors: IWayPathAnchors)=>void;
    
    private _selectNode:Node;

    protected onLoad(): void {
        this.editBox = this.node.getChildByPath("EditBox").getComponent(EditBox);
        this.scrollView = this.node.getChildByName("ScrollView").getComponent(ScrollView);
        this.scrollViewItem = this.node.getChildByPath("ScrollView/ScrollView_item");
        this.scrollViewItem.parent = null;
        this.scrollViewItemPool = new Pool<Node>(()=>{
            let node = instantiate(this.scrollViewItem);
            let item = node.addComponent(ScrollViewItem);
            item.deleteClickListener = this.onDeleteClick.bind(this);
            item.selectClickListener = this.onSelectClick.bind(this);
            return node;
        },10,(item)=>{
            item.destroy();
        });

        uiFunc.onClickSfx(this.node.getChildByName("Button_new"),this.onAddClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByName("Button_edit"),this.onEditClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByName("Button_select"),this.onSelectWayPathClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByName("Button_close"),this.onClickClose.bind(this));

        this.editBox.node.on(EditBox.EventType.EDITING_DID_ENDED,this.onEditBoxChange,this)
        
    }

    protected start(): void {
    }

    loadConfig(config:ISceneConfig) {
        let {wayPathAnchors} = config;
        this.updateList(wayPathAnchors);
    }

    updateList(wayPathAnchors: IWayPathAnchors[]) {
        this.scrollViewItemPool.freeArray(this.scrollView.content.children);
        this._selectNode?.getComponent(ScrollViewItem).onUnSelect();
        this.scrollView.content.removeAllChildren();
        wayPathAnchors.forEach(v=>{
            let node = this.scrollViewItemPool.alloc();
            node.parent = this.scrollView.content;
            node.getComponent(ScrollViewItem).loadConfig(v);
        })
    }

    onDeleteClick(index:number) {
        let node = this.scrollView.content.children[index];
        if (node) {
            this.scrollViewItemPool.free(node);
            node.parent = null;
            if(this._selectNode == node) {
                node.getComponent(ScrollViewItem).onUnSelect();
                this._selectNode = null;
            }
        }
        game.edit.deleteWayPathConfig(index);
    }

    onAddClick() {
        let node = this.scrollViewItemPool.alloc();
        node.parent = this.scrollView.content;
        let item = node.getComponent(ScrollViewItem)
        let text = this.editBox.string.trim() + Date.now();
        let config:IWayPathAnchors = new WayPathAnchors(text);
        item.loadConfig(config);
        game.edit.addWayPathConfig(config);
    }

    onSelectClick(index:number,wayPath: IWayPathAnchors) {
        let oldNode = this._selectNode;
        let newNode = this.scrollView.content.children[index];
        this._selectNode = newNode;
        oldNode?.getComponent(ScrollViewItem).onUnSelect();
        newNode?.getComponent(ScrollViewItem).onSelect();
        this.editBox.string = wayPath.name;
    }

    onEditBoxChange() {
        let text = this.editBox.string.trim();
        if(this._selectNode && text.length > 0) {
            let item = this._selectNode.getComponent(ScrollViewItem)
            let config = item.data;
            config.name = text;
            item.loadConfig(config);
            let index = this.scrollView.content.children.findIndex(v=>v==this._selectNode);
            game.edit.changeWayPathConfig(index,config);
        }
    }

    onEditClick() {
        if(this._selectNode) {
            let item = this._selectNode.getComponent(ScrollViewItem)
            let config = item.data;
            let index = this.scrollView.content.children.findIndex(v=>v==this._selectNode);
            gameFunc.gotoWayPointEdit(index,config);
            this.hide();
        }
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
        this.scrollViewItemPool.destroy();
        this.scrollViewItem.destroy();
    }
}


class ScrollViewItem extends Component {
    itemName:Label;
    bg:Sprite;
    data:IWayPathAnchors;
    deleteClickListener:Function;
    selectClickListener:Function;

    protected onLoad(): void {
        this.itemName = this.node.getChildByName("name").getComponent(Label);
        this.bg = this.node.getComponent(Sprite);
        uiFunc.onClickSfx(this.node.getChildByName("delete"),this.onDeleteClick.bind(this));
        uiFunc.onClickSfx(this.node,this.onSelectClick.bind(this));
        this.onUnSelect();
    }

    onDeleteClick() {
        this.deleteClickListener?.(this.node.getSiblingIndex());
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

    loadConfig(data:IWayPathAnchors) {
        let {name} = this.data = data;
        this.itemName.string = name
    }
}

