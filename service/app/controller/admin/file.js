'use strict';

const Controller = require('egg').Controller;


class FileController extends Controller {
    async upload() {
        const {ctx, app} = this;
        let file = ctx.request.files[0];
        let res = await ctx.service.file.upload(file);

        ctx.body = res
    }
}

module.exports = FileController;
