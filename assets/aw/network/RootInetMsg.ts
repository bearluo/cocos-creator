import { ByteStream } from "../../framework/network/NetInterface";
import { NetNode } from "../../framework/network/NetNode";
import { MAX_NET_PACKAGE_SIZE, Root_cmd } from "../config/NetConfig";


export class RootInetMsg {
    private _rootID: Root_cmd;
    private _socket:NetNode;
    /** 单线程这里是不是可以用单例 */
    private _readByteStream = new ByteStream();
    private _writeByteStream = new ByteStream();
    private _writeArrayBuffer = new ArrayBuffer(MAX_NET_PACKAGE_SIZE)
    m_mapMainMsgListener: Map<number, any>;
    
    constructor(socket:NetNode,rootID: Root_cmd) {
        this._rootID = rootID;
        this._socket = socket;
        this._socket.addResponeHandler(this._rootID, this.OnRecvDataRoot, this);
        this.m_mapMainMsgListener = new Map();
    }

    bindMsgListener(nMainID, pFun) {
        if (this.m_mapMainMsgListener[nMainID] != null) {
            throw new Error(`${this.constructor.name}:bindMsgListener()`);
        }
        this.m_mapMainMsgListener[nMainID] = pFun
        return true
    }

    OnRecvDataRoot(data: ArrayBuffer) {
        this._readByteStream.setBuffers(data);
        let pByteStream = this._readByteStream;
        let nAddr = pByteStream.readUInt64();
        let RootID = pByteStream.readUInt8();
        let nMainID = pByteStream.readUInt8();

        let pMsgListener = this.m_mapMainMsgListener[nMainID]
        if (pMsgListener == null) {
            // fw.printError(`${this.constructor.name}:OnRecvDataRoot(): warning RootID:${this.nCmdRootID} MainID:${nMainID} didn't bind listener!!!`)
            return
        }
        pMsgListener(pByteStream)
    }

    sendData(buf: ArrayBuffer) {
        return this._socket?.send(buf);
    }

    getSendData(nMainID, func) {
        this._writeByteStream.setBuffers(this._writeArrayBuffer);
        let pSendStream = this._writeByteStream;
        pSendStream.writeSInt64(0);
        pSendStream.writeSInt8(this._rootID);
        pSendStream.writeSInt8(nMainID);
        func(pSendStream)
        return pSendStream.buffers.slice(0, pSendStream.curIndex);
    }

    getSendStream() {
        return this._writeByteStream;
    }

    package(pSendStream: ByteStream, mainID:number) {
        pSendStream.writeSInt64(0);
        pSendStream.writeSInt8(this._rootID);
        pSendStream.writeSInt8(mainID);
    }
}