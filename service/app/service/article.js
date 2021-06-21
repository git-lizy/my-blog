const Service = require('egg').Service;
const moment = require('moment');

class ArticleService extends Service {
  // 随机生成唯一文章id
  async getRandomArticleId() {
    const { ctx, app } = this;
    try {
      // 文章id生成规则：时间戳_随机十位数
      let articleId;
      let random = '';
      const timeStamp = new Date().getTime().toString();
      for (let i = 1; i <= 10; i++) {
        const num = Math.floor(Math.random() * 10);
        random += num;
      }
      articleId = `${timeStamp}_${random}`;
      return {
        success: true,
        msg: '查询成功',
        articleId,
      };
    } catch (e) {
      return {
        success: false,
        msg: '查询失败',
        code: e.toString(),
      };
    }
  }

  // 根据条件获取文章列表数据
  async getArticleList(type, page, keywords, userId) {
    const { ctx, app } = this;
    let sql;
    let where = 'WHERE 1=1'
    if (userId) where += ` AND userId = ${userId}` 
    else where += ` AND visible = 1`

    if (type) where += ` AND type = '${type}'`

    if (keywords) where += ` AND title LIKE '%${keywords}%'`
  
    sql = 'SELECT * FROM `article_list` ' + where + ' ORDER BY `update_date` DESC ' + (page ? ' LIMIT ' + `${(page - 1) * 10}` + ', 10' : '');
    // if (type) {
    //   if (keywords) {
    //     sql = 'SELECT * FROM `article_list` WHERE `title` LIKE ' + `'%${keywords}%'` + ' AND  `userId` = ' + `'${userId}'` + ' `type` = ' + `'${type}'` + ' ORDER BY `update_date` DESC ' + (page ? ' LIMIT ' + `${(page - 1) * 10}` + ', 10' : '');
    //   } else {
    //     sql = 'SELECT * FROM `article_list` WHERE `type` = ' + `'${type}'` + ' AND `userId` = ' + `'${userId}'` + ' ORDER BY `update_date` DESC ' + (page ? ' LIMIT ' + `${(page - 1) * 10}` + ', 10' : '');
    //   }

    // } else {
    //   if (keywords) {
    //     sql = 'SELECT * FROM `article_list` WHERE `title` LIKE ' + `'%${keywords}%'` + ' ORDER BY `update_date` DESC ' + (page ? ' LIMIT ' + `${(page - 1) * 10}` + ', 10' : '');
    //   } else {
    //     sql = 'SELECT * FROM `article_list` ' + ' ORDER BY `update_date` DESC ' + (page ? ' LIMIT ' + `${(page - 1) * 10}` + ', 10' : '');
    //   }
    // }
    try {
      const res = await app.mysql.query(sql);
      return {
        success: true,
        msg: '查询成功',
        results: res,
      };
    } catch (e) {
      return {
        success: false,
        msg: '查询失败',
        code: e.toString(),
        sql
      };
    }
  }

  async addFavour() {
    const { ctx, app } = this;
    const conn = await app.mysql.beginTransaction();
    const { id, favour } = ctx.request.body;
    let res = null
    let sql = 'UPDATE `article_list` SET `favour` = ' + `${favour}` + ' WHERE `id` = ' + `'${id}'`
    try {
      await conn.query(sql);
      // 提交事务
      await conn.commit();
      res = {
        success: true,
        msg: '操作成功',
      };
    } catch (error) {
      res = {
        success: false,
        sql,
        msg: '操作失败',
        code: error.toString(),
      };
    }
    return res
  }

  // 获取所有文章类型
  async getArticleType(code, keywords) {
    const { ctx, app } = this;
    let where = ' WHERE 1=1 '
    if (code) where += `AND code = '${code}'`
    if (keywords) where += `AND code LIKE '${keywords}' OR name LIKE '${keywords}' `
    if (!code && !keywords) where = ''

    try {
      const res = await app.mysql.query('SELECT * FROM `article_type` '+where+' ORDER BY `id` LIMIT 0, 10');
      for (const [ index, item ] of res.entries()) {
        const total = await app.mysql.query('SELECT Count(*) FROM article_list WHERE article_list.type = ' + `'${item.name}'`);
        res[index].total = total[0]['Count(*)'];
      }
      return {
        success: true,
        msg: '查询成功',
        results: res,
      };
    } catch (e) {
      return {
        success: false,
        msg: '查询失败',
        code: e.toString(),
      };
    }
  }

  // 根据文章类型Id删除
  async deleteArticleType() {
    const { ctx, app } = this;
    // 创建mysql事务
    const conn = await app.mysql.beginTransaction();
    let { Id } = ctx.request.body
    let res = {}
    let sql = 'DELETE FROM `article_type` WHERE `id` = ' + `${Id}`
    try {
      await app.mysql.query(sql)
      res = {
        success: true,
        msg: '操作成功',
      };
    } catch (error) {
       // 回滚事务
      await conn.rollback();
      res = {
        success: false,
        msg: '操作失败',
        sql,
        code: error.toString(),
      };
    }
    return res;
  }

  // 编辑文章类型
  async updateArticleType() {
    const { ctx, app } = this
    // 创建mysql事务
    const conn = await app.mysql.beginTransaction();
    const { id, code, name, remark } = ctx.request.body;

    let res = null
    let sql = 'UPDATE `article_type` SET `code` = ' + `'${code}'` + ', `name` = ' + `'${name}'` + ', `remark` = ' + `'${remark}'` + ',`update_date` = ' + `'${moment().format('YYYY-MM-DD HH:mm:ss')}'` + ' WHERE `id` = ' + `${id}`
    try {
      await conn.query(sql);
      // 提交事务
      await conn.commit();
      res = {
        success: true,
        msg: '操作成功',
      };
    } catch (e) {
      // 回滚事务
      //await conn.rollback();
      res = {
        success: false,
        sql,
        msg: '操作失败',
        code: e.toString(),
      };
    }
    return res;
  }

  // 新增文章类型
  async addArticleType() {
    const { ctx, app } = this;
    // 创建mysql事务
    const conn = await app.mysql.beginTransaction();
    const { code, name, remark } = ctx.request.body
    let res = null, sql = `INSERT INTO article_type (code, name, remark) VALUES ('${code}', '${name}', '${remark}')`;
    try {
      await conn.query(sql)
      await conn.commit()
      res = {
        success: true,
        msg: '新增成功',
      }
    } catch (error) {
      // 回滚事务
      //await conn.rollback();
      res = {
        success: false,
        msg: '操作失败',
        sql,
        code: error.toString(),
      };
    }
    return res;
  }

  // 根据文章id查文章数据（不包括详情内容）
  async getOtherMsgById(id) {
    const { ctx, app } = this;
    try {
      const res = await app.mysql.query('SELECT * FROM `article_list` WHERE `id` = ' + `'${id}'` + ' LIMIT 0, 1');
      return {
        success: true,
        msg: '查询成功',
        results: res,
      };
    } catch (e) {
      return {
        success: false,
        msg: '查询失败',
        code: e.toString(),
      };
    }

  }

  // 根据文章id获取详细内容
  async getArticleDetail(article_id, shoulUpdate) {
    const { ctx, app } = this;

    try {
      // 获取当前文章详情内容
      const contentMsg = await app.mysql.query('SELECT * FROM `article_content` WHERE `article_id` = ' + `'${article_id}'` + ' LIMIT 0, 1');
      // 获取当前文章其他信息
      const { results: otherMsg } = await ctx.service.article.getOtherMsgById(article_id);
      // 是否更新浏览量
      if (shoulUpdate === 'true') {

        await ctx.service.article.updateArticleHotById(article_id, otherMsg[0].hot);
      }


      if (contentMsg.length && otherMsg.length) {
        return {
          success: true,
          msg: '查询成功',
          results: [{
            ...otherMsg[0],
            ...contentMsg[0],

          }],

        };
      }
      return {
        success: false,
        msg: '查询失败',
        code: '数据出现空异常',
      };


    } catch (e) {
      return {
        success: false,
        msg: '查询失败',
        code: e.toString(),
      };
    }

  }

  // 根据文章id更新文章浏览量
  async updateArticleHotById(articleId, oldHot) {
    const numberOldHot = Number(oldHot);
    const { ctx, app } = this;
    try {
      const res = await app.mysql.query('UPDATE `article_list` SET `hot` = ' + `${numberOldHot + 1}` + ' WHERE `id` = ' + `'${articleId}'`);
      return {
        success: true,
        msg: '操作成功',
      };
    } catch (e) {
      return {
        success: false,
        msg: '操作失败',
        code: e.toString(),
      };
    }

  }

  // 获取博客的文章总数量和总访问量
  async getArticleTotals(userId) {
    const { ctx, app } = this;
    let where = ''
    if (userId) {
      where += `WHERE userId = ${userId}`
    } else where += `WHERE visible = 1`
    try {
      const Total = await app.mysql.query(`SELECT Count(*), sum(hot) FROM article_list ${where}`);
      return {
        success: true,
        msg: '查询成功',
        totals: {
          hot: Number(Total[0]['sum(hot)']),
          article: Number(Total[0]['Count(*)']),
        },
      };
    } catch (e) {
      return {
        success: false,
        msg: '查询失败',
        code: e.toString(),
      };
    }

  }

}

module.exports = ArticleService;
