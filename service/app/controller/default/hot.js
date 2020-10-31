'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class HotController extends Controller {
    //获取热门文章内容
    async getHotList() {
        const {ctx, app} = this;
        let res = await ctx.service.hot.getHotList();
        ctx.body = res;
    }

}

module.exports = HotController;
