"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultGraph = void 0;
const menu_1 = require("../menu");
const base_1 = require("../base");
function createDefaultGraph() {
    return {
        type: 'Graph',
        style: {
            showOriginPoint: true,
            originPointColor: 'rgba(68,68,68,0.3)',
            gridColor: 'rgba(68,68,68,0.3)',
            backgroundColor: '#050505',
        },
        validator: {
            dataLink(nodes, lines, line, input, output) {
                const inputBlock = base_1.ForgeMgr.Instance.getBlockByUuid(line.input.node);
                let inputConnectType = '', outputConnectType = '';
                const inputTag = input.name || input.tag;
                if (input.direction === 'input') {
                    const inputPinData = inputBlock.getInputPin(inputTag);
                    inputConnectType = inputPinData?.desc.details.connectType;
                }
                else if (input.direction === 'output') {
                    const inputPinData = inputBlock.getOutputPin(inputTag);
                    if (inputBlock.block.type === 'PropertyNode') {
                        inputConnectType = inputPinData?.value.details.connectType;
                    }
                    else {
                        inputConnectType = inputPinData?.desc.details.connectType;
                    }
                }
                const outputBlock = base_1.ForgeMgr.Instance.getBlockByUuid(line.output.node);
                const outputTag = output.name || output.tag;
                if (output.direction === 'input') {
                    const outputPinData = outputBlock.getInputPin(outputTag);
                    outputConnectType = outputPinData?.desc.details.connectType;
                }
                else if (output.direction === 'output') {
                    const outputPinData = outputBlock.getOutputPin(outputTag);
                    outputConnectType = outputPinData?.desc.details.connectType;
                }
                // 删除同一个 output 的线条
                base_1.GraphEditorMgr.Instance.deleteLinesByDuplicateOutput(lines, line);
                return (inputConnectType === outputConnectType) || (input.type === output.type);
            },
            execLink(nodes, lines, line, input, output) {
                return true;
            },
            deleteLine(...args) {
                return true;
            },
            // 节点
            createNode(...args) {
                return true;
            },
            deleteNode(...args) {
                return true;
            },
        },
        event: {
            // Block 选中事件
            onBlockSelected(event) {
                return true;
            },
            onBlockUnselected(event) {
                return true;
            },
            // Line 选中事件
            onLineSelected(event) {
                return true;
            },
            onLineUnselected(event) {
                return true;
            },
            // Block 点击事件
            onBlockClick(event) {
                return true;
            },
            onBlockRightClick(event) {
                return menu_1.Menu.Instance.popupMenu(event);
            },
            onBlockDblClick(event) {
                return true;
            },
            // Line 点击事件
            onLineClick(event) {
                return true;
            },
            onLineRightClick(event) {
                return menu_1.Menu.Instance.popupMenu(event);
            },
            onLineDblClick(event) {
                return true;
            },
            // Graph 点击事件
            onGraphRightClick(event) {
                return menu_1.Menu.Instance.popupMenu(event);
            },
            // 连线
            onLineCreated(event) {
                return true;
            },
            onLineDeleted(event) {
                return true;
            },
            // 节点
            onBlockCreated(event) {
                return true;
            },
            onBlockDeleted(event) {
                return true;
            },
        },
    };
}
exports.createDefaultGraph = createDefaultGraph;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2hhZGVyLWdyYXBoL2RlY2xhcmUvZ3JhcGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0Esa0NBQStCO0FBQy9CLGtDQUFtRDtBQUVuRCxTQUFnQixrQkFBa0I7SUFDOUIsT0FBTztRQUNILElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFO1lBQ0gsZUFBZSxFQUFFLElBQUk7WUFDckIsZ0JBQWdCLEVBQUUsb0JBQW9CO1lBQ3RDLFNBQVMsRUFBRSxvQkFBb0I7WUFDL0IsZUFBZSxFQUFFLFNBQVM7U0FDN0I7UUFDRCxTQUFTLEVBQUU7WUFDUCxRQUFRLENBQUMsS0FBbUMsRUFBRSxLQUFrQyxFQUFFLElBQWMsRUFBRSxLQUFVLEVBQUUsTUFBVztnQkFDckgsTUFBTSxVQUFVLEdBQUcsZUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckUsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLEVBQUUsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO2dCQUNsRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ3pDLElBQUksS0FBSyxDQUFDLFNBQVMsS0FBSyxPQUFPLEVBQUU7b0JBQzdCLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3RELGdCQUFnQixHQUFHLFlBQVksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztpQkFDN0Q7cUJBQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxLQUFLLFFBQVEsRUFBRTtvQkFDckMsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDdkQsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksS0FB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QUFzQjtnQkFDcEMsT0FBTyxXQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxDQUFDO1lBRUQsS0FBSztZQUNMLGFBQWEsQ0FBQyxLQUFnQjtnQkFDMUIsT0FBTyxJQUFJLENBQUM7WUFDaEIsQ0FBQztZQUNELGFBQWEsQ0FBQyxLQUFnQjtnQkFDMUIsT0FBTyxJQUFJLENBQUM7WUFDaEIsQ0FBQztZQUVELEtBQUs7WUFDTCxjQUFjLENBQUMsS0FBaUI7Z0JBQzVCLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFDRCxjQUFjLENBQUMsS0FBaUI7Z0JBQzVCLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUM7U0FDSjtLQUNKLENBQUM7QUFDTixDQUFDO0FBbkhELGdEQW1IQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQmxvY2tEYXRhLCBMaW5lRGF0YSwgUGluRGF0YSB9IGZyb20gJy4uLy4uL2Jsb2NrLWZvcmdlL2ludGVyZmFjZSc7XG5pbXBvcnQgdHlwZSB7IElHcmFwaERlc2NyaXB0aW9uIH0gZnJvbSAnLi4vLi4vYmxvY2stZm9yZ2UvaW50ZXJmYWNlJztcblxuaW1wb3J0IHtcbiAgICBCbG9ja0V2ZW50LCBCbG9ja01vdXNlRXZlbnQsIEdyYXBoTW91c2VFdmVudCwgTGluZUV2ZW50LCBMaW5lTW91c2VFdmVudCxcbn0gZnJvbSAnLi4vLi4vYmxvY2stZm9yZ2UvZXZlbnQnO1xuXG5pbXBvcnQgeyBNZW51IH0gZnJvbSAnLi4vbWVudSc7XG5pbXBvcnQgeyBHcmFwaEVkaXRvck1nciwgRm9yZ2VNZ3IgfSBmcm9tICcuLi9iYXNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRHcmFwaCgpOiBJR3JhcGhEZXNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ0dyYXBoJyxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIHNob3dPcmlnaW5Qb2ludDogdHJ1ZSxcbiAgICAgICAgICAgIG9yaWdpblBvaW50Q29sb3I6ICdyZ2JhKDY4LDY4LDY4LDAuMyknLFxuICAgICAgICAgICAgZ3JpZENvbG9yOiAncmdiYSg2OCw2OCw2OCwwLjMpJyxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMwNTA1MDUnLFxuICAgICAgICB9LFxuICAgICAgICB2YWxpZGF0b3I6IHtcbiAgICAgICAgICAgIGRhdGFMaW5rKG5vZGVzOiB7IFtrZXk6IHN0cmluZ106IEJsb2NrRGF0YSB9LCBsaW5lczogeyBba2V5OiBzdHJpbmddOiBMaW5lRGF0YSB9LCBsaW5lOiBMaW5lRGF0YSwgaW5wdXQ6IGFueSwgb3V0cHV0OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dEJsb2NrID0gRm9yZ2VNZ3IuSW5zdGFuY2UuZ2V0QmxvY2tCeVV1aWQobGluZS5pbnB1dC5ub2RlKTtcbiAgICAgICAgICAgICAgICBsZXQgaW5wdXRDb25uZWN0VHlwZSA9ICcnLCBvdXRwdXRDb25uZWN0VHlwZSA9ICcnO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0VGFnID0gaW5wdXQubmFtZSB8fCBpbnB1dC50YWc7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmRpcmVjdGlvbiA9PT0gJ2lucHV0Jykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dFBpbkRhdGEgPSBpbnB1dEJsb2NrLmdldElucHV0UGluKGlucHV0VGFnKTtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRDb25uZWN0VHlwZSA9IGlucHV0UGluRGF0YT8uZGVzYy5kZXRhaWxzLmNvbm5lY3RUeXBlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuZGlyZWN0aW9uID09PSAnb3V0cHV0Jykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dFBpbkRhdGEgPSBpbnB1dEJsb2NrLmdldE91dHB1dFBpbihpbnB1dFRhZyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dEJsb2NrLmJsb2NrLnR5cGUgPT09ICdQcm9wZXJ0eU5vZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dENvbm5lY3RUeXBlID0gaW5wdXRQaW5EYXRhPy52YWx1ZS5kZXRhaWxzLmNvbm5lY3RUeXBlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRDb25uZWN0VHlwZSA9IGlucHV0UGluRGF0YT8uZGVzYy5kZXRhaWxzLmNvbm5lY3RUeXBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG91dHB1dEJsb2NrID0gRm9yZ2VNZ3IuSW5zdGFuY2UuZ2V0QmxvY2tCeVV1aWQobGluZS5vdXRwdXQubm9kZSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0VGFnID0gb3V0cHV0Lm5hbWUgfHwgb3V0cHV0LnRhZztcbiAgICAgICAgICAgICAgICBpZiAob3V0cHV0LmRpcmVjdGlvbiA9PT0gJ2lucHV0Jykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXRQaW5EYXRhID0gb3V0cHV0QmxvY2suZ2V0SW5wdXRQaW4ob3V0cHV0VGFnKTtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0Q29ubmVjdFR5cGUgPSBvdXRwdXRQaW5EYXRhPy5kZXNjLmRldGFpbHMuY29ubmVjdFR5cGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvdXRwdXQuZGlyZWN0aW9uID09PSAnb3V0cHV0Jykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRwdXRQaW5EYXRhID0gb3V0cHV0QmxvY2suZ2V0T3V0cHV0UGluKG91dHB1dFRhZyk7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dENvbm5lY3RUeXBlID0gb3V0cHV0UGluRGF0YT8uZGVzYy5kZXRhaWxzLmNvbm5lY3RUeXBlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOWIoOmZpOWQjOS4gOS4qiBvdXRwdXQg55qE57q/5p2hXG4gICAgICAgICAgICAgICAgR3JhcGhFZGl0b3JNZ3IuSW5zdGFuY2UuZGVsZXRlTGluZXNCeUR1cGxpY2F0ZU91dHB1dChsaW5lcywgbGluZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKGlucHV0Q29ubmVjdFR5cGUgPT09IG91dHB1dENvbm5lY3RUeXBlKSB8fCAoaW5wdXQudHlwZSA9PT0gb3V0cHV0LnR5cGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV4ZWNMaW5rKG5vZGVzOiBhbnksIGxpbmVzOiBhbnksIGxpbmU6IGFueSwgaW5wdXQ6IGFueSwgb3V0cHV0OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWxldGVMaW5lKC4uLmFyZ3M6IGFueVtdKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8g6IqC54K5XG4gICAgICAgICAgICBjcmVhdGVOb2RlKC4uLmFyZ3M6IGFueVtdKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVsZXRlTm9kZSguLi5hcmdzOiBhbnlbXSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnQ6IHtcbiAgICAgICAgICAgIC8vIEJsb2NrIOmAieS4reS6i+S7tlxuICAgICAgICAgICAgb25CbG9ja1NlbGVjdGVkKGV2ZW50OiBCbG9ja0V2ZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25CbG9ja1Vuc2VsZWN0ZWQoZXZlbnQ6IEJsb2NrRXZlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIExpbmUg6YCJ5Lit5LqL5Lu2XG4gICAgICAgICAgICBvbkxpbmVTZWxlY3RlZChldmVudDogTGluZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25MaW5lVW5zZWxlY3RlZChldmVudDogTGluZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBCbG9jayDngrnlh7vkuovku7ZcbiAgICAgICAgICAgIG9uQmxvY2tDbGljayhldmVudDogQmxvY2tNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25CbG9ja1JpZ2h0Q2xpY2soZXZlbnQ6IEJsb2NrTW91c2VFdmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNZW51Lkluc3RhbmNlLnBvcHVwTWVudShldmVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25CbG9ja0RibENsaWNrKGV2ZW50OiBCbG9ja01vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIExpbmUg54K55Ye75LqL5Lu2XG4gICAgICAgICAgICBvbkxpbmVDbGljayhldmVudDogTGluZU1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkxpbmVSaWdodENsaWNrKGV2ZW50OiBMaW5lTW91c2VFdmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNZW51Lkluc3RhbmNlLnBvcHVwTWVudShldmVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25MaW5lRGJsQ2xpY2soZXZlbnQ6IExpbmVNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBHcmFwaCDngrnlh7vkuovku7ZcbiAgICAgICAgICAgIG9uR3JhcGhSaWdodENsaWNrKGV2ZW50OiBHcmFwaE1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWVudS5JbnN0YW5jZS5wb3B1cE1lbnUoZXZlbnQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8g6L+e57q/XG4gICAgICAgICAgICBvbkxpbmVDcmVhdGVkKGV2ZW50OiBMaW5lRXZlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkxpbmVEZWxldGVkKGV2ZW50OiBMaW5lRXZlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIOiKgueCuVxuICAgICAgICAgICAgb25CbG9ja0NyZWF0ZWQoZXZlbnQ6IEJsb2NrRXZlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkJsb2NrRGVsZXRlZChldmVudDogQmxvY2tFdmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG4iXX0=