"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphPropertyMgr = void 0;
const interface_1 = require("../interface");
const index_1 = require("./index");
const declare_1 = require("../declare");
/**
 * 用于处理 Property
 */
class GraphPropertyMgr {
    static get Instance() {
        if (!this._instance) {
            this._instance = new GraphPropertyMgr();
        }
        return this._instance;
    }
    getPropertyByID(id) {
        const currentGraphData = index_1.GraphDataMgr.Instance.getCurrentGraphData();
        return currentGraphData.details.properties.find((property) => property.id === id);
    }
    updateProperty(id, newPropertyData) {
        const currentGraphData = index_1.GraphDataMgr.Instance.getCurrentGraphData();
        currentGraphData.details.properties = currentGraphData.details.properties.map((item) => {
            if (item.id === id) {
                return newPropertyData;
            }
            return item;
        });
        this.updatePropertyToGraphNode(newPropertyData);
        index_1.GraphDataMgr.Instance.setDirty(true);
    }
    updatePropertyValue(id, value) {
        const currentGraphData = index_1.GraphDataMgr.Instance.getCurrentGraphData();
        if (!currentGraphData)
            return;
        currentGraphData.details.properties = currentGraphData.details.properties.map((item) => {
            if (item.id === id) {
                item = value;
            }
            return item;
        });
        this.updatePropertyToGraphNode(value);
        index_1.GraphDataMgr.Instance.setDirty(true);
    }
    async iterateProperties(handle) {
        const currentGraphData = index_1.GraphDataMgr.Instance.getCurrentGraphData();
        if (!currentGraphData)
            return;
        for (const property of currentGraphData.details.properties) {
            await handle(property, (0, declare_1.getPropertyDefineByType)(property.type));
        }
    }
    exitsProperty(name) {
        const currentGraphData = index_1.GraphDataMgr.Instance.getCurrentGraphData();
        for (const property of currentGraphData.details.properties) {
            if (property.name === name) {
                return true;
            }
        }
        return false;
    }
    createProperty(type, name) {
        let propertyDefine;
        if (typeof type === 'string') {
            propertyDefine = (0, declare_1.getPropertyDefineByType)(type);
        }
        else {
            propertyDefine = type;
        }
        const propertyData = new interface_1.PropertyData();
        propertyData.name = name;
        propertyData.type = propertyDefine?.type;
        propertyData.declareType = propertyDefine?.declareType;
        propertyData.outputPins = [];
        propertyDefine?.outputs.forEach((slot, index) => {
            propertyData.outputPins.push({
                dataType: slot.type,
                value: slot.default,
                details: {
                    connectType: slot.connectType,
                },
            });
        });
        return propertyData;
    }
    addProperty(propertyDefine) {
        const currentGraphData = index_1.GraphDataMgr.Instance.getCurrentGraphData();
        // name 是唯一标识，如果存在 name 就重命名
        const existingNames = new Set(currentGraphData.details.properties.map((item) => item.name));
        let newName = propertyDefine.name;
        let counter = 1;
        while (existingNames.has(newName)) {
            newName = `${propertyDefine.name}_${counter}`;
            counter++;
        }
        const propertyData = this.createProperty(propertyDefine, newName);
        const properties = currentGraphData.details.properties;
        if (properties) {
            currentGraphData.details.properties.push(propertyData);
            index_1.GraphDataMgr.Instance.setDirty(true);
        }
        return propertyData;
    }
    removeProperty(index) {
        const currentGraphData = index_1.GraphDataMgr.Instance.getCurrentGraphData();
        const property = currentGraphData.details.properties.splice(index, 1)[0];
        index_1.GraphDataMgr.Instance.reduceToBaseNode(property);
        const rootGraphData = index_1.GraphDataMgr.Instance.getRootGraphData();
        this.removePropertyPinInSubGraphNode(rootGraphData, property.id);
        for (const graphID in rootGraphData.graphs) {
            this.removePropertyPinInSubGraphNode(rootGraphData.graphs[graphID], property.id);
        }
        index_1.GraphDataMgr.Instance.setDirty(true);
        return property;
    }
    removePropertyPinInSubGraphNode(graphData, propertyID) {
        for (const nodeID in graphData.nodes) {
            const node = graphData.nodes[nodeID];
            if (node.type === 'SubGraphNode') {
                const index = node.details.inputPins?.findIndex((pin) => pin.details.propertyID === propertyID);
                if (index !== -1 && index !== undefined) {
                    node.details.inputPins?.splice(index, 1);
                    node.details.inputDescription?.splice(index, 1);
                }
            }
        }
    }
    /**
     * 更新 PropertyNode 数据（title、output）
     * @param property
     * @private
     */
    updatePropertyToGraphNode(property) {
        if (!index_1.GraphDataMgr.Instance.graphData) {
            console.debug('updatePropertyToGraphNode failed, the graph data is null');
            return;
        }
        for (const nodeID in index_1.GraphDataMgr.Instance.graphData.nodes) {
            const node = index_1.GraphDataMgr.Instance.graphData.nodes[nodeID];
            const details = node && node.details;
            if (details && details.propertyID === property.id) {
                details.title = property.name;
                details.outputPins = property.outputPins;
            }
        }
        index_1.GraphDataMgr.Instance.reload();
    }
}
exports.GraphPropertyMgr = GraphPropertyMgr;
GraphPropertyMgr._instance = null;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGgtcHJvcGVydHktbWdyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NoYWRlci1ncmFwaC9iYXNlL2dyYXBoLXByb3BlcnR5LW1nci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSw0Q0FBNEM7QUFFNUMsbUNBQXVDO0FBQ3ZDLHdDQUFxRDtBQUVyRDs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBSWxCLE1BQU0sS0FBSyxRQUFRO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1NBQzNDO1FBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFTSxlQUFlLENBQUMsRUFBVTtRQUM3QixNQUFNLGdCQUFnQixHQUFHLG9CQUFZLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFckUsT0FBTyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQXNCLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDcEcsQ0FBQztJQUVNLGNBQWMsQ0FBQyxFQUFVLEVBQUUsZUFBNkI7UUFDM0QsTUFBTSxnQkFBZ0IsR0FBRyxvQkFBWSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRXJFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFrQixFQUFFLEVBQUU7WUFDakcsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDaEIsT0FBTyxlQUFlLENBQUM7YUFDMUI7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyx5QkFB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QyxRQUFzQjtRQUNwRCxJQUFJLENBQUMsb0JBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFO1lBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztZQUMxRSxPQUFPO1NBQ1Y7UUFFRCxLQUFLLE1BQU0sTUFBTSxJQUFJLG9CQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDeEQsTUFBTSxJQUFJLEdBQUcsb0JBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzRCxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQXVCLENBQUM7WUFDckQsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyxRQUFRLENBQUMsRUFBRSxFQUFFO2dCQUMvQyxPQUFPLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQzlCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQzthQUM1QztTQUNKO1FBRUQsb0JBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbkMsQ0FBQzs7QUEvSkwsNENBZ0tDO0FBOUpVLDBCQUFTLEdBQTRCLElBQUksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgSU5vZGVEZXRhaWxzIH0gZnJvbSAnLi4vaW50ZXJmYWNlJztcbmltcG9ydCB0eXBlIHsgUHJvcGVydHlEZWZpbmUsIFNsb3REZWZpbmUgfSBmcm9tICcuLi8uLi8uLi9AdHlwZXMvc2hhZGVyLW5vZGUtdHlwZSc7XG5pbXBvcnQgdHlwZSB7IEJsb2NrRGF0YSwgR3JhcGhEYXRhIH0gZnJvbSAnLi4vLi4vYmxvY2stZm9yZ2UvaW50ZXJmYWNlJztcblxuaW1wb3J0IHsgUHJvcGVydHlEYXRhIH0gZnJvbSAnLi4vaW50ZXJmYWNlJztcblxuaW1wb3J0IHsgR3JhcGhEYXRhTWdyIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgeyBnZXRQcm9wZXJ0eURlZmluZUJ5VHlwZSB9IGZyb20gJy4uL2RlY2xhcmUnO1xuXG4vKipcbiAqIOeUqOS6juWkhOeQhiBQcm9wZXJ0eVxuICovXG5leHBvcnQgY2xhc3MgR3JhcGhQcm9wZXJ0eU1nciB7XG5cbiAgICBzdGF0aWMgX2luc3RhbmNlOiBHcmFwaFByb3BlcnR5TWdyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldCBJbnN0YW5jZSgpOiBHcmFwaFByb3BlcnR5TWdyIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgR3JhcGhQcm9wZXJ0eU1ncigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UHJvcGVydHlCeUlEKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY3VycmVudEdyYXBoRGF0YSA9IEdyYXBoRGF0YU1nci5JbnN0YW5jZS5nZXRDdXJyZW50R3JhcGhEYXRhKCk7XG5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnRHcmFwaERhdGEuZGV0YWlscy5wcm9wZXJ0aWVzLmZpbmQoKHByb3BlcnR5OiBQcm9wZXJ0eURhdGEpID0+IHByb3BlcnR5LmlkID09PSBpZCk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVByb3BlcnR5KGlkOiBzdHJpbmcsIG5ld1Byb3BlcnR5RGF0YTogUHJvcGVydHlEYXRhKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRHcmFwaERhdGEgPSBHcmFwaERhdGFNZ3IuSW5zdGFuY2UuZ2V0Q3VycmVudEdyYXBoRGF0YSgpO1xuXG4gICAgICAgIGN1cnJlbnRHcmFwaERhdGEuZGV0YWlscy5wcm9wZXJ0aWVzID0gY3VycmVudEdyYXBoRGF0YS5kZXRhaWxzLnByb3BlcnRpZXMubWFwKChpdGVtOiBQcm9wZXJ0eURhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXdQcm9wZXJ0eURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydHlUb0dyYXBoTm9kZShuZXdQcm9wZXJ0eURhdGEpO1xuICAgICAgICBHcmFwaERhdGFNZ3IuSW5zdGFuY2Uuc2V0RGlydHkodHJ1ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVByb3BlcnR5VmFsdWUoaWQ6IHN0cmluZywgdmFsdWU6IFByb3BlcnR5RGF0YSkge1xuICAgICAgICBjb25zdCBjdXJyZW50R3JhcGhEYXRhID0gR3JhcGhEYXRhTWdyLkluc3RhbmNlLmdldEN1cnJlbnRHcmFwaERhdGEoKTtcbiAgICAgICAgaWYgKCFjdXJyZW50R3JhcGhEYXRhKSByZXR1cm47XG5cbiAgICAgICAgY3VycmVudEdyYXBoRGF0YS5kZXRhaWxzLnByb3BlcnRpZXMgPSBjdXJyZW50R3JhcGhEYXRhLmRldGFpbHMucHJvcGVydGllcy5tYXAoKGl0ZW06IFByb3BlcnR5RGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnR5VG9HcmFwaE5vZGUodmFsdWUpO1xuICAgICAgICBHcmFwaERhdGFNZ3IuSW5zdGFuY2Uuc2V0RGlydHkodHJ1ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGl0ZXJhdGVQcm9wZXJ0aWVzKGhhbmRsZTogKHByb3BlcnR5OiBQcm9wZXJ0eURhdGEsIHByb3BlcnR5RGVmaW5lOiBQcm9wZXJ0eURlZmluZSB8IHVuZGVmaW5lZCkgPT4gdm9pZCkge1xuICAgICAgICBjb25zdCBjdXJyZW50R3JhcGhEYXRhID0gR3JhcGhEYXRhTWdyLkluc3RhbmNlLmdldEN1cnJlbnRHcmFwaERhdGEoKTtcbiAgICAgICAgaWYgKCFjdXJyZW50R3JhcGhEYXRhKSByZXR1cm47XG5cbiAgICAgICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBjdXJyZW50R3JhcGhEYXRhLmRldGFpbHMucHJvcGVydGllcykge1xuICAgICAgICAgICAgYXdhaXQgaGFuZGxlKHByb3BlcnR5LCBnZXRQcm9wZXJ0eURlZmluZUJ5VHlwZShwcm9wZXJ0eS50eXBlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZXhpdHNQcm9wZXJ0eShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgY3VycmVudEdyYXBoRGF0YSA9IEdyYXBoRGF0YU1nci5JbnN0YW5jZS5nZXRDdXJyZW50R3JhcGhEYXRhKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBjdXJyZW50R3JhcGhEYXRhLmRldGFpbHMucHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5Lm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVByb3BlcnR5KHR5cGU6IHN0cmluZyB8IFByb3BlcnR5RGVmaW5lLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHByb3BlcnR5RGVmaW5lOiBQcm9wZXJ0eURlZmluZTtcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcHJvcGVydHlEZWZpbmUgPSBnZXRQcm9wZXJ0eURlZmluZUJ5VHlwZSh0eXBlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5RGVmaW5lID0gdHlwZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcm9wZXJ0eURhdGE6IFByb3BlcnR5RGF0YSA9IG5ldyBQcm9wZXJ0eURhdGEoKTtcbiAgICAgICAgcHJvcGVydHlEYXRhLm5hbWUgPSBuYW1lO1xuICAgICAgICBwcm9wZXJ0eURhdGEudHlwZSA9IHByb3BlcnR5RGVmaW5lPy50eXBlO1xuICAgICAgICBwcm9wZXJ0eURhdGEuZGVjbGFyZVR5cGUgPSBwcm9wZXJ0eURlZmluZT8uZGVjbGFyZVR5cGU7XG4gICAgICAgIHByb3BlcnR5RGF0YS5vdXRwdXRQaW5zID0gW107XG5cbiAgICAgICAgcHJvcGVydHlEZWZpbmU/Lm91dHB1dHMuZm9yRWFjaCgoc2xvdDogU2xvdERlZmluZSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgcHJvcGVydHlEYXRhLm91dHB1dFBpbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IHNsb3QudHlwZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogc2xvdC5kZWZhdWx0LFxuICAgICAgICAgICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdFR5cGU6IHNsb3QuY29ubmVjdFR5cGUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5RGF0YTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkUHJvcGVydHkocHJvcGVydHlEZWZpbmU6IFByb3BlcnR5RGVmaW5lKTogUHJvcGVydHlEYXRhIHtcbiAgICAgICAgY29uc3QgY3VycmVudEdyYXBoRGF0YSA9IEdyYXBoRGF0YU1nci5JbnN0YW5jZS5nZXRDdXJyZW50R3JhcGhEYXRhKCk7XG5cbiAgICAgICAgLy8gbmFtZSDmmK/llK/kuIDmoIfor4bvvIzlpoLmnpzlrZjlnKggbmFtZSDlsLHph43lkb3lkI1cbiAgICAgICAgY29uc3QgZXhpc3RpbmdOYW1lcyA9IG5ldyBTZXQoY3VycmVudEdyYXBoRGF0YS5kZXRhaWxzLnByb3BlcnRpZXMubWFwKChpdGVtOiBQcm9wZXJ0eURhdGEpID0+IGl0ZW0ubmFtZSkpO1xuICAgICAgICBsZXQgbmV3TmFtZSA9IHByb3BlcnR5RGVmaW5lLm5hbWU7XG4gICAgICAgIGxldCBjb3VudGVyID0gMTtcbiAgICAgICAgd2hpbGUgKGV4aXN0aW5nTmFtZXMuaGFzKG5ld05hbWUpKSB7XG4gICAgICAgICAgICBuZXdOYW1lID0gYCR7cHJvcGVydHlEZWZpbmUubmFtZX1fJHtjb3VudGVyfWA7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvcGVydHlEYXRhOiBQcm9wZXJ0eURhdGEgfCB1bmRlZmluZWQgPSB0aGlzLmNyZWF0ZVByb3BlcnR5KHByb3BlcnR5RGVmaW5lLCBuZXdOYW1lKTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IGN1cnJlbnRHcmFwaERhdGEuZGV0YWlscy5wcm9wZXJ0aWVzIGFzIFByb3BlcnR5RGF0YVtdO1xuICAgICAgICBpZiAocHJvcGVydGllcykge1xuICAgICAgICAgICAgY3VycmVudEdyYXBoRGF0YS5kZXRhaWxzLnByb3BlcnRpZXMucHVzaChwcm9wZXJ0eURhdGEpO1xuICAgICAgICAgICAgR3JhcGhEYXRhTWdyLkluc3RhbmNlLnNldERpcnR5KHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wZXJ0eURhdGE7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZVByb3BlcnR5KGluZGV4OiBudW1iZXIpOiBQcm9wZXJ0eURhdGEge1xuICAgICAgICBjb25zdCBjdXJyZW50R3JhcGhEYXRhID0gR3JhcGhEYXRhTWdyLkluc3RhbmNlLmdldEN1cnJlbnRHcmFwaERhdGEoKTtcblxuICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IGN1cnJlbnRHcmFwaERhdGEuZGV0YWlscy5wcm9wZXJ0aWVzLnNwbGljZShpbmRleCwgMSlbMF07XG5cbiAgICAgICAgR3JhcGhEYXRhTWdyLkluc3RhbmNlLnJlZHVjZVRvQmFzZU5vZGUocHJvcGVydHkpO1xuXG4gICAgICAgIGNvbnN0IHJvb3RHcmFwaERhdGEgPSBHcmFwaERhdGFNZ3IuSW5zdGFuY2UuZ2V0Um9vdEdyYXBoRGF0YSgpO1xuICAgICAgICB0aGlzLnJlbW92ZVByb3BlcnR5UGluSW5TdWJHcmFwaE5vZGUocm9vdEdyYXBoRGF0YSwgcHJvcGVydHkuaWQpO1xuICAgICAgICBmb3IgKGNvbnN0IGdyYXBoSUQgaW4gcm9vdEdyYXBoRGF0YS5ncmFwaHMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUHJvcGVydHlQaW5JblN1YkdyYXBoTm9kZShyb290R3JhcGhEYXRhLmdyYXBoc1tncmFwaElEXSwgcHJvcGVydHkuaWQpO1xuICAgICAgICB9XG4gICAgICAgIEdyYXBoRGF0YU1nci5JbnN0YW5jZS5zZXREaXJ0eSh0cnVlKTtcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5O1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlUHJvcGVydHlQaW5JblN1YkdyYXBoTm9kZShncmFwaERhdGE6IEdyYXBoRGF0YSwgcHJvcGVydHlJRDogc3RyaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZUlEIGluIGdyYXBoRGF0YS5ub2Rlcykge1xuICAgICAgICAgICAgY29uc3Qgbm9kZTogQmxvY2tEYXRhID0gZ3JhcGhEYXRhLm5vZGVzW25vZGVJRF07XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlID09PSAnU3ViR3JhcGhOb2RlJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbm9kZS5kZXRhaWxzLmlucHV0UGlucz8uZmluZEluZGV4KChwaW4pID0+IHBpbi5kZXRhaWxzLnByb3BlcnR5SUQgPT09IHByb3BlcnR5SUQpO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEgJiYgaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmRldGFpbHMuaW5wdXRQaW5zPy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICBub2RlLmRldGFpbHMuaW5wdXREZXNjcmlwdGlvbj8uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmm7TmlrAgUHJvcGVydHlOb2RlIOaVsOaNru+8iHRpdGxl44CBb3V0cHV077yJXG4gICAgICogQHBhcmFtIHByb3BlcnR5XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZVByb3BlcnR5VG9HcmFwaE5vZGUocHJvcGVydHk6IFByb3BlcnR5RGF0YSkge1xuICAgICAgICBpZiAoIUdyYXBoRGF0YU1nci5JbnN0YW5jZS5ncmFwaERhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ3VwZGF0ZVByb3BlcnR5VG9HcmFwaE5vZGUgZmFpbGVkLCB0aGUgZ3JhcGggZGF0YSBpcyBudWxsJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IG5vZGVJRCBpbiBHcmFwaERhdGFNZ3IuSW5zdGFuY2UuZ3JhcGhEYXRhLm5vZGVzKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gR3JhcGhEYXRhTWdyLkluc3RhbmNlLmdyYXBoRGF0YS5ub2Rlc1tub2RlSURdO1xuICAgICAgICAgICAgY29uc3QgZGV0YWlscyA9IG5vZGUgJiYgbm9kZS5kZXRhaWxzIGFzIElOb2RlRGV0YWlscztcbiAgICAgICAgICAgIGlmIChkZXRhaWxzICYmIGRldGFpbHMucHJvcGVydHlJRCA9PT0gcHJvcGVydHkuaWQpIHtcbiAgICAgICAgICAgICAgICBkZXRhaWxzLnRpdGxlID0gcHJvcGVydHkubmFtZTtcbiAgICAgICAgICAgICAgICBkZXRhaWxzLm91dHB1dFBpbnMgPSBwcm9wZXJ0eS5vdXRwdXRQaW5zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgR3JhcGhEYXRhTWdyLkluc3RhbmNlLnJlbG9hZCgpO1xuICAgIH1cbn1cbiJdfQ==