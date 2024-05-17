import { _decorator, Color, Component, EditBox, instantiate, Label, Node, Pool, Prefab, ScrollView, Sprite } from 'cc';
import { IMonster, ISceneConfig, ISpawner, IWayPathAnchors } from '../../common/SceneConfig';
import { qAsset, uiFunc } from '../../../framework/common/FWFunction';
import { FWUIDialog } from '../../../framework/ui/FWUIDialog';
import { game, gameFunc } from '../../common/constant';
import { log } from '../../../framework/common/FWLog';
import { WayPathEdit } from './WayPathEdit';
const { ccclass, property,type } = _decorator;

@ccclass('SpawnerEdit')
export class SpawnerEdit extends FWUIDialog {
    scrollView:ScrollView;
    scrollViewItem:Node;
    scrollViewItemPool:Pool<Node>;

    editBox_name:EditBox;
    label_WayPath_name:Label;

    private _selectNode:Node;
    private _maxMonsterID:number;
    
    protected onLoad(): void {
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
        uiFunc.onClickSfx(this.node.getChildByName("Button_close"),this.onClickClose.bind(this));
        uiFunc.onClickSfx(this.node.getChildByName("Button_WayPath"),this.onClickWayPathSelect.bind(this));
        uiFunc.onClickSfx(this.node.getChildByName("Button_edit"),this.onEditClick.bind(this));
        
        this.editBox_name = this.node.getChildByPath("EditBox_name").getComponent(EditBox);
        this.label_WayPath_name = this.node.getChildByPath("Label_WayPath_name").getComponent(Label);

        
        this.editBox_name.node.on(EditBox.EventType.EDITING_DID_ENDED,this.onEditBoxChange,this)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    loadConfig(config:ISceneConfig) {
        let {spawner} = config;
        this.updateList(spawner);
    }

    updateList(spawner: ISpawner[]) {
        this.scrollViewItemPool.freeArray(this.scrollView.content.children);
        this._selectNode?.getComponent(ScrollViewItem).onUnSelect();
        this.scrollView.content.removeAllChildren();
        spawner.forEach(v=>{
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
        game.edit.deleteSpawnerConfig(index);
    }

    onAddClick() {
        let node = this.scrollViewItemPool.alloc();
        node.parent = this.scrollView.content;
        this._maxMonsterID++;
        let config:ISpawner = {
            name:"",
            pathName:"",
            queue:[],
        }
        node.getComponent(ScrollViewItem).loadConfig(config);
        game.edit.addSpawnerConfig(config);
    }

    onSelectClick(index:number,data: ISpawner) {
        let oldNode = this._selectNode;
        let newNode = this.scrollView.content.children[index];
        this._selectNode = newNode;
        oldNode?.getComponent(ScrollViewItem).onUnSelect();
        newNode?.getComponent(ScrollViewItem).onSelect();

        this.editBox_name.string = data.name.toString();
        this.label_WayPath_name.string = data.pathName.toString();
    }

    onEditBoxChange() {
        if(this._selectNode) {
            let item = this._selectNode.getComponent(ScrollViewItem)
            let config:ISpawner = {
                name:this.editBox_name.string.trim(),
                pathName:this.label_WayPath_name.string.trim(),
                queue:item.data.queue,
            }
            item.loadConfig(config);
            let index = this.scrollView.content.children.findIndex(v=>v==this._selectNode);
            game.edit.changeSpawnerConfig(index,config);
        }
    }

    async onClickWayPathSelect() {
        if(this._selectNode) {
            let wayPathEdit = (await gameFunc.showWayPathEdit()) as WayPathEdit;
            uiFunc.asyncAssert(this);
            wayPathEdit.selectClickListener = (index:number,wayPathAnchors: IWayPathAnchors)=>{
                if(this._selectNode) {
                    this.label_WayPath_name.string = wayPathAnchors.name;
                    this.onEditBoxChange();
                }
            }
        }
    }

    
    onEditClick() {
        if(this._selectNode) {
            let item = this._selectNode.getComponent(ScrollViewItem)
            let config = item.data;
            let index = this.scrollView.content.children.findIndex(v=>v==this._selectNode);
            gameFunc.gotoSpawnerEdit(index,config);
            this.hide();
        }
    }
    
    onDestroy(): void {
        this.scrollViewItemPool.destroy();
        this.scrollViewItem.destroy();
    }
}


class ScrollViewItem extends Component {
    bg:Sprite;
    Label_name:Label;
    data:ISpawner;
    deleteClickListener:Function;
    selectClickListener:Function;

    protected onLoad(): void {
        this.bg = this.node.getComponent(Sprite);
        this.Label_name = this.node.getChildByName("Label_name").getComponent(Label);
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

    async loadConfig(data:ISpawner) {
        let {name,pathName} = this.data = data;
        this.Label_name.string = name;
    }
}

