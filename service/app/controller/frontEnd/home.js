'use strict';

const Controller = require('egg').Controller;
// import { Controller } from 'egg'

class HomeController extends Controller {
    async getArticleType() {
        const { ctx,app } = this;
        let res = await app.mysql.query('SELECT * FROM `article_type` ORDER BY `id` LIMIT 0, 1000')
        ctx.body = res;
    }
    async getArticleList() {
        const { ctx,app } = this;
        let res = await app.mysql.query('SELECT * FROM `article_list` ORDER BY `id` LIMIT 0, 1000')
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
