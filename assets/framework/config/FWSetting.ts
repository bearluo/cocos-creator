import { EventTarget, math, _decorator } from 'cc';
import { PlayerPreference, PlayerPreferenceKey } from './FWPlayerPreference';
import { Events } from '../events/FWEvents';
const { ccclass, property } = _decorator;

export class SettingKey extends PlayerPreferenceKey {
    static readonly BGM_VOLUME = "BGM_VOLUME";
    static readonly SFX_VOLUME = "SFX_VOLUME";
}
/**
 * 配置
 */
@ccclass('Setting')
export class Setting extends EventTarget {

    private static _instance: Setting = new Setting();
    static get instance(): Setting {
        return this._instance;
    }

    /**
     * 背景音量
     */
    private _bgmVolume: number = 1.0;

    set bgmVolume(value: number) {
        this._bgmVolume = math.clamp01(value);
        PlayerPreference.setFloat(SettingKey.BGM_VOLUME, value);
        this.emit(Events.onBgmVolumeChanged, this._bgmVolume);
    }

    get bgmVolume(): number {
        return this._bgmVolume;
    }

    /**
     * 音效音量
     */
    private _sfxVolume: number = 1.0;

    set sfxVolume(value: number) {
        this._sfxVolume = math.clamp01(value);
        PlayerPreference.setFloat(SettingKey.SFX_VOLUME, value);
    }

    get sfxVolume(): number {
        return this._sfxVolume;
    }

    load() {
        this._bgmVolume = PlayerPreference.getFloat(SettingKey.BGM_VOLUME);
        if (isNaN(this._bgmVolume)) {
            this._bgmVolume = 1.0;
        }
        this._sfxVolume = PlayerPreference.getFloat(SettingKey.SFX_VOLUME);
        if (isNaN(this._sfxVolume)) {
            this._sfxVolume = 1.0;
        }
    }
}
