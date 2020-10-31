'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class LoginController extends Controller {
    //登录
    async index() {
        const {ctx, app} = this;
        // console.log('body', ctx.request.body);
        const {account = '', password = '', remember = ''} = ctx.request.body;
        let ExsitedList = await app.mysql.query('SELECT * FROM `admin_user` WHERE `account` = ' + `'${account}'` + ' AND `password` = ' + `'${password}'` + ' LIMIT 0, 10');

        if (ExsitedList.length) {
            //存在此用户
            //记住用户
            if (remember) {
                ctx.session.userId = ExsitedList[0].id;
                // console.log('ctx.session.userId', ctx.session.userId);
                ctx.body = {success: true, msg: '登录成功'};
            } else {
                ctx.body = {success: true, msg: '登录成功'};
            }

        } else {
            ctx.body = {success: false, msg: '登录失败', code: '无此账号'};
        }

    }
}

module.exports = LoginController;
