'use strict';

const Controller = require('egg').Controller;
// import { Controller } from 'egg'

class RecommendController extends Controller {
    async getRecommendList() {
        const { ctx,app } = this;
        let res = await ctx.service.recommend.getRecommendList()
        ctx.body = res;
    }

}

module.exports = RecommendController;
