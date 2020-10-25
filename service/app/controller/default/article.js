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
        const {type,page,keywords} = ctx.request.query
        let res = await ctx.service.article.getArticleList(type, page,keywords);
        ctx.body = res;
    }

    async getOtherMsgById() {
        const {ctx, app} = this;
        const {id} = ctx.request.query
        let res = await ctx.service.article.getOtherMsgById(id);
        ctx.body = res;
    }

    //获取博客的文章总数量和总访问量
    async getArticleTotals() {
        const {ctx, app} = this;
        let res = await ctx.service.article.getArticleTotals();
        ctx.body = res;
    }
}

module.exports = HomeController;
