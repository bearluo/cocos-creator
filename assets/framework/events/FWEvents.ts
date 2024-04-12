import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 全局事件定义
 */
@ccclass('Events')
export class Events {
    /**
     * uiRoot节点发生变化
     */
    static onUIRootChanged: string = "onUIRootChanged";
    /**
     * 设置面板的背景音乐音量变化
     */
    static onBgmVolumeChanged: string = "onBgmVolumeChanged";

    
    /**
     * 子包卸载
     */
    static onBundleRlease: string = "onBundleRlease";

    /**
     * 触摸界面开始
     */
    static onGameTouchStart: string = "onGameTouchStart";

    /**
     * manger init 结束
     */
    static MANAGER_INIT_END = "MANAGER_INIT_END";


    /**
     * 弹窗显示
     */
    static DIALOG_SHOW = "DIALOG_SHOW";
    /**
     * 弹窗隐藏
     */
    static DIALOG_HIDE = "DIALOG_HIDE";
    /**
     * 弹窗销毁
     */
    static DIALOG_DESTROY = "DIALOG_DESTROY";
    /**
     * 弹窗点击关闭
     */
    static DIALOG_CLICK_CLOSE = "DIALOG_CLICK_CLOSE";

    /**
     * 场景加载开始
     */
    static SCENE_LOADING_START = "SCENE_LOADING_START";
    /**
     * 场景预加载资源开始
     */
    static SCENE_LOADING_PRELOAD_ASSET_START = "SCENE_LOADING_PRELOAD_ASSET_START";
    /**
     * 场景预加载资源结束
     */
    static SCENE_LOADING_PRELOAD_ASSET_END = "SCENE_LOADING_PRELOAD_ASSET_END";
    /**
     * 场景加载结束
     */
    static SCENE_LOADING_END = "SCENE_LOADING_END";
}

