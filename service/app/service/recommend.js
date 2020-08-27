const Service = require('egg').Service;

class RecommendService extends Service {
    async getRecommendList() {
        const { ctx,app } = this;
        let sql = 'SELECT * FROM `article_list` ORDER BY `recommend` DESC LIMIT 0, 10'
        let res = await app.mysql.query(sql)
        return res
    }

}

module.exports = RecommendService;
