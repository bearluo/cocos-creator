"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAssetMenu = void 0;
const file_utils_1 = require("./utils/file-utils");
function onAssetMenu(assetsInfo) {
    const list = [
        {
            //名称
            label: `生成scene信息`,
            //点击回调
            async click() {
                if (assetsInfo.isDirectory) {
                    let sceneInfo = [];
                    let path = assetsInfo.file;
                    let length = path.length;
                    let outPath = Editor.Utils.Path.join(path, "sceneInfo") + ".json";
                    let name = Editor.Utils.Path.basenameNoExt(path);
                    console.log(assetsInfo);
                    console.log(outPath);
                    (0, file_utils_1.walkDir)(assetsInfo.file, (filePath, bFile) => {
                        if (bFile) {
                            if (filePath.endsWith(".scene")) {
                                sceneInfo.push([
                                    name,
                                    Editor.Utils.Path.slash(filePath.slice(length + 1)),
                                ]);
                            }
                        }
                    });
                    console.log(sceneInfo);
                    (0, file_utils_1.writeFile)(outPath, JSON.stringify({ sceneInfo: sceneInfo }));
                }
            }
        },
    ];
    return list;
}
exports.onAssetMenu = onAssetMenu;
