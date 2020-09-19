'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class HotController extends Controller {
    async getHotList() {
        const {ctx, app} = this;
        let res = await ctx.service.hot.getHotList();
        ctx.body = res;
    }

}

module.exports = HotController;
