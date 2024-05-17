import { _decorator, Color, Component, EditBox, instantiate, Node, Pool, Prefab, ScrollView, Sprite } from 'cc';
import { IMonster, ISceneConfig } from '../../common/SceneConfig';
import { qAsset, uiFunc } from '../../../framework/common/FWFunction';
import { FWUIDialog } from '../../../framework/ui/FWUIDialog';
import { game } from '../../common/constant';
import { log } from '../../../framework/common/FWLog';
const { ccclass, property,type } = _decorator;

@ccclass('MosterEdit')
export class MosterEdit extends FWUIDialog {
    scrollView:ScrollView;
    scrollViewItem:Node;
    scrollViewItemPool:Pool<Node>;

    editBox_id:EditBox
    editBox_maxCache:EditBox
    editBox_prefabBundelName:EditBox
    editBox_prefabPath:EditBox

    selectClickListener:(index:number,data: IMonster)=>void;

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
        uiFunc.onClickSfx(this.node.getChildByName("Button_select"),this.onSelectMonsterClick.bind(this));
        
        this.editBox_id = this.node.getChildByPath("EditBox_id").getComponent(EditBox);
        this.editBox_maxCache = this.node.getChildByPath("EditBox_maxCache").getComponent(EditBox);
        this.editBox_prefabBundelName = this.node.getChildByPath("EditBox_prefabBundelName").getComponent(EditBox);
        this.editBox_prefabPath = this.node.getChildByPath("EditBox_prefabPath").getComponent(EditBox);

        
        this.editBox_id.node.on(EditBox.EventType.EDITING_DID_ENDED,this.onEditBoxChange,this)
        this.editBox_maxCache.node.on(EditBox.EventType.EDITING_DID_ENDED,this.onEditBoxChange,this)
        this.editBox_prefabBundelName.node.on(EditBox.EventType.EDITING_DID_ENDED,this.onEditBoxChange,this)
        this.editBox_prefabPath.node.on(EditBox.EventType.EDITING_DID_ENDED,this.onEditBoxChange,this)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    loadConfig(config:ISceneConfig) {
        let {monster} = config;
        this._maxMonsterID = 0;
        for(let i=0;i<monster.length;i++) {
            let {mosterID} = monster[i];
            if(mosterID > this._maxMonsterID) {
                this._maxMonsterID = mosterID;
            }
        }
        this.updateList(monster);
    }

    updateList(monster: IMonster[]) {
        this.scrollViewItemPool.freeArray(this.scrollView.content.children);
        this._selectNode?.getComponent(ScrollViewItem).onUnSelect();
        this.scrollView.content.removeAllChildren();
        monster.forEach(v=>{
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
        game.edit.deleteMonsterConfig(index);
    }

    onAddClick() {
        let node = this.scrollViewItemPool.alloc();
        node.parent = this.scrollView.content;
        this._maxMonsterID++;
        let config:IMonster = {
            mosterID:this._maxMonsterID,
            prefabBundelName:"TDGame",
            prefabPath:"monster/monster",
            maxCache:1,
        }
        node.getComponent(ScrollViewItem).loadConfig(config);
        game.edit.addMonsterConfig(config);
    }

    onSelectClick(index:number,monster: IMonster) {
        let oldNode = this._selectNode;
        let newNode = this.scrollView.content.children[index];
        this._selectNode = newNode;
        oldNode?.getComponent(ScrollViewItem).onUnSelect();
        newNode?.getComponent(ScrollViewItem).onSelect();

        this.editBox_id.string = monster.mosterID.toString();
        this.editBox_prefabBundelName.string = monster.prefabBundelName.toString();
        this.editBox_prefabPath.string = monster.prefabPath.toString();
        this.editBox_maxCache.string = monster.maxCache.toString();
    }

    onEditBoxChange() {
        if(this._selectNode) {
            let config:IMonster = {
                mosterID:parseInt(this.editBox_id.string.trim()),
                prefabBundelName:this.editBox_prefabBundelName.string.trim(),
                prefabPath:this.editBox_prefabPath.string.trim(),
                maxCache:parseInt(this.editBox_maxCache.string.trim()),
            }
            this._selectNode.getComponent(ScrollViewItem).loadConfig(config);
            let index = this.scrollView.content.children.findIndex(v=>v==this._selectNode);
            game.edit.changeMonsterConfig(index,config);
        }
    }

    onSelectMonsterClick() {
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
    bg:Sprite;
    prefabNode:Node;
    data:IMonster;
    deleteClickListener:Function;
    selectClickListener:Function;

    protected onLoad(): void {
        this.bg = this.node.getComponent(Sprite);
        this.prefabNode = this.node.getChildByName("Node_prefab")
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

    async loadConfig(data:IMonster) {
        let {prefabPath,prefabBundelName} = this.data = data;
        this.prefabNode.destroyAllChildren();
        try {
            let prefab = await qAsset.loadAsset(prefabBundelName,prefabPath, Prefab);
            uiFunc.asyncAssert(this);
            //TODO 这里可能会有显示问题 因为是异步的
            let node = instantiate(prefab);
            node.parent = this.prefabNode;
        } catch (error) {
            log.printError(error?.message)
        }
    }
}

