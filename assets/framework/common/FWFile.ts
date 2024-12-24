import { _decorator, Component, native, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

import CryptoES from 'crypto-es';
import { log } from './FWLog';
import { constant } from './FWConstant';

@ccclass('FWFile')
export class FWFile {
    static fileKey = '_file_';

    static encrypt(string: string) {
        return CryptoES.AES.encrypt(string, constant.encrypt_key).toString(CryptoES.enc.Utf8);
    }

    static decrypt(string: string) {
        return CryptoES.AES.decrypt(string, constant.encrypt_key).toString(CryptoES.enc.Utf8);
    }

    static writeStringToFile(path:string,data: string) {
        return FWFile.writeFile(path,data);
    }

    static getStringToFile(path:string) {
        return FWFile.readFile(path) as string;
    }

    private static setItem(key: string, value: string) {
        sys.localStorage.setItem(FWFile.fileKey + key, value);
    }

    private static getItem(key: string) {
        return sys.localStorage.getItem(FWFile.fileKey + key);
    }

    /**获取路径 */
    private static getFilePathDir(filePath: string): string {
        return filePath.replace(filePath.match(/[^\\/]+\.?[^.\\/]+$/)[0], ``);
    }

    static writeFile(path: string, data: string | ArrayBuffer) {
        if(sys.isNative) {
            let finalPath = native.fileUtils.getWritablePath() + path;
            let fileDir = FWFile.getFilePathDir(finalPath);
            if (!native.fileUtils.isDirectoryExist(fileDir) && !native.fileUtils.createDirectory(fileDir)) {
                log.print(`writeDataToFile error createDirectory fileDir : `, fileDir);
                return false;
            }
            if (data instanceof ArrayBuffer) {
                native.fileUtils.writeDataToFile(data, finalPath);
            }else {
                native.fileUtils.writeStringToFile(data, finalPath);
            }
        } else {
            if (data instanceof ArrayBuffer) {
                FWFile.setItem(path,CryptoES.enc.Base64.stringify(CryptoES.lib.WordArray.create(data)));
            }else {
                FWFile.setItem(path,data);
            }
        }
        return true;
    }

    static readFile(path: string, bByte=false) {
        if(sys.isNative) {
            if (bByte) {
                return native.fileUtils.getDataFromFile(path);
            }else {
                return native.fileUtils.getStringFromFile(path);
            }
        } else {
            if (bByte) {
                return new Uint8Array(CryptoES.enc.Base64.parse(FWFile.getItem(path)).words).buffer;
            }else {
                return FWFile.getItem(path);
            }
        }
    }
    /**
     * 浏览器存储
     * @param data 
     */
    static async save(data:string,fileName?:string) {
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        // Create a download link
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    }

    static async read() {
        // @ts-ignore
        const fileHandle = await window.showOpenFilePicker();
        const file = await fileHandle[0].getFile() as File;
        return await new Promise((resolve: (value: string) => void, reject: (reason?: any) => void)=>{
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result.toString());
            };
            reader.readAsText(file);
        })
    }
}
