'use strict';

const Controller = require('egg').Controller;
// import { Controller } from 'egg'

class HomeController extends Controller {
    async getArticleType() {
        const { ctx,app } = this;

        let res = await app.mysql.query('SELECT * FROM `article_type` ORDER BY `id` LIMIT 0, 10')
        ctx.body = res;
    }
    async getArticleList() {
        const { ctx,app } = this;
        console.log('query',ctx.request.query.type)
        let type= ctx.request.query.type
        let sql = type?'SELECT * FROM `article_list` WHERE `type` = '+`'${type}'`+' LIMIT 0, 10':'SELECT * FROM `article_list` LIMIT 0, 10'
        let res = await app.mysql.query(sql)
        ctx.body = res;
    }

    // async getLocations() {
    //     const { ctx,app } = this;
    //     console.log('ress',ctx.params)
    //     // let res = await app.mysql.query('SELECT * FROM `article_list` ORDER BY `id` LIMIT 0, 1000')
    //     ctx.body = {};
    // }
}

module.exports = HomeController;
