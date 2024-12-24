import { _decorator, Component, EventTarget, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 全局事件定义
 */
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

export class FWEvent<CT> extends EventTarget {
	/** 事件键 */
	key: { [k in keyof CT]: k } = new Proxy(Object.create(null), {
		get: (target, key) => key,
	});
}