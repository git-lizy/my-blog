/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');
const ipPort = require('./ipPort');
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
    // 跨域资源共享
  config.cors = {
    // origin: ipPort.blog,//匹配规则  域名+端口  *则为全匹配
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  // 文件上传获取文件对象的配置
  config.multipart = {
    mode: 'file',
  };

  config.security = {
    csrf: false, // 暂时取消csrf安全防范
    domainWhiteList: [ ipPort.admin, ipPort.blog ], // 配置白名单（配置后可跨域携带cookie）
  };


  config.mysql = {
    // database configuration
    client: {
      // host
      host: 'localhost',
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
  // 配置静态资源目录
  config.static = {
    prefix: '/files',
    dir: path.resolve(appInfo.baseDir, '../files'), // `String` or `Array:[dir1, dir2, ...]` 静态化目录,可以设置多个静态化目录
  };

  return {
    ...config,
    ...userConfig,
  };
};
