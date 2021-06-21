'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class UserInfoController extends Controller {
  // 获取用户信息
  async index() {
    const { ctx, app } = this;
    const res = await ctx.service.info.getInfo();

    ctx.body = res;
  }
}

module.exports = UserInfoController;
