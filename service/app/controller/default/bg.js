'use strict';

const Controller = require('egg').Controller;

// import { Controller } from 'egg'

class BgController extends Controller {
    //根据规则返回背景图片地址
    async getBgImage() {
        const {ctx, app} = this;
        let res = {}
        try {
            let day = String(new Date().getDate())
            res = {
                success: true,
                msg: '查询成功',
                path: `/files/bg/${day}.jpg`,
            }
        } catch (e) {
            res = {
                success: false,
                msg: '查询失败',
                code: e.toString()
            }
        }

        ctx.body = res;
    }


}

module.exports = BgController;
