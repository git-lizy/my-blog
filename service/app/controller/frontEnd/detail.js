'use strict';

const Controller = require('egg').Controller;
// import { Controller } from 'egg'

class DetailController extends Controller {
    async getArticleDetail() {
        const { ctx,app } = this;
        let id= ctx.request.query.id
        let res = await app.mysql.query('SELECT * FROM `article_list` WHERE `id` = '+`${id}`+' LIMIT 0, 1')
        ctx.body = res;
    }



}

module.exports = DetailController;
