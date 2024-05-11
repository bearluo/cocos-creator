import { Vec3 } from "cc"
import { IWayPathAnchors } from "./SceneConfig"

interface IEdit {
    showOperatorPanel(name:string),
    saveWayPathAnchors(wayPathAnchors: IWayPathAnchors[]),
    loadConfig(),
    saveConfig(),
}

interface IGame {
    edit?:IEdit,
}

export const game:IGame = {}

export class gameFunc {
    static gotoEditMain() {
        game.edit.showOperatorPanel("Node_EditMain")
    }
    
    static gotoWayPointEdit() {
        game.edit.showOperatorPanel("Node_WayPointEdit")
    }

    static loadConfig() {
        game.edit.loadConfig()
    }

    static saveConfig() {
        game.edit.saveConfig()
    }
}