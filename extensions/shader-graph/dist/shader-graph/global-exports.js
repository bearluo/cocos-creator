"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGE_NAME = exports.PANEL_NAME = exports.SUB_GRAPH_NODE_TYPE = exports.DEFAULT_ASSET_NAME = exports.DEFAULT_NAME = exports.PROJECT_PATH = exports.PACKAGE_JSON = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
// @ts-ignore
const package_json_1 = tslib_1.__importDefault(require("../../package.json"));
exports.PACKAGE_JSON = package_json_1.default;
const PROJECT_PATH = (0, path_1.join)(Editor.Project.path, 'assets');
exports.PROJECT_PATH = PROJECT_PATH;
const PACKAGE_NAME = package_json_1.default.name;
exports.PACKAGE_NAME = PACKAGE_NAME;
const PANEL_NAME = `${PACKAGE_NAME}.shader-graph`;
exports.PANEL_NAME = PANEL_NAME;
const DEFAULT_NAME = 'New Shader Graph';
exports.DEFAULT_NAME = DEFAULT_NAME;
const DEFAULT_ASSET_NAME = `${DEFAULT_NAME}.shadergraph`;
exports.DEFAULT_ASSET_NAME = DEFAULT_ASSET_NAME;
const SUB_GRAPH_NODE_TYPE = 'SubGraphNode';
exports.SUB_GRAPH_NODE_TYPE = SUB_GRAPH_NODE_TYPE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLWV4cG9ydHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2hhZGVyLWdyYXBoL2dsb2JhbC1leHBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSwrQkFBNEI7QUFDNUIsYUFBYTtBQUNiLDhFQUE4QztBQWUxQyx1QkFmRyxzQkFBWSxDQWVIO0FBYmhCLE1BQU0sWUFBWSxHQUFHLElBQUEsV0FBSSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBY3JELG9DQUFZO0FBWmhCLE1BQU0sWUFBWSxHQUFHLHNCQUFZLENBQUMsSUFBSSxDQUFDO0FBaUJuQyxvQ0FBWTtBQWZoQixNQUFNLFVBQVUsR0FBRyxHQUFHLFlBQVksZUFBZSxDQUFDO0FBYzlDLGdDQUFVO0FBWmQsTUFBTSxZQUFZLEdBQUcsa0JBQWtCLENBQUM7QUFTcEMsb0NBQVk7QUFQaEIsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLFlBQVksY0FBYyxDQUFDO0FBUXJELGdEQUFrQjtBQU50QixNQUFNLG1CQUFtQixHQUFHLGNBQWMsQ0FBQztBQU92QyxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgUEFDS0FHRV9KU09OIGZyb20gJy4uLy4uL3BhY2thZ2UuanNvbic7XG5cbmNvbnN0IFBST0pFQ1RfUEFUSCA9IGpvaW4oRWRpdG9yLlByb2plY3QucGF0aCwgJ2Fzc2V0cycpO1xuXG5jb25zdCBQQUNLQUdFX05BTUUgPSBQQUNLQUdFX0pTT04ubmFtZTtcblxuY29uc3QgUEFORUxfTkFNRSA9IGAke1BBQ0tBR0VfTkFNRX0uc2hhZGVyLWdyYXBoYDtcblxuY29uc3QgREVGQVVMVF9OQU1FID0gJ05ldyBTaGFkZXIgR3JhcGgnO1xuXG5jb25zdCBERUZBVUxUX0FTU0VUX05BTUUgPSBgJHtERUZBVUxUX05BTUV9LnNoYWRlcmdyYXBoYDtcblxuY29uc3QgU1VCX0dSQVBIX05PREVfVFlQRSA9ICdTdWJHcmFwaE5vZGUnO1xuXG5leHBvcnQge1xuICAgIFBBQ0tBR0VfSlNPTixcbiAgICBQUk9KRUNUX1BBVEgsXG4gICAgREVGQVVMVF9OQU1FLFxuICAgIERFRkFVTFRfQVNTRVRfTkFNRSxcbiAgICBTVUJfR1JBUEhfTk9ERV9UWVBFLFxuICAgIFBBTkVMX05BTUUsXG4gICAgUEFDS0FHRV9OQU1FLFxufTtcblxuIl19