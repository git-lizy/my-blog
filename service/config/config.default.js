/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');
const ipPort = require('./ipPort')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {


    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1595591733933_9337';

    // add your middleware config here
    config.middleware = [];

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    config.cors = {
        origin: ipPort.blog,//匹配规则  域名+端口  *则为全匹配
        credentials: true,
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    };

    config.multipart = {
        mode: 'file',
    };

    config.security = {
        csrf: false //暂时取消csrf安全防范
    };
    // config.view={
    //   // 如果还有其他模板引擎，需要合并多个目录
    //   root: path.join(appInfo.baseDir, 'app/assets'),
    // },

    config.mysql = {
        // database configuration
        client: {
            // host
            host: ipPort.ip,
            // port
            port: '3306',
            // username
            user: 'root',
            // password
            password: 'gouri123',
            // database
            database: 'my_blog',
        },
        // load into app, default is open
        app: true,
        // load into agent, default is close
        agent: false,
    };

    return {
        ...config,
        ...userConfig,
    };
};
