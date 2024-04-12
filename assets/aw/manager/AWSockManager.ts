import { _decorator, assert, AudioClip, AudioSource, BlockInputEvents, color, Component, director, EventTouch, log, math, Node, Pool, RenderRoot2D, Sprite, SpriteFrame, UITransform, Widget } from 'cc';
import { FWBaseManager } from '../../framework/manager/FWBaseManager';
import { httpConfig, server_config, socket_config } from '../config/HttpConfig';
import { Root_cmd } from '../config/NetConfig';
import { RootInetMsg } from '../network/RootInetMsg';
import { AwBufNetNode } from '../network/NetNode';
import { AwBufWebSock } from '../network/WebSock';
import { AwBufProtocol } from '../network/Protocol';
import { NetManager } from '../../framework/network/NetManager';
import { INetworkTips, NetData } from '../../framework/network/NetInterface';
import { Log } from '../../framework/common/FWLog';
import { NetConnectOptions } from '../../framework/network/NetNode';
import { FWManager } from '../../framework/manager/FWManager';
import { FWAssetManager } from '../../framework/manager/FWAssetManager';

const { ccclass, property } = _decorator;
export enum NetType {
    main,
}

class NetTips implements INetworkTips {
    connectTips(isShow: boolean): void {
        // if (isValid(app, true)) {
        //     app.popup.closeLoading();
        //     if (isShow) {
        //         app.popup.showLoading({ text: "connecting to server..." });
        //     }
        // }
    }
    reconnectTips(isShow: boolean): void {
        // if (isValid(app, true)) {
        //     app.popup.closeLoading();
        //     if (isShow) {
        //         app.popup.showLoading({ text: "reconnecting" });
        //     }
        // }
    }
}

@ccclass('AWSockManager')
export class AWSockManager extends FWBaseManager {
    serverData: server_config;
    rootInetMsg: Map<Root_cmd, RootInetMsg>;
    socketData: socket_config;

    __preload() {
        let node = new AwBufNetNode();
        node.init(new AwBufWebSock(), new AwBufProtocol(), new NetTips());
        NetManager.getInstance().setNetNode(node, NetType.main);

        this.rootInetMsg = new Map();
        this.rootInetMsg.set(Root_cmd.CMDROOT_GATEWAY_MSG, new RootInetMsg(node,Root_cmd.CMDROOT_GATEWAY_MSG))
        this.rootInetMsg.set(Root_cmd.CMDROOT_LOGIN_MSG, new RootInetMsg(node,Root_cmd.CMDROOT_LOGIN_MSG))
        this.rootInetMsg.set(Root_cmd.CMDROOT_PLAZA_MSG, new RootInetMsg(node,Root_cmd.CMDROOT_PLAZA_MSG))
        this.rootInetMsg.set(Root_cmd.CMDROOT_GAMESERVER_MSG, new RootInetMsg(node,Root_cmd.CMDROOT_GAMESERVER_MSG))
        this.rootInetMsg.set(Root_cmd.CMDROOT_WEB_MSG, new RootInetMsg(node,Root_cmd.CMDROOT_WEB_MSG))
    }

    public getRootInetMsg(nCmdRootID: number) {
        return this.rootInetMsg.get(nCmdRootID);
    }

    public initServerConfig(serverData: server_config) {
        httpConfig.setUrl(this.serverData = serverData);
        this.setSocketConfig(serverData);
    }

    public setSocketConfig(socketData: socket_config) {
        this.socketData = {
            url_login: socketData.url_login,
            port_min: socketData.port_min,
            port_max: socketData.port_max,
        }
    }

    public connect() {
        if (!this.socketData) {
            Log.printWarn(`socketData is null`);
            return;
        }
        let options: NetConnectOptions = {
            //地址
            host: this.socketData.url_login,
            //端口
            port: math.randomRangeInt(this.socketData.port_min, this.socketData.port_max + 1),
            //-1 永久重连，0不自动重连，其他正整数为自动重试次数
            autoReconnect: 5,
        }
        NetManager.getInstance().connect(options, NetType.main);
    }

    public send(buf: NetData) {
        NetManager.getInstance().send(buf, NetType.main);
    }

    public disconnect(needReconnect = false) {
        NetManager.getInstance().close(NetType.main, needReconnect);
    }

    public isWorking() {
        return NetManager.getInstance().getNetNode(NetType.main).isWorking();
    }

    public get main() {
        return NetManager.getInstance().getNetNode(NetType.main);
    }
}

FWManager.register("socket",new AWSockManager())

declare global {
    namespace globalThis {
        interface IFWManager {
            socket : AWSockManager
        }
    }
}