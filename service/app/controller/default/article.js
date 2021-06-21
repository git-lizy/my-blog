'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 获取文章类型数据源
  async getArticleType() {
    const { ctx, app } = this;
    const { code, keywords } = ctx.request.query;
    const res = await ctx.service.article.getArticleType(code, keywords);
    ctx.body = res;
  }

  async deleteArticleType() {
    const { ctx, app } = this;
    const res = await ctx.service.article.deleteArticleType();
    ctx.body = res;
  }

  async updateArticleType() {
    const { ctx, app } = this;
    const res = await ctx.service.article.updateArticleType();
    ctx.body = res;
  }

  async addArticleType() {
    const { ctx, app } = this;
    const res = await ctx.service.article.addArticleType();
    ctx.body = res;
  }

  // 获取文章列表数据源
  async getArticleList() {
    const { ctx, app } = this;
    // console.log('query', ctx.request.query);
    const { type, page, keywords, userId } = ctx.request.query;
    const res = await ctx.service.article.getArticleList(type, page, keywords, userId);
    ctx.body = res;
  }

  // 获取指定文章其他信息（不含文章具体内容）
  async getOtherMsgById() {
    const { ctx, app } = this;
    const { id } = ctx.request.query;
    const res = await ctx.service.article.getOtherMsgById(id);
    ctx.body = res;
  }

  // 获取博客的文章总数量和总访问量
  async getArticleTotals() {
    const { ctx, app } = this;
    const { userId } = ctx.request.query;
    const res = await ctx.service.article.getArticleTotals(userId);
    ctx.body = res;
  }
}

module.exports = HomeController;
