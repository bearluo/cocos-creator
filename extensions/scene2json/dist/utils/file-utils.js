"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkDir = exports.getFileData = exports.getFilePath = exports.getSpriteFramePath = exports.writeFile = exports.readFile = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const relativePath = "db://";
const relativePathLen = relativePath.length;
function readFile(path, encoding = 'utf8') {
    if (!Editor.Utils.Path.isAbsolute(path)) {
        path = Editor.Utils.Path.join(Editor.Project.path, path);
    }
    return fs.readFileSync(path, encoding);
}
exports.readFile = readFile;
function writeFile(filePath, contentToWrite, encoding = 'utf8') {
    fs.writeFileSync(filePath, contentToWrite, encoding);
}
exports.writeFile = writeFile;
async function getSpriteFramePath(urlOrUUID) {
    let data = await Editor.Message.request(`asset-db`, `query-asset-info`, urlOrUUID);
    let url = data.url;
    let path = Editor.Utils.Path.dirname(url);
    let extname = Editor.Utils.Path.extname(path);
    if (extname.toLowerCase() == ".plist") {
        let parent_urlOrUUID = urlOrUUID.split("@")[0];
        let parent_data = await Editor.Message.request(`asset-db`, `query-asset-info`, parent_urlOrUUID);
        return {
            path: data.name,
            plist: parent_data.url.substring(relativePathLen)
        };
    }
    return {
        path: path.substring(relativePathLen),
    };
}
exports.getSpriteFramePath = getSpriteFramePath;
async function getFilePath(urlOrUUID) {
    // urlOrUUID = urlOrUUID.split("@")[0]
    let data = await Editor.Message.request(`asset-db`, `query-asset-info`, urlOrUUID);
    return data.url.substring(relativePathLen);
}
exports.getFilePath = getFilePath;
async function getFileData(urlOrUUID) {
    return readFile(await getFilePath(urlOrUUID));
}
exports.getFileData = getFileData;
/**遍历文件夹 */
function walkDir(dir, callback) {
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
exports.walkDir = walkDir;
