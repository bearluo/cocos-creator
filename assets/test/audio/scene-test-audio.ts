import { _decorator, AudioClip, Component, Node, Slider } from 'cc';
import { Setting } from '../../framework/config/FWSetting';
const { ccclass, property } = _decorator;

@ccclass('scene_test_audio')
export class scene_test_audio extends Component {
    @property(AudioClip)
    audioClip: AudioClip;
    @property(AudioClip)
    audioClipBg: AudioClip;


    start() {
        app.manager.audio.initSfx(this.audioClip);
    }

    update(deltaTime: number) {

    }

    onClick() {
        console.log("onClick");
        app.manager.audio.playSfx(this.audioClip);
    }

    onClickBgm() {
        console.log("onClickBgm");
        app.manager.audio.playBgm(this.audioClipBg);
    }

    onClickStopBgm() {
        console.log("onClickStopBgm");
        app.manager.audio.stopBgm();
    }

    onVolumeChanged(target:Slider) {
        console.log(target.progress);
        Setting.instance.bgmVolume = target.progress;
    }
}


