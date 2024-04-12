import { _decorator, AudioClip, AudioSource, Component, director, log, Node, Pool } from 'cc';
import { FWBaseManager } from './FWBaseManager';
import { Events } from '../events/FWEvents';
import { UIRoot } from '../ui/FWUIRoot';
import { Setting } from '../config/FWSetting';
import { FWApplication } from '../FWApplication';
import { FWManager } from './FWManager';
const { ccclass, property } = _decorator;

@ccclass('FWAudioManager')
export class FWAudioManager extends FWBaseManager {
    private _bgmNode: Node;
    private _sfxNode: Node;
    private _bgm: AudioSource;
    private _sfx: Map<AudioClip, AudioSource> = new Map();
    private _sfxPool:Pool<AudioSource>

    __preload(): void {
        this.createAudioNode();
    }


    start() {
        // Application.instance.on(Events.onUIRootChanged, this.onUIRootChanged, this);
        Setting.instance.on(Events.onBgmVolumeChanged, this.onBgmVolumeChanged, this);
    }

    createAudioNode() {
        if(!this._bgmNode) {
            this._bgmNode = new Node("_bgmNode");
            //音乐AudioSource
            this._bgm = this._bgmNode.addComponent(AudioSource);
            this._bgm.loop = true;
        }
        if(!this._sfxNode) {
            this._sfxNode = new Node("_sfxNode");
            this._sfxPool = new Pool(()=>{
                return this._sfxNode.addComponent(AudioSource)
            }, 10, (obj: AudioSource)=>{
                obj.destroy();
            })
        }
        //设置常驻节点
        director.addPersistRootNode(this._bgmNode);
        //设置常驻节点
        director.addPersistRootNode(this._sfxNode);
    }

    onBgmVolumeChanged() {
        if (this._bgm) {
            this._bgm.volume = Setting.instance.bgmVolume;
        }
    }
    /**
     * 播放背景音乐
     * @param clip 
     */
    playBgm(clip: AudioClip) {
        this._bgm.clip = clip;
        this._bgm.play();
        this._bgm.volume = Setting.instance.bgmVolume
    }
    /**
     * 停止背景音乐
     */
    stopBgm() {
        this._bgm.stop();
    }
    /**
     * 播放音效
     * @param clip 
     * @returns 
     */
    playSfx(clip: AudioClip) {
        if (!this._sfx.has(clip)) {
            return;
        }
        let as = this._sfx.get(clip);
        as.volume = Setting.instance.sfxVolume;        
        as.play();
    }
    /**
     * 初始化音效
     * @param clip 
     * @returns 
     */
    initSfx(clip: AudioClip) {
        if (this._sfx.has(clip)) {
            return;
        }
        let as = this._sfxPool.alloc();
        as.clip = clip;
        this._sfx.set(clip,as);
    }

    freeSfx(clip: AudioClip) {
        if (!this._sfx.has(clip)) {
            return;
        }
        let as = this._sfx.get(clip);
        this._sfx.delete(clip);
        this._sfxPool.free(as);
    }

    onDestroy(): void {
        this._sfx.forEach(as=>{
            as.destroy();
        })
        this._sfxPool?.destroy();
    }
}


FWManager.register("audio",new FWAudioManager())

declare global {
    namespace globalThis {
        interface IManager {
            audio : FWAudioManager
        }
    }
}


