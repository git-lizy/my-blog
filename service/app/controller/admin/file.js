'use strict';

const Controller = require('egg').Controller;


class FileController extends Controller {
    async upload() {
        const {ctx, app} = this;
        const { articleId ,isCover,oldPath} = ctx.request.body
        const file = ctx.request.files[0]
        console.log('fileeee',file)
        let uploadRes = await ctx.service.file.upload(file,articleId);
        // if(isCover){
        //     //如果当前是上传封面，则删除旧有封面
        //     oldPath && await ctx.service.file.delete(oldPath);
        // }

        ctx.body = uploadRes
    }

    async delete() {
        const {ctx, app} = this;
        const { oldPath,type='file' } = ctx.request.body

        let res = await ctx.service.file.delete(oldPath,type);

        ctx.body = res
    }
}

module.exports = FileController;
