import { _decorator, Component, native, Node, sys } from 'cc';
const { ccclass, property } = _decorator;


export class PlayerPreferenceKey {
}
/**
 * 用户数据类
 */
@ccclass('PlayerPreference')
export class PlayerPreference {
    static playerPreferenceKey = '_pp_';

    /**
     * 保存浮点数
     * @param key 
     * @param number 
     */
    static setFloat(key: string, number: number) {
        PlayerPreference.setItem(key, number.toString());
    }

    /**
     * 读取浮点数
     * @param key 
     * @returns 
     */
    static getFloat(key: string): number {
        let n = PlayerPreference.getItem(key);
        return Number.parseFloat(n);
    }

    static setInt(key: string, number: number) {
        PlayerPreference.setItem(key, number.toString());
    }
    
    static getInt(key: string) {
        let n = PlayerPreference.getItem(key);
        return Number.parseInt(n);
    }

    static setString(key: string, value: string) {
        PlayerPreference.setItem(key, value);
    }

    static getString(key: string) {
        return PlayerPreference.getItem(key);
    }


    private static setItem(key: string, value: string) {
        sys.localStorage.setItem(PlayerPreference.playerPreferenceKey + key, value);
    }

    private static getItem(key: string) {
        return sys.localStorage.getItem(PlayerPreference.playerPreferenceKey + key);
    }
}
