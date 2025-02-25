"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
const global_exports_1 = require("./shader-graph/global-exports");
/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
    openPanel() {
        Editor.Panel.open(global_exports_1.PACKAGE_NAME);
    },
    async openShaderGraph(assetUuid) {
        const lastAssetUuid = await Editor.Profile.getConfig(global_exports_1.PACKAGE_NAME, 'asset-uuid', 'local');
        await Editor.Profile.setConfig(global_exports_1.PACKAGE_NAME, 'asset-uuid', assetUuid, 'local');
        if (await Editor.Panel.has(global_exports_1.PANEL_NAME)) {
            Editor.Message.send(global_exports_1.PACKAGE_NAME, 'open-asset', assetUuid, lastAssetUuid);
            return;
        }
        await Editor.Panel.open(global_exports_1.PANEL_NAME);
    },
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
function load() {
}
exports.load = load;
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
function unload() { }
exports.unload = unload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtFQUF5RTtBQUV6RTs7O0dBR0c7QUFDVSxRQUFBLE9BQU8sR0FBNEM7SUFDNUQsU0FBUztRQUNMLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLDZCQUFZLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxTQUFpQjtRQUNuQyxNQUFNLGFBQWEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLDZCQUFZLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFGLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsNkJBQVksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRS9FLElBQUksTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQywyQkFBVSxDQUFDLEVBQUU7WUFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkJBQVksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzFFLE9BQU87U0FDVjtRQUVELE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsMkJBQVUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDSixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBZ0IsSUFBSTtBQUVwQixDQUFDO0FBRkQsb0JBRUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFnQixNQUFNLEtBQUssQ0FBQztBQUE1Qix3QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQQUNLQUdFX05BTUUsIFBBTkVMX05BTUUgfSBmcm9tICcuL3NoYWRlci1ncmFwaC9nbG9iYWwtZXhwb3J0cyc7XG5cbi8qKlxuICogQGVuXG4gKiBAemgg5Li65omp5bGV55qE5Li76L+b56iL55qE5rOo5YaM5pa55rOVXG4gKi9cbmV4cG9ydCBjb25zdCBtZXRob2RzOiB7IFtrZXk6IHN0cmluZ106ICguLi5hbnk6IGFueSkgPT4gYW55IH0gPSB7XG4gICAgb3BlblBhbmVsKCkge1xuICAgICAgICBFZGl0b3IuUGFuZWwub3BlbihQQUNLQUdFX05BTUUpO1xuICAgIH0sXG5cbiAgICBhc3luYyBvcGVuU2hhZGVyR3JhcGgoYXNzZXRVdWlkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbGFzdEFzc2V0VXVpZCA9IGF3YWl0IEVkaXRvci5Qcm9maWxlLmdldENvbmZpZyhQQUNLQUdFX05BTUUsICdhc3NldC11dWlkJywgJ2xvY2FsJyk7XG4gICAgICAgIGF3YWl0IEVkaXRvci5Qcm9maWxlLnNldENvbmZpZyhQQUNLQUdFX05BTUUsICdhc3NldC11dWlkJywgYXNzZXRVdWlkLCAnbG9jYWwnKTtcblxuICAgICAgICBpZiAoYXdhaXQgRWRpdG9yLlBhbmVsLmhhcyhQQU5FTF9OQU1FKSkge1xuICAgICAgICAgICAgRWRpdG9yLk1lc3NhZ2Uuc2VuZChQQUNLQUdFX05BTUUsICdvcGVuLWFzc2V0JywgYXNzZXRVdWlkLCBsYXN0QXNzZXRVdWlkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IEVkaXRvci5QYW5lbC5vcGVuKFBBTkVMX05BTUUpO1xuICAgIH0sXG59O1xuXG4vKipcbiAqIEBlbiBIb29rcyB0cmlnZ2VyZWQgYWZ0ZXIgZXh0ZW5zaW9uIGxvYWRpbmcgaXMgY29tcGxldGVcbiAqIEB6aCDmianlsZXliqDovb3lrozmiJDlkI7op6blj5HnmoTpkqnlrZBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWQoKSB7XG5cbn1cblxuLyoqXG4gKiBAZW4gSG9va3MgdHJpZ2dlcmVkIGFmdGVyIGV4dGVuc2lvbiB1bmluc3RhbGxhdGlvbiBpcyBjb21wbGV0ZVxuICogQHpoIOaJqeWxleWNuOi9veWujOaIkOWQjuinpuWPkeeahOmSqeWtkFxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5sb2FkKCkgeyB9XG5cbiJdfQ==