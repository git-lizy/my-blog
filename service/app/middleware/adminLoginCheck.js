module.exports = options => {
    return async function adminAuth(ctx, next) {
        console.log('userId1111', ctx.session.userId);
        if (ctx.session.userId) {
            await next()
        } else {
            ctx.body = {data: 'no-login'}
        }
    };
};
