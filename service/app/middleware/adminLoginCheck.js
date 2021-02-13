// eslint-disable-next-line strict
module.exports = (options, app) => {
  // 根据cookie和session判断登录状态
  return async function adminAuth(ctx, next) {
    if (ctx.session.userId) {
      // 说明有保存的登录状态
      // 查询表中是否存在该sessionId值
      const sql = 'SELECT * FROM `admin_user` WHERE `session_id` = ' + `'${ctx.session.userId}'` + ' LIMIT 0, 10';
      const res = await app.mysql.query(sql);
      // console.log('res',res)
      if (res.length) {
        // 存在,则登录状态仍可用
        await next();
      } else {
        // 不存在，则说明当前账号登录状态已失效（被后来的异地登录顶下线了）
        console.log('被顶了');
        ctx.body = { data: 'no-login' };
      }
    } else {
      ctx.body = { data: 'no-login' };
    }
  };
};
