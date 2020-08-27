const Service = require('egg').Service;

class HotService extends Service {
    async getHotList() {
        const { ctx,app } = this;
        let sql = 'SELECT * FROM `article_list` ORDER BY `hot` DESC LIMIT 0, 10'
        let res = await app.mysql.query(sql)
        return res
    }

}

module.exports = HotService;
