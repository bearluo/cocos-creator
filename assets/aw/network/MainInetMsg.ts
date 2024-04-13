import { Root_cmd } from "../config/NetConfig";
import { BindInetMsg } from "./BindInetMsg";

export class MainInetMsg<T=any> extends BindInetMsg<T> {

    initCmd(nRootID: number, nMainID: number) {
        super.initCmd(nRootID, nMainID);
        this.bindMsgListener();
        this.initRegister();
    }

    //绑定 mainID 监听
    private bindMsgListener() {
        this.rootInetMsg = app.manager.socket.getRootInetMsg(this.nRootID);
        this.rootInetMsg.bindMsgListener(this.nMainID, this.OnRecvData.bind(this))
    }

    initRegister() {

    }
}

export class GatewayMainInetMsg<T=any> extends MainInetMsg<T> {
    initMainID(nMainID: number) {
        this.initCmd(Root_cmd.CMDROOT_GATEWAY_MSG, nMainID);
    }
}
export class LoginMainInetMsg<T=any> extends MainInetMsg<T> {
    initMainID(nMainID: number) {
        this.initCmd(Root_cmd.CMDROOT_LOGIN_MSG, nMainID);
    }
}
export abstract class PlazeMainInetMsg<T=any> extends MainInetMsg<T> {
    initMainID(nMainID: number) {
        this.initCmd(Root_cmd.CMDROOT_PLAZA_MSG, nMainID);
    }
    // TODO
    // protected initEvents(): boolean | void {
    //     super.initEvents()
    //     this.bindEvent({
    //         eventName:EVENT_ID.EVENT_CLEAN_USER_DATA,
    //         callback:this.cleanUserData.bind(this)
    //     })
    // }

    abstract cleanUserData():void;
}
export class GameServerMainInetMsg<T=any> extends MainInetMsg<T> {
    initMainID(nMainID: number) {
        this.initCmd(Root_cmd.CMDROOT_GAMESERVER_MSG, nMainID);
    }
}
export class WebMainInetMsg<T=any> extends MainInetMsg<T> {
    initMainID(nMainID: number) {
        this.initCmd(Root_cmd.CMDROOT_WEB_MSG, nMainID);
    }
}
