'use strict';

const Controller = require('egg').Controller;


class FileController extends Controller {
  // 上传
  async upload() {
    const { ctx, app } = this;
    const { articleId } = ctx.request.body;
    const file = ctx.request.files[0];
    const uploadRes = await ctx.service.file.upload(file, articleId);
    ctx.body = uploadRes;
  }

  // 删除
  async delete() {
    const { ctx, app } = this;
    const { oldPath, type = 'file' } = ctx.request.body;
    const res = await ctx.service.file.delete(oldPath, type);

    ctx.body = res;
  }
}

module.exports = FileController;
