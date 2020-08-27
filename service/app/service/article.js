const Service = require('egg').Service;

class ArticleService extends Service {
    async getArticleList(type,page=1) {
        const { ctx,app } = this;
        console.log('query',ctx.request.query)
        let sql = type?'SELECT * FROM `article_list` WHERE `type` = '+`'${type}'`+' LIMIT '+`${(page-1)*10}`+', 10':'SELECT * FROM `article_list` LIMIT '+`${(page-1)*10}`+', 10'
        let res = await app.mysql.query(sql)
        return res
    }
    async getArticleType() {
        const { ctx,app } = this;
        let res = await app.mysql.query('SELECT * FROM `article_type` ORDER BY `id` LIMIT 0, 10')
        return res
    }
    async getArticleDetail(article_id) {
        const { ctx,app } = this;
        let res = await app.mysql.query('SELECT * FROM `article_content` WHERE `article_id` = '+`${article_id}`+' LIMIT 0, 1')
        return res
    }
}

module.exports = ArticleService;
