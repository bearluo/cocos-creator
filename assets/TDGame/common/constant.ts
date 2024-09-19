import { Node } from "cc"
import { IMonster, ISpawner, IWayPathAnchors } from "./SceneConfig"
import { FWUIDialog } from "../../framework/ui/FWUIDialog"
import { Monster } from "../monster/Monster"

interface IEdit {
    showOperatorPanel(name:string,data?:any),
    saveWayPathAnchors(wayPathAnchors: IWayPathAnchors[]),
    loadConfig(),
    saveConfig(),
    
    allocMonster(monster_id:number):Monster,
    freeMonster(monster:Monster),

    deleteMonsterConfig(index:number),
    addMonsterConfig(data:IMonster),
    changeMonsterConfig(index:number,data:IMonster),
    showMonsterEdit():Promise<FWUIDialog>,

    deleteWayPathConfig(index:number),
    addWayPathConfig(data:IWayPathAnchors),
    changeWayPathConfig(index:number,data:IWayPathAnchors),
    showWayPathEdit():Promise<FWUIDialog>,

    deleteSpawnerConfig(index:number),
    addSpawnerConfig(data:ISpawner),
    changeSpawnerConfig(index:number,data:ISpawner),
    showSpawnerEdit():Promise<FWUIDialog>,


    showSpawnerQueueEdit():Promise<FWUIDialog>,
    showMapEdit():Promise<FWUIDialog>,
}

interface IGame {
    edit?:IEdit,
}

export const game:IGame = {}

export class gameFunc {
    static gotoEditMain() {
        game.edit.showOperatorPanel("Node_EditMain")
    }
    
    static gotoWayPointEdit(index:number,wayPathAnchors: IWayPathAnchors) {
        game.edit.showOperatorPanel("Node_WayPointEdit",{
            index:index,
            wayPathAnchors:wayPathAnchors,
        })
    }

    static gotoSpawnerEdit(index:number,spawner: ISpawner) {
        game.edit.showOperatorPanel("Node_SpawnerEdit",{
            index:index,
            spawner:spawner,
        })
    }

    static gotoPreview() {
        game.edit.showOperatorPanel("Node_Preview")
    }

    static loadConfig() {
        game.edit.loadConfig()
    }

    static saveConfig() {
        game.edit.saveConfig()
    }

    static showMonsterEdit() {
        return game.edit.showMonsterEdit();
    }

    static showWayPathEdit() {
        return game.edit.showWayPathEdit();
    }

    static showSpawnerEdit() {
        return game.edit.showSpawnerEdit();
    }

    static showSpawnerQueueEdit() {
        return game.edit.showSpawnerQueueEdit();
    }

    static showMapEdit() {
        return game.edit.showMapEdit();
    }
}