import { DEV } from "cc/env";
import { _decorator, Node } from 'cc';

export enum DEBUG {
    none,
    error,
    warn,
    info,
    debug,
}
export const DEBUG_LEVEL = DEV ? DEBUG.debug : DEBUG.none;

export class Log {
    /**普通日志输出 */
    public static printDebug(...data: any[]): void {
        if (DEBUG_LEVEL >= DEBUG.debug) {
            Log.dealData(console.debug, ...data);
        }
    }
    /**普通日志输出 */
    public static print(...data: any[]): void {
        if (DEBUG_LEVEL >= DEBUG.info) {
            Log.dealData(console.log, ...data);
        }
    }
    /**警告日志输出 */
    public static printWarn(...data: any[]): void {
        if (DEBUG_LEVEL >= DEBUG.warn) {
            Log.dealData(console.warn, ...data);
        }
    }
    /**错误日志输出 */
    public static printError(...data: any[]): void {
        if (DEBUG_LEVEL >= DEBUG.error) {
            Log.dealData(console.error, ...data);
        }
    }
    /**获取堆栈 */
    public static getStack() {
        return new Error();
    }
    /**处理数据 */
    public static dealData(callback: Function, ...data: any[]): any {
        return callback(...data);
    }
}

export const log = Log