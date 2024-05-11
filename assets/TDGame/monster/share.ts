import { _decorator, ccenum, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum monster_id {
    default = 0,
    a,
    b,
    c
}
ccenum(monster_id)
