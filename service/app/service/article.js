const Service = require('egg').Service;

class ArticleService extends Service {

    async getArticleList(type, page = 1) {
        const {ctx, app} = this;
        console.log('query', ctx.request.query);
        let sql = type ? 'SELECT * FROM `article_list` WHERE `type` = ' + `'${type}'` + ' LIMIT ' + `${(page - 1) * 10}` + ', 10' : 'SELECT * FROM `article_list` LIMIT ' + `${(page - 1) * 10}` + ', 10';
        try {
            let res = await app.mysql.query(sql);
            return {
                success: true,
                msg: '查询成功',
                results: res
            }
        } catch (e) {
            return {
                success: false,
                msg: '查询失败',
                code: e
            }
        }
    }

    //获取所有文章类型
    async getArticleType() {
        const {ctx, app} = this;
        try {
            let res = await app.mysql.query('SELECT * FROM `article_type` ORDER BY `id` LIMIT 0, 10');
            return {
                success: true,
                msg: '查询成功',
                results: res
            }
        } catch (e) {
            return {
                success: false,
                msg: '查询失败',
                code: e
            }
        }


    }

    //根据文章id查文章数据（不包括详情内容）
    async getOtherMsgById(id) {
        const {ctx, app} = this;
        try {
            let res = await app.mysql.query('SELECT * FROM `article_list` WHERE `id` = ' + `${id}` + ' LIMIT 0, 1');
            return {
                success: true,
                msg: '查询成功',
                results: res
            }
        } catch (e) {
            return {
                success: false,
                msg: '查询失败',
                code: e
            }
        }

    }

    async getArticleDetail(article_id) {
        const {ctx, app} = this;
        try {
            //获取当前文章详情内容
            let contentMsg = await app.mysql.query('SELECT * FROM `article_content` WHERE `article_id` = ' + `${article_id}` + ' LIMIT 0, 1');
            //获取当前文章其他信息
            let otherMsg = await app.mysql.query('SELECT * FROM `article_list` WHERE `id` = ' + `${article_id}` + ' LIMIT 0, 1');
            if (contentMsg.length && otherMsg.length) {
                return {
                    success: true,
                    msg: '查询成功',
                    results: [{
                        ...contentMsg[0],
                        title: otherMsg[0].title,
                        type: otherMsg[0].type,
                        hot: otherMsg[0].hot,
                        create_date: otherMsg[0].create_date,
                        update_date: otherMsg[0].update_date,
                    }]

                }
            } else {
                return {
                    success: false,
                    msg: '查询失败',
                    code: '数据出现空异常'
                }
            }
        } catch (e) {
            return {
                success: false,
                msg: '查询失败',
                code: e
            }
        }

    }
}

module.exports = ArticleService;
