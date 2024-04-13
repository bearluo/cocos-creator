import { _decorator, assert, Asset, Component, Constructor, EventTouch, Node, Prefab, tween, Vec3 } from 'cc';
import { func } from '../common/FWFunction';
import { Events } from '../events/FWEvents';
import { FWUIDialog } from './FWUIDialog';
const { ccclass, property } = _decorator;

interface AssetInfo {
    bundleName:string,
    path:string,
}

@ccclass('FWUIDialogLoading')
export class FWUIDialogLoading extends FWUIDialog {
    async loadPrefab(assetInfo:AssetInfo) {
        let {bundleName,path} = assetInfo
        let bundle = await app.manager.asset.loadBundle({
            name:bundleName
        });
        assert(bundle,`${bundleName} load fail`);
        let prefab = await bundle.load({
            paths:path,
            assetType:Prefab,
        }) as Prefab;
        return prefab;
    }
}