"use strict";
// @ts-ignore
// import { EDITOR } from 'cc/env';
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChunks = exports.path = exports.fs = void 0;
const effect_utils_1 = require("../effect-utils");
const useNpm = true; //(EDITOR || (globalThis as any).electron);
exports.fs = useNpm && globalThis.require('fs-extra');
exports.path = useNpm && globalThis.require('path');
const { basename, dirname, extname, join, relative } = exports.path || {};
const { readFileSync, readdirSync, statSync } = exports.fs || {};
let _addedChunks = false;
async function addChunks() {
    if (_addedChunks) {
        return;
    }
    _addedChunks = true;
    const enginePath = (await Editor.Message.request('engine', 'query-engine-info')).typescript.path;
    // 添加所有 builtin 头文件
    const builtinChunkDir = join(enginePath, './editor/assets/chunks');
    const builtinChunks = (() => {
        const arr = [];
        function step(dir) {
            const names = readdirSync(dir);
            names.forEach((name) => {
                const file = join(dir, name);
                if (/\.chunk$/.test(name)) {
                    arr.push(file);
                }
                else if (statSync(file).isDirectory()) {
                    step(file);
                }
            });
        }
        step(builtinChunkDir);
        return arr;
    })();
    for (let i = 0; i < builtinChunks.length; ++i) {
        const name = basename(builtinChunks[i], '.chunk');
        const content = readFileSync(builtinChunks[i], { encoding: 'utf8' });
        await (0, effect_utils_1.addChunk)(name, content);
        const relativeName = relative(builtinChunkDir, builtinChunks[i]).replace('.chunk', '').replace(/\\/g, '/');
        await (0, effect_utils_1.addChunk)(relativeName, content);
    }
}
exports.addChunks = addChunks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZmZWN0LWhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cmlidXRpb25zL2VmZmVjdC1oZWFkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGFBQWE7QUFDYixtQ0FBbUM7OztBQUVuQyxrREFBMkM7QUFFM0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUEsMkNBQTJDO0FBQ2xELFFBQUEsRUFBRSxHQUFHLE1BQU0sSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzlDLFFBQUEsSUFBSSxHQUFHLE1BQU0sSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRXpELE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsWUFBSSxJQUFJLEVBQUUsQ0FBQztBQUNsRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsR0FBRyxVQUFFLElBQUksRUFBRSxDQUFDO0FBRXpELElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztBQUNsQixLQUFLLFVBQVUsU0FBUztJQUMzQixJQUFJLFlBQVksRUFBRTtRQUNkLE9BQU87S0FDVjtJQUVELFlBQVksR0FBRyxJQUFJLENBQUM7SUFFcEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUVqRyxtQkFBbUI7SUFDbkIsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0lBQ25FLE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ3hCLE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztRQUN6QixTQUFTLElBQUksQ0FBQyxHQUFXO1lBQ3JCLE1BQU0sS0FBSyxHQUFhLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzdCLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdkIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDbEI7cUJBQU0sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7b0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDZDtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNELElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0QixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFTCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUMzQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNyRSxNQUFNLElBQUEsdUJBQVEsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUIsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0csTUFBTSxJQUFBLHVCQUFRLEVBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3pDO0FBRUwsQ0FBQztBQXBDRCw4QkFvQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtaWdub3JlXG4vLyBpbXBvcnQgeyBFRElUT1IgfSBmcm9tICdjYy9lbnYnO1xuXG5pbXBvcnQgeyBhZGRDaHVuayB9IGZyb20gJy4uL2VmZmVjdC11dGlscyc7XG5cbmNvbnN0IHVzZU5wbSA9IHRydWU7Ly8oRURJVE9SIHx8IChnbG9iYWxUaGlzIGFzIGFueSkuZWxlY3Ryb24pO1xuZXhwb3J0IGNvbnN0IGZzID0gdXNlTnBtICYmIGdsb2JhbFRoaXMucmVxdWlyZSgnZnMtZXh0cmEnKTtcbmV4cG9ydCBjb25zdCBwYXRoID0gdXNlTnBtICYmIGdsb2JhbFRoaXMucmVxdWlyZSgncGF0aCcpO1xuXG5jb25zdCB7IGJhc2VuYW1lLCBkaXJuYW1lLCBleHRuYW1lLCBqb2luLCByZWxhdGl2ZSB9ID0gcGF0aCB8fCB7fTtcbmNvbnN0IHsgcmVhZEZpbGVTeW5jLCByZWFkZGlyU3luYywgc3RhdFN5bmMgfSA9IGZzIHx8IHt9O1xuXG5sZXQgX2FkZGVkQ2h1bmtzID0gZmFsc2U7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkQ2h1bmtzKCkge1xuICAgIGlmIChfYWRkZWRDaHVua3MpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIF9hZGRlZENodW5rcyA9IHRydWU7XG5cbiAgICBjb25zdCBlbmdpbmVQYXRoID0gKGF3YWl0IEVkaXRvci5NZXNzYWdlLnJlcXVlc3QoJ2VuZ2luZScsICdxdWVyeS1lbmdpbmUtaW5mbycpKS50eXBlc2NyaXB0LnBhdGg7XG5cbiAgICAvLyDmt7vliqDmiYDmnIkgYnVpbHRpbiDlpLTmlofku7ZcbiAgICBjb25zdCBidWlsdGluQ2h1bmtEaXIgPSBqb2luKGVuZ2luZVBhdGgsICcuL2VkaXRvci9hc3NldHMvY2h1bmtzJyk7XG4gICAgY29uc3QgYnVpbHRpbkNodW5rcyA9ICgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFycjogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZnVuY3Rpb24gc3RlcChkaXI6IHN0cmluZykge1xuICAgICAgICAgICAgY29uc3QgbmFtZXM6IHN0cmluZ1tdID0gcmVhZGRpclN5bmMoZGlyKTtcbiAgICAgICAgICAgIG5hbWVzLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gam9pbihkaXIsIG5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICgvXFwuY2h1bmskLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKGZpbGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdFN5bmMoZmlsZSkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGVwKGZpbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHN0ZXAoYnVpbHRpbkNodW5rRGlyKTtcbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICB9KSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWlsdGluQ2h1bmtzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBiYXNlbmFtZShidWlsdGluQ2h1bmtzW2ldLCAnLmNodW5rJyk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSByZWFkRmlsZVN5bmMoYnVpbHRpbkNodW5rc1tpXSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuICAgICAgICBhd2FpdCBhZGRDaHVuayhuYW1lLCBjb250ZW50KTtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVOYW1lID0gcmVsYXRpdmUoYnVpbHRpbkNodW5rRGlyLCBidWlsdGluQ2h1bmtzW2ldKS5yZXBsYWNlKCcuY2h1bmsnLCAnJykucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICAgICAgICBhd2FpdCBhZGRDaHVuayhyZWxhdGl2ZU5hbWUsIGNvbnRlbnQpO1xuICAgIH1cblxufVxuIl19