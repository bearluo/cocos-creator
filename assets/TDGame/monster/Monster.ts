import { _decorator, CCInteger, Component, Node } from 'cc';
import { monster_id } from './share';
const { ccclass, property,type } = _decorator;

@ccclass('Monster')
export class Monster extends Component {
    @type(monster_id)
    moster_id:monster_id = 0;
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


