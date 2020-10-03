'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class HomeController extends Controller {
    async getArticleType() {
        const {ctx, app} = this;
        let res = await ctx.service.article.getArticleType();
        ctx.body = res;
    }

    async getArticleList() {
        const {ctx, app} = this;
        console.log('query', ctx.request.query);
        let type = ctx.request.query.type;
        let page = ctx.request.query.page;
        let keywords = ctx.request.query.keywords;
        let res = await ctx.service.article.getArticleList(type, page,keywords);
        ctx.body = res;
    }

    async getOtherMsgById() {
        const {ctx, app} = this;
        let id = ctx.request.query.id;
        let res = await ctx.service.article.getOtherMsgById(id);
        ctx.body = res;
    }


}

module.exports = HomeController;
