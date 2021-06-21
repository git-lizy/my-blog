'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');


class ArticleController extends Controller {
  // 获取文章列表
  async getArticleList() {
    const { ctx, app } = this;
    const { userId, type, page, keywords } = ctx.request.query;
    const res = await ctx.service.article.getArticleList(userId, type, page, keywords);
    ctx.body = res;
  }

  // 获取随机文章id
  async getRandomArticleId() {
    const { ctx, app } = this;
    const res = await ctx.service.article.getRandomArticleId();
    ctx.body = res;
  }

  // 发布新文章
  async releaseArticle() {
    const { ctx, app } = this;
    // 创建mysql事务
    const conn = await app.mysql.beginTransaction();
    const { userId, articleId, title, type, content, introduce, visible } = ctx.request.body;

    let res = {};

    try {
      // 写入其他信息
      const addOtherMsgRes = await conn.query(
        'INSERT INTO `article_list`(`id`,`userId`,`title`, `type`, `introduce`, `hot`, `visible`, `create_date`, `update_date`) VALUES (' +
                `${articleId}` + ',  ' + `${userId}` + ', ' + `'${title}'` + ', ' + `'${type}'` + ', ' + `'${introduce}'` + ',' + '0' + ',' + `'${visible}'` + ', ' + `'${moment().format('YYYY-MM-DD HH:mm:ss')}'` + ', ' + `'${moment().format('YYYY-MM-DD HH:mm:ss')}'`
                + ')');
      // 写入文章详情数据
      const addContentRes = await conn.query(
        'INSERT INTO `article_content`(`article_id`,`content`) VALUES ('
                + `'${articleId}'` + ', ' + `'${content}'`
                + ')');
      // 提交事务
      await conn.commit();
      res = {
        success: true,
        msg: '操作成功',
        articleId,
      };

    } catch (e) {
      // 回滚事务
      await conn.rollback();
      res = {
        success: false,
        msg: '操作失败',
        code: e.toString(),
      };
    }
    ctx.body = res;
  }

  // 编辑更新文章
  async updateArticle() {
    const { ctx, app } = this;
    // 创建mysql事务
    const conn = await app.mysql.beginTransaction();
    const { articleId, title, type, content, introduce, visible } = ctx.request.body;

    let res = {};
    try {

      // 更新 其他信息
      const updateOtherMsgRes = await conn.query('UPDATE `article_list` SET `title` = ' + `'${title}'` + ', `type` = ' + `'${type}'` + ', `introduce` = ' + `'${introduce}'` + ', `visible` = ' + `'${visible}'` + ', `update_date` = ' + `'${moment().format('YYYY-MM-DD HH:mm:ss')}'` + ' WHERE `id` = ' + `'${articleId}'`);
      // 更新文章详情数据
      const updateContentRes = await conn.query('UPDATE `article_content` SET `content` = ' + `'${content}'` + ' WHERE `article_id` = ' + `'${articleId}'`);
      // 提交事务
      await conn.commit();
      res = {
        success: true,
        msg: '操作成功',
        articleId,
      };
    } catch (e) {
      // 回滚事务
      await conn.rollback();
      res = {
        success: false,
        msg: '操作失败',
        code: e.toString(),
      };
    }
    ctx.body = res;

  }

  // 删除文章
  async deleteArticle() {
    const { ctx, app } = this;
    // 创建mysql事务
    const conn = await app.mysql.beginTransaction();
    const { articleId } = ctx.request.body;
    let res = {};
    try {

      // 删除其他信息
      await conn.query('DELETE FROM `article_list` WHERE `id` = ' + `'${articleId}'`);
      // 删除详情信息
      await conn.query('DELETE FROM `article_content` WHERE `article_id` = ' + `'${articleId}'`);
      // 提交事务
      await conn.commit();
      // 删除对应文章相关的图片静态资源
      await ctx.service.file.delete(articleId, 'directory');
      res = {
        success: true,
        msg: '操作成功',
        articleId,
      };
    } catch (e) {
      // 回滚事务
      await conn.rollback();
      res = {
        success: false,
        msg: '操作失败',
        code: e.toString(),
      };
    }
    ctx.body = res;

  }

  // 获取文章详情
  async getArticleDetail() {
    const { ctx, app } = this;
    const { id, update } = ctx.request.query;
    const res = await ctx.service.article.getArticleDetail(id, update);
    ctx.body = res;
  }

}

module.exports = ArticleController;
