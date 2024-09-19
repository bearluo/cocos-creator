import { Vec3 } from "cc";

export interface IWayPathAnchors {
    name:string,
    anchors:Vec3[],
    clone():IWayPathAnchors,
    serialize():IWayPathAnchorsJson,
}

export interface IWayPathAnchorsJson {
    name:string,
    anchors:number[],
}

export interface ISpawnerItem {
    showTime:number,
    monsterID:number,
}
export interface ISpawner {
    name:string,// 名称
    pathName:string,// 路径名称
    queue:ISpawnerItem[],// 怪物队列
}

export interface IMonster {
    mosterID:number;
    maxCache:number;
}

export interface IMap {
    path?:string;// Prefab地图路径
}

export interface ISceneConfig {
    wayPathAnchors: IWayPathAnchors[];
    spawner:ISpawner[];
    monster:IMonster[];
    map:IMap;
}


export interface ISceneConfigJson {
    wayPathAnchors: IWayPathAnchorsJson[];
    spawner: ISpawner[];
    monster:IMonster[];
    map:IMap;
}

export class WayPathAnchors {
    declare name:string;
    declare anchors:Vec3[];
    constructor(name:string= "unknow",anchors:Vec3[]=[]) {
        this.name = name;
        this.anchors = anchors;
    }

    serialize():IWayPathAnchorsJson {
        let array:number[] = [];
        this.anchors.map((v2,i)=>Vec3.toArray(array,v2,i*3));
        return {
            name: this.name,
            anchors: array,
        };
    }

    static deserialize(jsonObj: IWayPathAnchorsJson):IWayPathAnchors {
        let obj = new WayPathAnchors();
        obj.name = jsonObj.name;
        let array:Vec3[] = obj.anchors = [];
        let anchors = jsonObj.anchors
        for(let i=0;i<anchors.length;i+=3){
            array.push(Vec3.fromArray(new Vec3(),anchors,i));
        }
        return obj
    }

    clone() {
        let cloneObj = new WayPathAnchors();
        cloneObj.name = this.name;
        cloneObj.anchors = this.anchors.map(v=>v.clone());
        return cloneObj;
    }
}