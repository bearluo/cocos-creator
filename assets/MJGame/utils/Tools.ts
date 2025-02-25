/**
 * 通用工具
 */
export const Tools = {
    /**
     * 根据id 获得 牌类型
     * @param id 
     * @returns 
     */
    getTileTypeByID(id:number) {
        return id & 0xf0;
    },
    /**
     * 根据id 获得 牌值
     * @param id 
     * @returns 
     */
    getTileValueByID(id:number) {
        return id & 0x0f;
    },
}