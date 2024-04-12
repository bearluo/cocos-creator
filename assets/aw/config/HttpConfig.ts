export class HttpConfig {
    /**无结尾 */
    path: string
    /**Static/ 结尾 */
    path_url: string
    /**邮件图标下载地址 game/Resources/dynamicres/ 结尾 */
    path_dynamic: string
    /**头像上传地址 :81/upload/uploadFace/ 结尾 */
    path_icon: string
    /**头像下载地址 upload/image/icon/face/ 结尾 */
    path_face: string
    /**活动图下载地址 Static/ 结尾 */
    path_activity: string
    /**热更新文件下载地址 game/Resources/creator/ 结尾 */
    path_creator: string
    /**常规后台交互地址 :81/ 结尾 */
    path_pay: string
    setUrl(serverConfig: server_config) {
        this.path = `${serverConfig.url_faceup}`;
        this.path_url = `${serverConfig.url_downRes}`;
        this.path_pay = `${serverConfig.url_payroot}`;
        this.path_activity = `${serverConfig.url_downRes}`;
        this.path_icon = `${serverConfig.url_payroot}upload/uploadFace/`;
        this.path_face = `${serverConfig.url_facedown}upload/image/icon/face/`;
        this.path_creator = `${serverConfig.url_downRes}game/Resources/creator/`;
        this.path_dynamic = `${serverConfig.url_downRes}game/Resources/dynamicres/`;
    }
}

export const httpConfig = new HttpConfig();

export interface socket_config {
    /**服务器地址 */
    url_login: string,
    /**最小端口 */
    port_min: number,
    /**最大端口 */
    port_max: number,
}
export interface server_config extends socket_config {
    /**名称 */
    Name: string,
    /**内网中以 Static/ 结尾，例如：http://192.168.125.109/Static/ */
    url_facedown: string,
    /**内网中以 / 结尾，例如：http://192.168.125.109/ */
    url_faceup: string,
    /**内网中以 :83/ 结尾，例如：http://192.168.125.109:83/ */
    url_active: string,
    /**内网中以 :81/ 结尾，例如：http://192.168.125.109:81/ */
    url_payroot: string,
    /**内网中以 Static/ 结尾，例如：http://192.168.125.109/Static/ */
    url_downRes: string,
    /**内网中以 / 结尾，例如：http://192.168.125.109/ */
    url_feedback: string
}

export const servers_default: server_config =
{
    Name: "正式服",
    url_login: "mserver1001-bzqp.bztrucogame.com",
    port_min: 5001,
    port_max: 5010,
    url_facedown: "https://assets-bzqp.bztrucogame.com/Static/",
    url_faceup: "https://upload-assets-bzqp.bztrucogame.com/",
    url_active: "https://activity-bzqp.bztrucogame.com/",
    url_payroot: "https://api-bzqp.bztrucogame.com/",
    url_downRes: "https://assets-bzqp.bztrucogame.com/Static/",
    url_feedback: "https://api-bzqp.bztrucogame.com/"
}

export const servers: Array<server_config> = [
    //服务器列表
    {
        Name: "测试内网",
        url_login: "192.168.125.102",
        port_min: 5001,
        port_max: 5004,
        url_facedown: "http://192.168.125.109/Static/",
        url_faceup: "http://192.168.125.109/",
        url_active: "http://192.168.125.109:83/",
        url_payroot: "http://192.168.125.109:81/",
        url_downRes: "http://192.168.125.109/Static/",
        url_feedback: "http://192.168.125.109/"
    },
    {
        Name: "预发布",
        url_login: "pre-mserver1000-bzqp.bztrucogame.com",
        port_min: 5001,
        port_max: 5010,
        url_facedown: "https://pre-assets-bzqp.bztrucogame.com/Static/",
        url_faceup: "https://pre-upload-assets-bzqp.bztrucogame.com/",
        url_active: "https://pre-activity-bzqp.bztrucogame.com/",
        url_payroot: "https://pre-api-bzqp.bztrucogame.com/",
        url_downRes: "https://pre-assets-bzqp.bztrucogame.com/Static/",
        url_feedback: "https://pre-api-bzqp.bztrucogame.com/"
    },
    {
        Name: "正式服",
        url_login: "mserver1001-bzqp.bztrucogame.com",
        port_min: 5001,
        port_max: 5010,
        url_facedown: "https://assets-bzqp.bztrucogame.com/Static/",
        url_faceup: "https://upload-assets-bzqp.bztrucogame.com/",
        url_active: "https://activity-bzqp.bztrucogame.com/",
        url_payroot: "https://api-bzqp.bztrucogame.com/",
        url_downRes: "https://assets-bzqp.bztrucogame.com/Static/",
        url_feedback: "https://api-bzqp.bztrucogame.com/"
    },
    {
        Name: "覃志峰",
        url_login: "192.168.121.34",
        port_min: 5001,
        port_max: 5001,
        url_facedown: "http://192.168.125.109/Static/",
        url_faceup: "http://192.168.125.109/",
        url_active: "http://192.168.125.109:83/",
        url_payroot: "http://192.168.125.109:81/",
        url_downRes: "http://192.168.125.109/Static/",
        url_feedback: "http://192.168.125.109/"
    },
    {
        Name: "肖林",
        url_login: "192.168.121.111",
        port_min: 5001,
        port_max: 5001,
        url_facedown: "http://192.168.125.109/Static/",
        url_faceup: "http://192.168.125.109/",
        url_active: "http://192.168.125.109:83/",
        url_payroot: "http://192.168.125.109:81/",
        url_downRes: "http://192.168.125.109/Static/",
        url_feedback: "http://192.168.125.109/"
    },
    {
        Name: "吴翔",
        url_login: "192.168.121.22",
        port_min: 5001,
        port_max: 5001,
        url_facedown: "http://192.168.125.109/Static/",
        url_faceup: "http://192.168.125.109/",
        url_active: "http://192.168.125.109:83/",
        url_payroot: "http://192.168.125.109:81/",
        url_downRes: "http://192.168.125.109/Static/",
        url_feedback: "http://192.168.125.109/"
    },
    {
        Name: "吴政",
        url_login: "192.168.120.22",
        port_min: 5001,
        port_max: 5001,
        url_facedown: "http://192.168.125.109/Static/",
        url_faceup: "http://192.168.125.109/",
        url_active: "http://192.168.125.109:83/",
        url_payroot: "http://192.168.125.109:81/",
        url_downRes: "http://192.168.125.109/Static/",
        url_feedback: "http://192.168.125.109/"
    },
]
