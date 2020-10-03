const Service = require('egg').Service;

class ArticleService extends Service {

    async getArticleList(type, page = 1,keywords) {
        const {ctx, app} = this;
        // console.log('query', ctx.request.query);
        let sql;
        if(type){
            sql = 'SELECT * FROM `article_list` WHERE `type` = ' + `'${type}'` + ' LIMIT ' + `${(page - 1) * 10}` + ', 10'
        }else{
            if(keywords){
                sql = 'SELECT * FROM `article_list` WHERE `title` LIKE '+ `'%${keywords}%'`+'LIMIT ' + `${(page - 1) * 10}` + ', 10'
            }else{
                sql = 'SELECT * FROM `article_list` LIMIT ' + `${(page - 1) * 10}` + ', 10'
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

    async getArticleDetail(article_id,shoulUpdate) {
        const {ctx, app} = this;
        try {
            //获取当前文章详情内容
            let contentMsg = await app.mysql.query('SELECT * FROM `article_content` WHERE `article_id` = ' + `${article_id}` + ' LIMIT 0, 1');
            //获取当前文章其他信息
            let otherMsg = await app.mysql.query('SELECT * FROM `article_list` WHERE `id` = ' + `${article_id}` + ' LIMIT 0, 1');
            //是否更新浏览量
            if(shoulUpdate==='true'){
                await ctx.service.article.updateArticleHotById(article_id,otherMsg[0].hot)
            }

            if (contentMsg.length && otherMsg.length) {
                return {
                    success: true,
                    msg: '查询成功',
                    results: [{
                        ...contentMsg[0],
                        // article_id:otherMsg[0].id,
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

    //根据文章id更新文章浏览量
    async updateArticleHotById(articleId,oldHot) {
        const numberOldHot = Number(oldHot)
        const {ctx, app} = this;
        try {
            let res = await app.mysql.query('UPDATE `article_list` SET `hot` = ' + `${numberOldHot+1}` +' WHERE `id` = '+`${articleId}`);
            // console.log('res',res)
            return {
                success: true,
                msg: '操作成功',
            }
        } catch (e) {
            console.log('e',e)
            return {
                success: false,
                msg: '操作失败',
                code: e
            }
        }

    }
}

module.exports = ArticleService;
