import { _decorator, Color, Component, EditBox, instantiate, Label, Node, Pool, Prefab, ScrollView, Sprite, Vec3 } from 'cc';
import { IMonster, ISceneConfig, ISpawner, ISpawnerItem, IWayPathAnchors } from '../../common/SceneConfig';
import { qAsset, uiFunc } from '../../../framework/common/FWFunction';
import { FWUIDialog } from '../../../framework/ui/FWUIDialog';
import { game, gameFunc } from '../../common/constant';
import { log } from '../../../framework/common/FWLog';
import { WayPathEdit } from './WayPathEdit';
import { MosterEdit } from './MosterEdit';
import { Monster } from '../../monster/Monster';
const { ccclass, property,type } = _decorator;

@ccclass('SpawnerQueueEdit')
export class SpawnerQueueEdit extends FWUIDialog {
    scrollView:ScrollView;
    scrollViewItem:Node;
    scrollViewItemPool:Pool<Node>;

    EditBox_time:EditBox;
    Label_monster_id:Label;

    private _selectNode:Node;
    private _maxMonsterID:number;
    spawnerItems: ISpawnerItem[];
    

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
        uiFunc.onClickSfx(this.node.getChildByName("Button_monster"),this.onClickMonsterSelect.bind(this));
        
        this.EditBox_time = this.node.getChildByPath("EditBox_time").getComponent(EditBox);
        this.Label_monster_id = this.node.getChildByPath("Label_monster_id").getComponent(Label);

        
        this.EditBox_time.node.on(EditBox.EventType.EDITING_DID_ENDED,this.onEditBoxChange,this)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    loadConfig(config:ISceneConfig) {
    }

    updateList(spawnerItems: ISpawnerItem[]) {
        this.scrollViewItemPool.freeArray(this.scrollView.content.children);
        this._selectNode?.getComponent(ScrollViewItem).onUnSelect();
        this.scrollView.content.removeAllChildren();
        spawnerItems.forEach(v=>{
            let node = this.scrollViewItemPool.alloc();
            node.parent = this.scrollView.content;
            node.getComponent(ScrollViewItem).loadConfig(v);
        })
        this.spawnerItems = spawnerItems
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
        this.spawnerItems.splice(index,1);
        // game.edit.deleteSpawnerConfig(index);
    }

    onAddClick() {
        let node = this.scrollViewItemPool.alloc();
        node.parent = this.scrollView.content;
        this._maxMonsterID++;
        let config:ISpawnerItem = {
            monsterID:0,
            showTime:0,
        }
        node.getComponent(ScrollViewItem).loadConfig(config);
        this.spawnerItems.push(config);
        // game.edit.addSpawnerConfig(config);
    }

    onSelectClick(index:number,data: ISpawnerItem) {
        let oldNode = this._selectNode;
        let newNode = this.scrollView.content.children[index];
        this._selectNode = newNode;
        oldNode?.getComponent(ScrollViewItem).onUnSelect();
        newNode?.getComponent(ScrollViewItem).onSelect();

        this.EditBox_time.string = data.showTime.toString();
        this.Label_monster_id.string = data.monsterID.toString();
    }

    onEditBoxChange() {
        if(this._selectNode) {
            let item = this._selectNode.getComponent(ScrollViewItem)
            let config:ISpawnerItem = {
                showTime:parseInt(this.EditBox_time.string.trim()),
                monsterID:parseInt(this.Label_monster_id.string.trim()),
            }
            item.loadConfig(config);
            let index = this.scrollView.content.children.findIndex(v=>v==this._selectNode);
            this.spawnerItems[index] = config;
            // game.edit.changeSpawnerConfig(index,config);
        }
    }

    async onClickMonsterSelect() {
        if(this._selectNode) {
            let mosterEdit = (await gameFunc.showMonsterEdit()) as MosterEdit;
            uiFunc.asyncAssert(this);
            mosterEdit.selectClickListener = (index:number,data: IMonster)=>{
                if(this._selectNode) {
                    this.Label_monster_id.string = data.mosterID.toString();
                    this.onEditBoxChange();
                }
            }
        }
    }
    
    onDestroy(): void {
        this.scrollViewItemPool.destroy();
        this.scrollViewItem.destroy();
    }
}


class ScrollViewItem extends Component {
    bg:Sprite;
    data:ISpawnerItem;
    prefabNode:Node;
    Label_time:Label;
    monster:Monster;
    deleteClickListener:Function;
    selectClickListener:Function;

    protected onLoad(): void {
        this.bg = this.node.getComponent(Sprite);
        this.prefabNode = this.node.getChildByName("Node_prefab")
        this.Label_time = this.node.getChildByName("Label_time").getComponent(Label);
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

    loadConfig(data:ISpawnerItem) {
        let {showTime,monsterID} = this.data = data;
        this.Label_time.string = showTime.toString();
        if(this.monster) {
            game.edit.freeMonster(this.monster);
            this.monster.node.parent = null;
        }
        let monster = game.edit.allocMonster(monsterID);
        monster.node.parent = this.prefabNode;
        monster.node.position = Vec3.ZERO;
        this.monster = monster;
    }

    onDestroy() {
        // 这里不回收 原因是 触发 destroy 的时候 node 已经被释放了
        // if(this.monsterNode) {
        //     game.edit.freeMonster(this.monsterNode);
        //     this.monsterNode.parent = null;
        // }
    }
}

