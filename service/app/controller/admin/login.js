'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class LoginController extends Controller {
  // 登录
  async index() {
    const { ctx, app } = this;
    const { account = '', password = '', remember = '' } = ctx.request.body;
    const ExsitedList = await app.mysql.query('SELECT * FROM `admin_user` WHERE `account` = ' + `'${account}'` + ' AND `password` = ' + `'${password}'` + ' LIMIT 0, 10');

    if (ExsitedList.length) {
      // 存在此用户
      // 记住用户
      if (remember) {
        const sessionId = `${ExsitedList[0].account}_${new Date().getTime()}`;
        ctx.session.userId = sessionId;
        // 更新该用户在表中的sessionId
        await app.mysql.query('UPDATE `admin_user` SET `session_id` = ' + `'${sessionId}'` + ' WHERE `account` = ' + `'${ExsitedList[0].account}'`);
        ctx.body = { success: true, msg: '登录成功' };
      } else {
        ctx.body = { success: true, msg: '登录成功' };
      }

    } else {
      ctx.body = { success: false, msg: '登录失败', code: '无此账号' };
    }

  }
}

module.exports = LoginController;
