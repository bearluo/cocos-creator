import { isValid } from "cc";
import { GS_HeadNull_Size, S_GS_HeadNull } from "../config/NetConfig";
import { IProtocolHelper } from "../../framework/network/NetInterface";

export class AwBufProtocol implements IProtocolHelper {

    declare static hearbeat:()=>ArrayBuffer;

    getHeadlen(): number {
        return GS_HeadNull_Size;
    }

    getHearbeat(): ArrayBuffer {
        return AwBufProtocol.hearbeat?.()
    }

    checkPackage(buffer: ArrayBuffer): boolean {
        return buffer.byteLength > GS_HeadNull_Size;
    }

    getPackageId(buffer: ArrayBuffer): number {
        S_GS_HeadNull.initArrayBuffer(buffer);
        return S_GS_HeadNull.RootID;
    }
}