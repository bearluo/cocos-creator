import * as fs from 'fs';
import * as path from 'path';

const relativePath = "db://"
const relativePathLen = relativePath.length

export function readFile(path: string,encoding:BufferEncoding = 'utf8') {
    if (!Editor.Utils.Path.isAbsolute(path)) {
        path = Editor.Utils.Path.join(Editor.Project.path,path);
    }
    return fs.readFileSync(path, encoding);
}

export function writeFile(filePath: string, contentToWrite: string | NodeJS.ArrayBufferView,encoding:BufferEncoding = 'utf8') {
    fs.writeFileSync(filePath, contentToWrite, encoding);
}

export async function getSpriteFramePath(urlOrUUID: string) {
    let data = await Editor.Message.request(`asset-db`, `query-asset-info`, urlOrUUID);
    let url = data.url;
    let path = Editor.Utils.Path.dirname(url);
    let extname = Editor.Utils.Path.extname(path);
    if (extname.toLowerCase() == ".plist") {
        let parent_urlOrUUID = urlOrUUID.split("@")[0]
        let parent_data = await Editor.Message.request(`asset-db`, `query-asset-info`, parent_urlOrUUID);
        return {
            path: data.name,
            plist: parent_data.url.substring(relativePathLen)
        }
    }
    return {
        path: path.substring(relativePathLen),
    }
}

export async function getFilePath(urlOrUUID: string) {
    // urlOrUUID = urlOrUUID.split("@")[0]
    let data = await Editor.Message.request(`asset-db`, `query-asset-info`, urlOrUUID);
    return data.url.substring(relativePathLen);
}

export async function getFileData(urlOrUUID: string):Promise<any> {
    return readFile(await getFilePath(urlOrUUID));
}

/**遍历文件夹 */
export function walkDir(dir: string, callback: (filePath: string, bFile: boolean) => void) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        //如果是子文件夹
        if (stat.isDirectory()) {
            //调用回调函数处理文件夹
            callback(filePath, false);
            //递归遍历
            walkDir(filePath, callback);
        }
        //如果是文件
        else if (stat.isFile()) {
            //调用回调函数处理文件
            callback(filePath, true);
        }
    });
}