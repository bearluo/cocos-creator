import { _decorator, Color, Component, EditBox, instantiate, Label, Node, Pool, Prefab, ScrollView, Sprite, UITransform, Vec2, Vec3 } from 'cc';
import { IMonster, ISceneConfig } from '../../common/SceneConfig';
import { qAsset, uiFunc } from '../../../framework/common/FWFunction';
import { FWUIDialog } from '../../../framework/ui/FWUIDialog';
import { game } from '../../common/constant';
import { log } from '../../../framework/common/FWLog';
import { ScrollViewContent } from '../../../framework/components/ScrollViewContent';
import { monster_id, MonsterBundleName, MonsterConfig } from '../../monster/share';
const { ccclass, property,type } = _decorator;
const tmp = new Vec2();
@ccclass('MosterEdit')
export class MosterEdit extends FWUIDialog {
    scrollView:ScrollView;
    scrollViewItem:Node;
    scrollViewItemPool:Pool<Node>;

    editBox_maxCache:EditBox
    Label_mosterID_name:Label

    selectClickListener:(index:number,data: IMonster)=>void;

    private _selectNode:Node;

    scrollView_monster:ScrollView;
    scrollViewContent_monster:ScrollViewContent;
    
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

        this.scrollView_monster = this.node.getChildByName("ScrollView-monster").getComponent(ScrollView);
        this.scrollViewContent_monster = this.scrollView_monster.content.getComponent(ScrollViewContent);
        this.scrollViewContent_monster.initListener = this.initMonsterList.bind(this)

        // uiFunc.onClickSfx(this.node.getChildByName("Button_new"),this.onAddClick.bind(this));
        uiFunc.onClickSfx(this.node.getChildByName("Button_close"),this.onClickClose.bind(this));
        uiFunc.onClickSfx(this.node.getChildByName("Button_select"),this.onSelectMonsterClick.bind(this));
        

        
        this.Label_mosterID_name = this.node.getChildByPath("Label_mosterID_name").getComponent(Label);
        
        this.editBox_maxCache = this.node.getChildByPath("EditBox_maxCache").getComponent(EditBox);
        this.editBox_maxCache.node.on(EditBox.EventType.EDITING_DID_ENDED,this.onEditBoxChange,this)
    }

    start() {
        this.scrollViewContent_monster.updateList(MonsterConfig)
    }

    update(deltaTime: number) {
        
    }

    loadConfig(config:ISceneConfig) {
        let {monster} = config;
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

    onSelectClick(index:number,monster: IMonster) {
        let oldNode = this._selectNode;
        let newNode = this.scrollView.content.children[index];
        this._selectNode = newNode;
        oldNode?.getComponent(ScrollViewItem).onUnSelect();
        newNode?.getComponent(ScrollViewItem).onSelect();

        this.Label_mosterID_name.string = monster_id[monster.mosterID].toString();
        this.editBox_maxCache.string = monster.maxCache.toString();
    }

    onEditBoxChange() {
        if(this._selectNode) {
            let item = this._selectNode.getComponent(ScrollViewItem)
            let config = item.data;
            config.maxCache = parseInt(this.editBox_maxCache.string.trim()),
            item.loadConfig(config);
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

    initMonsterList(monster_id: number, node: Node, data: string) {
        let Node_prefab = node.getChildByName("Node_prefab");
        Node_prefab.destroyAllChildren();
        uiFunc.onClickSfx(node,()=>{
            {
                let node = this.scrollView.content.children.find(v=>v.getComponent(ScrollViewItem).data.mosterID == monster_id);
                if (node) {
                    node.getComponent(ScrollViewItem).onSelectClick();
                    let height = node._uiProps.uiTransformComp.height;
                    let {position} = node;
                    tmp.x = position.x;
                    tmp.y = -position.y+height/2;
                    this.scrollView.scrollToOffset(tmp);
                    return
                }
            }
            let node = this.scrollViewItemPool.alloc();
            node.parent = this.scrollView.content;
            let config:IMonster = {
                mosterID:monster_id,
                maxCache:1,
            }
            node.getComponent(ScrollViewItem).loadConfig(config);
            node.getComponent(ScrollViewItem).onSelectClick();
            this.scrollView.scrollToBottom();
            game.edit.addMonsterConfig(config);
        });

        let monster = game.edit.allocMonster(monster_id);
        monster.node.parent = Node_prefab;
        monster.node.position = Vec3.ZERO;
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

    loadConfig(data:IMonster) {
        let {mosterID} = this.data = data;
        this.prefabNode.destroyAllChildren();
        let monster = game.edit.allocMonster(mosterID)
        monster.node.position = Vec3.ZERO;
        monster.node.parent = this.prefabNode;
    }
}

