module.exports = options => {
  // 根据cookie和session判断登录状态
  return async function adminAuth(ctx, next) {
    // console.log('userId1111', ctx.session.userId);
    if (ctx.session.userId) {
      await next();
    } else {
      ctx.body = { data: 'no-login' };
    }
  };
};
