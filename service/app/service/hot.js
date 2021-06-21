const Service = require('egg').Service;

class HotService extends Service {
  // 获取热门文章
  async getHotList() {
    const { ctx, app } = this;
    const { userId } = ctx.request.body
    let where = ''
    if (userId) where = 'WHERE userId = '+ `'${userId}'`
    const sql = 'SELECT * FROM `article_list`'+ where + 'ORDER BY `hot` DESC LIMIT 0, 10';
    try {
      const res = await app.mysql.query(sql);
      return {
        success: true,
        msg: '查询成功',
        results: res,
      };
    } catch (e) {
      return {
        success: true,
        msg: '查询失败',
        code: e.toString(),
      };
    }


  }

}

module.exports = HotService;
