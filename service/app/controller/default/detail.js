'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class DetailController extends Controller {
  // 获取文章具体内容
  async getArticleDetail() {
    const { ctx, app } = this;
    const { id, update } = ctx.request.query;
    const res = await ctx.service.article.getArticleDetail(id, update);
    ctx.body = res;
  }

  // 增加文章点赞次数
  async addFavour() {
    const { ctx, app } = this;
    const res = await ctx.service.article.addFavour();
    ctx.body = res;
  }

}

module.exports = DetailController;
