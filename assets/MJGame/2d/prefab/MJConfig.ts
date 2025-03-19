import { IVec2Like, IVec3Like, IVec4Like } from "cc";
import { TileMode } from "../../core/Tile";

interface TilePos {
    pos?:IVec2Like[]|IVec2Like,
    rotation?:IVec4Like[]|IVec4Like,
    scale?:IVec2Like[]|IVec2Like,

    b_pos?:IVec2Like[]|IVec2Like,
    b_rotation?:IVec4Like[]|IVec4Like,
    b_scale?:IVec2Like[]|IVec2Like,
    
}

/**
 * {@link TileMode.IDLE}
 */
const IDLE:TilePos = {
    pos:{x:0,y:-6.255},
};
/**
 * {@link TileMode.BOTTOM_HAND}
 */
const BOTTOM_HAND:TilePos = {
    pos:{x:0,y:-6.255},
};
/**
 * {@link TileMode.LEFT_HAND}
 */
const LEFT_HAND:TilePos = {
    b_scale:{x:0.6,y:0.6},
};
/**
 * {@link TileMode.RIGHT_HAND}
 */
const RIGHT_HAND:TilePos = {
    b_scale:{x:0.6,y:0.6},
};
/**
 * {@link TileMode.TOP_HAND}
 */
const TOP_HAND:TilePos = {
    b_scale:{x:0.6,y:0.6},
};
/**
 * {@link TileMode.BOTTOM_QP}
 */
const BOTTOM_QP: TilePos = {
    pos:{x:0,y:4.745},
    scale:{x:0.7,y:0.7},
    b_scale:{x:0.4,y:0.4},
};

/**
 * {@link TileMode.BOTTOM_CPG_Z}
 */
const BOTTOM_CPG_Z:TilePos = {
    pos:{x:0,y:4.745},
    scale:{x:0.7,y:0.7},
    b_scale:{x:0.4,y:0.4},
};
/**
 * {@link TileMode.BOTTOM_CPG_B}
 */
const BOTTOM_CPG_B:TilePos = {
    b_scale:{x:0.4,y:0.4},
};

/**
 * {@link TileMode.TOP_QP}
 */
const TOP_QP: TilePos = {
    pos:{x:0,y:4.745},
    scale:{x:0.7,y:0.7},
    b_scale:{x:0.4,y:0.4},
};

/**
 * {@link TileMode.TOP_CPG_Z}
 */
const TOP_CPG_Z: TilePos = {
    pos:{x:0,y:4.745},
    scale:{x:0.7,y:0.7},
    b_scale:{x:0.4,y:0.4},
};

/**
 * {@link TileMode.TOP_CPG_B}
 */
const TOP_CPG_B: TilePos = {
    b_scale:{x:0.4,y:0.4},
};

/**
 * {@link TileMode.LEFT_QP}
 */
const LEFT_QP: TilePos = {
    pos:{x:-3.954,y:0.745},
    rotation:{"x": 0,"y": 0,"z": -0.7071067811865475,"w": 0.7071067811865476},
    scale:{x:0.64,y:0.64},
    b_scale:{x:0.4,y:0.4},
};

/**
 * {@link TileMode.LEFT_CPG_Z}
 */
const LEFT_CPG_Z: TilePos = {
    pos:{x:-3.954,y:0.745},
    rotation:{"x": 0,"y": 0,"z": -0.7071067811865475,"w": 0.7071067811865476},
    scale:{x:0.64,y:0.64},
    b_scale:{x:0.4,y:0.4},
};

/**
 * {@link TileMode.LEFT_CPG_B}
 */
const LEFT_CPG_B: TilePos = {
    b_scale:{x:0.4,y:0.4},
};


/**
 * {@link TileMode.RIGHT_QP}
 */
const RIGHT_QP: TilePos = {
    pos:{x:3,y:0.745},
    rotation:{"x": 0,"y": 0,"z": 0.7071067811865475,"w": 0.7071067811865476},
    scale:{x:0.64,y:0.64},
    b_scale:{x:0.4,y:0.4},
};

/**
 * {@link TileMode.RIGHT_CPG_Z}
 */
const RIGHT_CPG_Z: TilePos = {
    pos:{x:3,y:0.745},
    rotation:{"x": 0,"y": 0,"z": 0.7071067811865475,"w": 0.7071067811865476},
    scale:{x:0.64,y:0.64},
    b_scale:{x:0.4,y:0.4},
};;

/**
 * {@link TileMode.RIGHT_CPG_B}
 */
const RIGHT_CPG_B: TilePos = {
    b_scale:{x:0.4,y:0.4},
};

/**
 * Tile 内部 icon 的各个模式的属性
 * {@link TileMode}
 */
export const TileConfig:TilePos[] = [
    IDLE,
    BOTTOM_HAND,
    LEFT_HAND,
    RIGHT_HAND,
    TOP_HAND,

    BOTTOM_QP,
    BOTTOM_CPG_Z,
    BOTTOM_CPG_B,
    
    TOP_QP,
    TOP_CPG_Z,
    TOP_CPG_B,
    
    LEFT_QP,
    LEFT_CPG_Z,
    LEFT_CPG_B,
    
    RIGHT_QP,
    RIGHT_CPG_Z,
    RIGHT_CPG_B,
]


/**
 * 弃牌堆 [0,21]
 * */ 

export const Config = {
    /**
     * 牌背景图配置
     * 下标 index 参考{@link TileMode}
     */
    BG : [
        "majiang_7", // 空闲
        // 手牌
        "majiang_7", // 下家的牌
        "majiang_3", // 左家的牌
        "majiang_2",// 上家的牌
        "majiang_4",// 右家的牌

        // 下家
        "majiang_5", // 弃牌堆
        "majiang_5",// 吃碰杠 正面
        "majiang_1",// 吃碰杠 背面

        // 上家
        "majiang_5", // 弃牌堆
        "majiang_5",// 吃碰杠 正面
        "majiang_1",// 吃碰杠 背面
        
        //左家
        "majiang_6", // 弃牌堆
        "majiang_6",// 吃碰杠 正面
        "majiang_8",// 吃碰杠 背面

        //右家
        "majiang_9", // 弃牌堆
        "majiang_9",// 吃碰杠 正面
        "majiang_10",// 吃碰杠 背面
    ],
    /**
     * 牌icon
     * 下标 index 参考{@link TileType}
     */
    icon : [
        "my_hand_1_0x0%d",
        "my_hand_1_0x2%d",
        "my_hand_1_0x1%d",
        "my_hand_1_0x3%d",
        "my_hand_1_0x4%d",
    ]
}

