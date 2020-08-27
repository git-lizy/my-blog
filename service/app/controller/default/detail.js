'use strict';

const Controller = require('egg').Controller;
// import { Controller } from 'egg'

class DetailController extends Controller {
    async getArticleDetail() {
        const { ctx,app } = this;
        let id= ctx.request.query.id
        let res = await ctx.service.article.getArticleDetail(id)
        ctx.body = res;
    }

}

module.exports = DetailController;
