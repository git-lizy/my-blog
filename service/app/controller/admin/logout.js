'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class LogoutController extends Controller {
  // 退出登录
  async index() {
    const { ctx, app } = this;
    const { userId = '' } = ctx.request.body;
    const ExsitedList = await app.mysql.query('SELECT * FROM `admin_user` WHERE `id` = ' + `${userId}` + ' LIMIT 0, 10');

    if (ExsitedList.length) {
        // 更新该用户在表中的sessionId
        await app.mysql.query('UPDATE `admin_user` SET `session_id` = ' + `''` + ' WHERE `id` = ' + `${userId}`);
        ctx.body = { success: true, msg: '退出登录成功' };
    } else {
        ctx.body = { success: false, msg: '退出登录失败' };
    }
  }
}

module.exports = LogoutController;