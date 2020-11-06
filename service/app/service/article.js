const Service = require('egg').Service;

class ArticleService extends Service {
    //随机生成唯一文章id
    async getRandomArticleId() {
        const {ctx, app} = this;
        try {
            //文章id生成规则：时间戳_随机十位数
            let articleId;
            let random = '';
            let timeStamp = new Date().getTime().toString()
            for (var i = 1; i <= 10; i++) {
                const num = Math.floor(Math.random() * 10);
                random += num;
            }
            articleId = `${timeStamp}_${random}`
            return {
                success: true,
                msg: '查询成功',
                articleId: articleId
            }
        } catch (e) {
            return {
                success: false,
                msg: '查询失败',
                code: e.toString(),
            }
        }
    }


    //根据条件获取文章列表数据
    async getArticleList(type, page, keywords) {
        const {ctx, app} = this;
        let sql;
        if (type) {
            if (keywords) {
                sql = 'SELECT * FROM `article_list` WHERE `title` LIKE ' + `'%${keywords}%'` + ' AND `type` = ' + `'${type}'` + ' ORDER BY `update_date` DESC ' + (page ? ' LIMIT ' + `${(page - 1) * 10}` + ', 10' : '')
            } else {
                sql = 'SELECT * FROM `article_list` WHERE `type` = ' + `'${type}'` + ' ORDER BY `update_date` DESC ' + (page ? ' LIMIT ' + `${(page - 1) * 10}` + ', 10' : '')
            }

        } else {
            if (keywords) {
                sql = 'SELECT * FROM `article_list` WHERE `title` LIKE ' + `'%${keywords}%'` + ' ORDER BY `update_date` DESC ' + (page ? ' LIMIT ' + `${(page - 1) * 10}` + ', 10' : '')
            } else {
                sql = 'SELECT * FROM `article_list` ' + ' ORDER BY `update_date` DESC ' + (page ? ' LIMIT ' + `${(page - 1) * 10}` + ', 10' : '')
            }
        }
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
                code: e.toString(),
            }
        }
    }

    //获取所有文章类型
    async getArticleType() {
        const {ctx, app} = this;
        try {
            let res = await app.mysql.query('SELECT * FROM `article_type` ORDER BY `id` LIMIT 0, 10');
            for (let [index, item] of res.entries()) {
                let total = await app.mysql.query('SELECT Count(*) FROM article_list WHERE article_list.type = ' + `'${item.name}'`);
                res[index].total = total[0]['Count(*)']
            }
            return {
                success: true,
                msg: '查询成功',
                results: res
            }
        } catch (e) {
            return {
                success: false,
                msg: '查询失败',
                code: e.toString(),
            }
        }


    }

    //根据文章id查文章数据（不包括详情内容）
    async getOtherMsgById(id) {
        const {ctx, app} = this;
        try {
            let res = await app.mysql.query('SELECT * FROM `article_list` WHERE `id` = ' + `'${id}'` + ' LIMIT 0, 1');
            return {
                success: true,
                msg: '查询成功',
                results: res
            }
        } catch (e) {
            return {
                success: false,
                msg: '查询失败',
                code: e.toString(),
            }
        }

    }

    //根据文章id获取详细内容
    async getArticleDetail(article_id, shoulUpdate) {
        const {ctx, app} = this;

        try {
            //获取当前文章详情内容
            let contentMsg = await app.mysql.query('SELECT * FROM `article_content` WHERE `article_id` = ' + `'${article_id}'` + ' LIMIT 0, 1');
            //获取当前文章其他信息
            let {results: otherMsg} = await ctx.service.article.getOtherMsgById(article_id)
            //是否更新浏览量
            if (shoulUpdate === 'true') {

                await ctx.service.article.updateArticleHotById(article_id, otherMsg[0].hot)
            }


            if (contentMsg.length && otherMsg.length) {
                return {
                    success: true,
                    msg: '查询成功',
                    results: [{
                        ...otherMsg[0],
                        ...contentMsg[0],

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
                code: e.toString(),
            }
        }

    }

    //根据文章id更新文章浏览量
    async updateArticleHotById(articleId, oldHot) {
        const numberOldHot = Number(oldHot)
        const {ctx, app} = this;
        try {
            let res = await app.mysql.query('UPDATE `article_list` SET `hot` = ' + `${numberOldHot + 1}` + ' WHERE `id` = ' + `'${articleId}'`);
            return {
                success: true,
                msg: '操作成功',
            }
        } catch (e) {
            return {
                success: false,
                msg: '操作失败',
                code: e.toString(),
            }
        }

    }


    //获取博客的文章总数量和总访问量
    async getArticleTotals() {
        const {ctx, app} = this;
        try {
            let articleTotal = await app.mysql.query('SELECT Count(*) FROM article_list');
            let hotTotal = await app.mysql.query('SELECT sum(hot) FROM article_list');
            return {
                success: true,
                msg: '查询成功',
                totals: {
                    hot: Number(hotTotal[0]['sum(hot)']),
                    article: Number(articleTotal[0]['Count(*)'])
                }
            }
        } catch (e) {
            return {
                success: false,
                msg: '查询失败',
                code: e.toString(),
            }
        }

    }


}

module.exports = ArticleService;
