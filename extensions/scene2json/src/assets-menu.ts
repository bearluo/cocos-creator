import { AssetInfo } from "../@types/packages/asset-db/@types/public";
import { getFileData, readFile, walkDir, writeFile } from "./utils/file-utils";



export function onAssetMenu(assetsInfo: AssetInfo) {
    const list: Editor.Menu.BaseMenuItem[] = [
        {
            //名称
            label: `生成scene信息`,
            //点击回调
            async click() {
                if(assetsInfo.isDirectory) {
                    let sceneInfo:string[][] = []
                    let path = assetsInfo.file;
                    let length = path.length;
                    let outPath = Editor.Utils.Path.join(path,"sceneInfo") + ".json";
                    let name = Editor.Utils.Path.basenameNoExt(path);
                    console.log(assetsInfo);
                    console.log(outPath);
                    walkDir(assetsInfo.file,(filePath: string, bFile: boolean)=>{
                        if(bFile) {
                            if(filePath.endsWith(".scene")) {
                                sceneInfo.push([
                                    name,
                                    Editor.Utils.Path.slash(filePath.slice(length+1)),
                                ])
                            }
                        }
                    });
                    console.log(sceneInfo);
                    writeFile(outPath,JSON.stringify({sceneInfo:sceneInfo}))
                }
            }
        },
    ]
    return list;
}