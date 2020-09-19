'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class ArticleController extends Controller {

    async getArticleList() {
        const {ctx, app} = this;
        console.log('query', ctx.request.query);
        let type = ctx.request.query.type;
        let page = ctx.request.query.page;
        let res = await ctx.service.article.getArticleList(type, page);
        ctx.body = res;
    }

}

module.exports = ArticleController;
