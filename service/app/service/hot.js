const Service = require('egg').Service;

class HotService extends Service {
    async getHotList() {
        const {ctx, app} = this;
        let sql = 'SELECT * FROM `article_list` ORDER BY `hot` DESC LIMIT 0, 10';
        try {
            let res = await app.mysql.query(sql);
            return {
                success: true,
                msg: '查询成功',
                results: res
            }
        } catch (e) {
            return {
                success: true,
                msg: '查询失败',
                code: e
            }
        }


    }

}

module.exports = HotService;