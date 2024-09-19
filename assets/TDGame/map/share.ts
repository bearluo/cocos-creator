import { _decorator, ccenum, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum map_id {
    map1 = 0,
    Max
}
ccenum(map_id)

export const MapConfig:string[] = new Array(map_id.Max);
MapConfig[map_id.map1] = "map/map1/map1";

export const MapBundleName = "TDGame"