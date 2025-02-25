"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMgr = void 0;
/**
 * 这里统一处理消息的发送，普通的，场景的，DB 的
 */
const internal_1 = require("./internal");
class MessageMgr {
    constructor() {
        this.eventCallbacks = new Map();
        // --- Scene ---
        this.isSceneReady = undefined;
        this.sceneMessages = [];
    }
    static get Instance() {
        if (!this._instance) {
            this._instance = new MessageMgr();
        }
        return this._instance;
    }
    send(eventNames, ...args) {
        // 模拟发送消息的操作
        const events = Array.isArray(eventNames) ? eventNames : [eventNames];
        for (const eventName of events) {
            console.debug(`发送消息 (${eventName}) ${args.length > 0 ? ':' + JSON.stringify(args) : ''}`);
            // 触发特定事件的注册的回调函数来处理消息
            const callbacks = this.eventCallbacks.get(eventName);
            if (callbacks) {
                callbacks.forEach((callback) => {
                    callback(...args);
                });
            }
        }
    }
    unregisterAll() {
        this.eventCallbacks.clear();
        this.sceneMessages = [];
    }
    /**
     * 注册一个或多个事件的消息回调函数
     * @param eventNames
     * @param callback
     */
    register(eventNames, callback) {
        const events = Array.isArray(eventNames) ? eventNames : [eventNames];
        for (const eventName of events) {
            if (!this.eventCallbacks.has(eventName)) {
                this.eventCallbacks.set(eventName, []);
            }
            this.eventCallbacks.get(eventName)?.push(callback);
        }
    }
    /**
     * 取消注册一个或多个事件的消息回调函数
     * @param eventNames
     * @param callback
     */
    unregister(eventNames, callback) {
        const events = Array.isArray(eventNames) ? eventNames : [eventNames];
        for (const eventName of events) {
            const callbacks = this.eventCallbacks.get(eventName);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index !== -1) {
                    callbacks.splice(index, 1);
                }
            }
        }
    }
    async checkSceneReady() {
        if (!this.isSceneReady) {
            this.isSceneReady = await Editor.Message.request('scene', 'query-is-ready');
        }
        return this.isSceneReady;
    }
    setSceneReady(ready) {
        this.isSceneReady = ready;
        for (let i = 0; i < this.sceneMessages.length; i++) {
            const options = this.sceneMessages[i];
            Editor.Message.request('scene', 'execute-scene-script', {
                name: 'shader-graph',
                method: options.method,
                args: options.args,
            }).then((response) => {
                options.callback(null, response);
            });
        }
        if (ready) {
            MessageMgr.Instance.send(internal_1.MessageType.SceneReady);
        }
    }
    async callSceneMethod(method, args) {
        return new Promise((resolve, reject) => {
            const callback = function (error, data) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(data);
            };
            this.checkSceneReady().then(() => {
                if (!this.isSceneReady) {
                    return this.sceneMessages.push({
                        method,
                        args: args || [],
                        callback,
                    });
                }
                Editor.Message.request('scene', 'execute-scene-script', {
                    name: 'shader-graph',
                    method,
                    args: args || [],
                }).then((response) => {
                    callback(null, response);
                });
            });
        });
    }
}
exports.MessageMgr = MessageMgr;
MessageMgr._instance = null;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS1tZ3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2hhZGVyLWdyYXBoL2Jhc2UvbWVzc2FnZS1tZ3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCx5Q0FBeUM7QUFVekMsTUFBYSxVQUFVO0lBQXZCO1FBV1ksbUJBQWMsR0FBbUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQXdEbkUsZ0JBQWdCO1FBRWhCLGlCQUFZLEdBQXdCLFNBQVMsQ0FBQztRQUU5QyxrQkFBYSxHQUFvQixFQUFFLENBQUM7SUF1RHhDLENBQUM7SUExSFUsTUFBTSxLQUFLLFFBQVE7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1NBQ3JDO1FBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFJTSxJQUFJLENBQUMsVUFBNkIsRUFBRSxHQUFHLElBQVc7UUFDckQsWUFBWTtRQUNaLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRSxLQUFLLE1BQU0sU0FBUyxJQUFJLE1BQU0sRUFBRTtZQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsU0FBUyxLQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUUxRixzQkFBc0I7WUFDdEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckQsSUFBSSxTQUFTLEVBQUU7Z0JB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VUFBVSxDQUFDLENBQUM7U0FDcEQ7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxNQUFjLEVBQUUsSUFBWTtRQUM5QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25DLE1BQU0sUUFBUSxHQUFHLFVBQVMsS0FBVSxFQUFFLElBQVM7Z0JBQzNDLElBQUksS0FBSyxFQUFFO29CQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDZCxPQUFPO2lCQUNWO2dCQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixDQUFDLENBQUM7WUFFRixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ3BCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7d0JBQzNCLE1BQU07d0JBQ04sSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFO3dCQUNoQixRQUFRO3FCQUNYLENBQUMsQ0FBQztpQkFDTjtnQkFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUU7b0JBQ3BELElBQUksRUFBRSxjQUFjO29CQUNwQixNQUFNO29CQUNOLElBQUksRUFBRSxJQUFJLElBQUksRUFBRTtpQkFDbkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQWEsRUFBRSxFQUFFO29CQUN0QixRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM3QixDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOztBQTdITCxnQ0E4SEM7QUE1SFUsb0JBQVMsR0FBc0IsSUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiDov5nph4znu5/kuIDlpITnkIbmtojmga/nmoTlj5HpgIHvvIzmma7pgJrnmoTvvIzlnLrmma/nmoTvvIxEQiDnmoRcbiAqL1xuaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tICcuL2ludGVybmFsJztcblxuaW50ZXJmYWNlIElTY2VuZU1lc3NhZ2Uge1xuICAgIG1ldGhvZDogc3RyaW5nO1xuICAgIGFyZ3M6IGFueVtdLFxuICAgIGNhbGxiYWNrOiBGdW5jdGlvbjtcbn1cblxudHlwZSBNZXNzYWdlQ2FsbGJhY2sgPSAoLi4uYXJnczogYW55W10pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlTWdyIHtcblxuICAgIHN0YXRpYyBfaW5zdGFuY2U6IE1lc3NhZ2VNZ3IgfCBudWxsID0gbnVsbDtcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEluc3RhbmNlKCk6IE1lc3NhZ2VNZ3Ige1xuICAgICAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBNZXNzYWdlTWdyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXZlbnRDYWxsYmFja3M6IE1hcDxzdHJpbmcsIE1lc3NhZ2VDYWxsYmFja1tdPiA9IG5ldyBNYXAoKTtcblxuICAgIHB1YmxpYyBzZW5kKGV2ZW50TmFtZXM6IHN0cmluZyB8IHN0cmluZ1tdLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICAvLyDmqKHmi5/lj5HpgIHmtojmga/nmoTmk43kvZxcbiAgICAgICAgY29uc3QgZXZlbnRzID0gQXJyYXkuaXNBcnJheShldmVudE5hbWVzKSA/IGV2ZW50TmFtZXMgOiBbZXZlbnROYW1lc107XG4gICAgICAgIGZvciAoY29uc3QgZXZlbnROYW1lIG9mIGV2ZW50cykge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1Zyhg5Y+R6YCB5raI5oGvICgke2V2ZW50TmFtZX0pICR7YXJncy5sZW5ndGggPiAwID8gJzonICsgSlNPTi5zdHJpbmdpZnkoYXJncykgOiAnJ31gKTtcblxuICAgICAgICAgICAgLy8g6Kem5Y+R54m55a6a5LqL5Lu255qE5rOo5YaM55qE5Zue6LCD5Ye95pWw5p2l5aSE55CG5raI5oGvXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzLmdldChldmVudE5hbWUpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB1bnJlZ2lzdGVyQWxsKCkge1xuICAgICAgICB0aGlzLmV2ZW50Q2FsbGJhY2tzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuc2NlbmVNZXNzYWdlcyA9IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOazqOWGjOS4gOS4quaIluWkmuS4quS6i+S7tueahOa2iOaBr+Wbnuiwg+WHveaVsFxuICAgICAqIEBwYXJhbSBldmVudE5hbWVzXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICovXG4gICAgcHVibGljIHJlZ2lzdGVyKGV2ZW50TmFtZXM6IHN0cmluZyB8IHN0cmluZ1tdLCBjYWxsYmFjazogTWVzc2FnZUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IEFycmF5LmlzQXJyYXkoZXZlbnROYW1lcykgPyBldmVudE5hbWVzIDogW2V2ZW50TmFtZXNdO1xuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50TmFtZSBvZiBldmVudHMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5ldmVudENhbGxiYWNrcy5oYXMoZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRDYWxsYmFja3Muc2V0KGV2ZW50TmFtZSwgW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ldmVudENhbGxiYWNrcy5nZXQoZXZlbnROYW1lKT8ucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlj5bmtojms6jlhozkuIDkuKrmiJblpJrkuKrkuovku7bnmoTmtojmga/lm57osIPlh73mlbBcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lc1xuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqL1xuICAgIHB1YmxpYyB1bnJlZ2lzdGVyKGV2ZW50TmFtZXM6IHN0cmluZyB8IHN0cmluZ1tdLCBjYWxsYmFjazogTWVzc2FnZUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IEFycmF5LmlzQXJyYXkoZXZlbnROYW1lcykgPyBldmVudE5hbWVzIDogW2V2ZW50TmFtZXNdO1xuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50TmFtZSBvZiBldmVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMuZXZlbnRDYWxsYmFja3MuZ2V0KGV2ZW50TmFtZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0gU2NlbmUgLS0tXG5cbiAgICBpc1NjZW5lUmVhZHk6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBzY2VuZU1lc3NhZ2VzOiBJU2NlbmVNZXNzYWdlW10gPSBbXTtcblxuICAgIGFzeW5jIGNoZWNrU2NlbmVSZWFkeSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzU2NlbmVSZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5pc1NjZW5lUmVhZHkgPSBhd2FpdCBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdxdWVyeS1pcy1yZWFkeScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmlzU2NlbmVSZWFkeTtcbiAgICB9XG5cbiAgICBzZXRTY2VuZVJlYWR5KHJlYWR5OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuaXNTY2VuZVJlYWR5ID0gcmVhZHk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNjZW5lTWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnNjZW5lTWVzc2FnZXNbaV07XG4gICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdleGVjdXRlLXNjZW5lLXNjcmlwdCcsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2hhZGVyLWdyYXBoJyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IG9wdGlvbnMubWV0aG9kLFxuICAgICAgICAgICAgICAgIGFyZ3M6IG9wdGlvbnMuYXJncyxcbiAgICAgICAgICAgIH0pLnRoZW4oKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWFkeSkge1xuICAgICAgICAgICAgTWVzc2FnZU1nci5JbnN0YW5jZS5zZW5kKE1lc3NhZ2VUeXBlLlNjZW5lUmVhZHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgY2FsbFNjZW5lTWV0aG9kKG1ldGhvZDogc3RyaW5nLCBhcmdzPzogYW55W10pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBmdW5jdGlvbihlcnJvcjogYW55LCBkYXRhOiBhbnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5jaGVja1NjZW5lUmVhZHkoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNTY2VuZVJlYWR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNjZW5lTWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBhcmdzIHx8IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBFZGl0b3IuTWVzc2FnZS5yZXF1ZXN0KCdzY2VuZScsICdleGVjdXRlLXNjZW5lLXNjcmlwdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3NoYWRlci1ncmFwaCcsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgYXJnczogYXJncyB8fCBbXSxcbiAgICAgICAgICAgICAgICB9KS50aGVuKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=