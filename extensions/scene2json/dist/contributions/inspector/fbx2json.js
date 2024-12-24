'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ready = exports.update = exports.$ = exports.template = void 0;
const file_utils_1 = require("../../utils/file-utils");
exports.template = `
<!-- 帮忙提交数据的元素 -->
<ui-prop type="dump" class="test"></ui-prop>
<!-- 实际渲染的元素 -->
<ui-button class="export-button">导出json</ui-button>
<ui-button class="export-2dx-button">导出2dx json</ui-button>
`;
exports.$ = {
    exportButton: '.export-button',
    export2dxButton: '.export-2dx-button',
};
function update(dump) {
    console.log(this);
    // 缓存 dump 数据，请挂在 this 上，否则多开的时候可能出现问题
    this.dump = dump;
}
exports.update = update;
function ready() {
    this.$.exportButton.addEventListener('confirm', async () => {
        let nodeData = {};
        await dfsNode(Editor.Selection.getSelected("node")[0], nodeData);
        let jsonStr = JSON.stringify(nodeData);
        console.log(jsonStr);
        save(jsonStr);
    });
    this.$.export2dxButton.addEventListener('confirm', async () => {
        let nodeData = {};
        await dfsNode(Editor.Selection.getSelected("node")[0], nodeData);
        fix2dxRotation(nodeData);
        let jsonStr = JSON.stringify(nodeData);
        console.log(jsonStr);
        save(jsonStr);
    });
}
exports.ready = ready;
async function save(saveStr) {
    const result = await Editor.Dialog.save({
        path: Editor.Project.path,
        title: 'Save Data',
        filters: [
            { name: 'txt', extensions: ['json', "txt"] },
            { name: 'All Files', extensions: ['*'] },
        ],
    });
    if (!result.filePath) {
        return;
    }
    (0, file_utils_1.writeFile)(result.filePath, saveStr);
}
function fix2dxRotation(nodeData) {
    let { x, y, z } = nodeData.rotation;
    nodeData.rotation = eulerYZXtoZYX(y, z, x);
    // 2dx z轴旋转方向是反的
    nodeData.rotation.z = -nodeData.rotation.z;
    let children = nodeData.children;
    for (let index = 0; index < children.length; index++) {
        const element = children[index];
        fix2dxRotation(element);
    }
}
async function dfsNode(uuid, nodeData) {
    // console.log("dfsNode",uuid)
    const info = await Editor.Message.request('scene', 'query-node', uuid);
    nodeData.position = info.position.value;
    nodeData.rotation = info.rotation.value;
    nodeData.scale = info.scale.value;
    nodeData.visible = info.active.value;
    nodeData.name = info.name.value;
    nodeData.children = [];
    //获取3d 组建
    // const comps_index_n = info.__comps__.findIndex((v)=>v.type == "cc.MeshRenderer");
    // if (comps_index_n != -1) {
    //     const comp_info = info.__comps__[comps_index_n];
    //     const asset_info:AssetInfo = await Editor.Message.request('asset-db', 'query-asset-info', comp_info.value.mesh.value.uuid);
    //     // console.log("dfsNode",asset_info);
    //     nodeData.mesh_url = asset_info.url;
    // }
    // 预设
    const asset_info = await Editor.Message.request('asset-db', 'query-asset-info', info.__prefab__.uuid);
    if (asset_info.url.toUpperCase().indexOf(".FBX") != -1) {
        nodeData.fbx_url = asset_info.url;
        // console.log("dfsNode",nodeData.fbx_url);
    }
    else {
        //遍历子节点
        let children = info.children;
        for (let index = 0; index < children.length; index++) {
            const element = children[index];
            let nData = {};
            nodeData.children[index] = nData;
            await dfsNode(element.value.uuid, nData);
        }
    }
}
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
}
// 输入角度为弧度制
const cos = Math.cos;
const sin = Math.sin;
function eulerYZXtoZYX(y, z, x) {
    x = degreesToRadians(x);
    y = degreesToRadians(y);
    z = degreesToRadians(z);
    // 计算半角
    const halfX = x / 2;
    const halfY = y / 2;
    const halfZ = z / 2;
    const cx = cos(halfX);
    const sx = sin(halfX);
    const cy = cos(halfY);
    const sy = sin(halfY);
    const cz = cos(halfZ);
    const sz = sin(halfZ);
    // 四元数计算
    const qx = sx * cy * cz + cx * sy * sz;
    const qy = cx * sy * cz + sx * cy * sz;
    const qz = cx * cy * sz - sx * sy * cz;
    const qw = cx * cy * cz - sx * sy * sz;
    // 将四元数转换回 ZYX 欧拉角
    const zyx = {};
    // 计算 ZYX 欧拉角
    const test = 2 * (qw * qy - qz * qx);
    if (Math.abs(test) < 0.99999) {
        zyx.z = radiansToDegrees(Math.atan2(2 * (qw * qz + qx * qy), 1 - 2 * (qy * qy + qz * qz)));
        zyx.y = radiansToDegrees(Math.asin(test));
        zyx.x = radiansToDegrees(Math.atan2(2 * (qw * qx + qy * qz), 1 - 2 * (qx * qx + qy * qy)));
    }
    else {
        // 极值情况：Gimbal Lock
        zyx.z = radiansToDegrees(Math.atan2(-2 * (qw * qz - qx * qy), 1 - 2 * (qx * qx + qz * qz)));
        zyx.y = radiansToDegrees(test > 0 ? Math.PI / 2 : -Math.PI / 2);
        zyx.x = radiansToDegrees(0);
    }
    // 返回的 ZYX 欧拉角
    return zyx;
}
