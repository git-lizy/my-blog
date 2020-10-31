'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class DetailController extends Controller {
    //获取文章具体内容
    async getArticleDetail() {
        const {ctx, app} = this;
        const {id,update} = ctx.request.query
        let res = await ctx.service.article.getArticleDetail(id,update);
        ctx.body = res;
    }

}

module.exports = DetailController;
