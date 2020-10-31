'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class HomeController extends Controller {
    //获取文章类型数据源
    async getArticleType() {
        const {ctx, app} = this;
        let res = await ctx.service.article.getArticleType();
        ctx.body = res;
    }

    //获取文章列表数据源
    async getArticleList() {
        const {ctx, app} = this;
        // console.log('query', ctx.request.query);
        const {type, page, keywords} = ctx.request.query
        let res = await ctx.service.article.getArticleList(type, page, keywords);
        ctx.body = res;
    }

    //获取指定文章其他信息（不含文章具体内容）
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
