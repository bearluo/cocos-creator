import { _decorator, Component, IVec2Like, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

interface TablePos {
    discardPilePos?:IVec2Like[],
}

export const TablePosConfig:TablePos[] = [
    {
        "discardPilePos": [
            { "x": -150, "y": -39 },
            { "x": -106.12099999999998, "y": -39 },
            { "x": -62.24199999999996, "y": -39 },
            { "x": -18.361999999999966, "y": -39 },
            { "x": 25.609000000000037, "y": -39 },
            { "x": 70.731, "y": -39 },
            { "x": -152.623, "y": -83.88099999999997 },
            { "x": -107.87, "y": -84.13499999999999 },
            { "x": -62.24199999999996, "y": -84.13499999999999 },
            { "x": -17.488000000000056, "y": -84.13499999999999 },
            { "x": 28.139999999999986, "y": -84.13499999999999 },
            { "x": 73.76800000000003, "y": -84.13499999999999 },
            { "x": -157.82999999999998, "y": -132.068 },
            { "x": -110.928, "y": -132.068 },
            { "x": -64.02599999999995, "y": -132.068 },
            { "x": -17.124000000000024, "y": -132.068 },
            { "x": 29.77800000000002, "y": -132.068 },
            { "x": 76.67999999999995, "y": -132.068 },
            { "x": 123.34699999999998, "y": -130.848 },
            { "x": 170.24900000000002, "y": -130.848 },
            { "x": 215.086, "y": -130.848 },
            { "x": 261.556, "y": -130.848 }
        ]
    },
    {
        discardPilePos : [
            new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),
            new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),
            new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),
        ],
    },
    {
        discardPilePos : [
            new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),
            new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),
            new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),
        ],
    },
    {
        discardPilePos : [
            new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),
            new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),
            new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),new Vec2(),
        ],
    },
]