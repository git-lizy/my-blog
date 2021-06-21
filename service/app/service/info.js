const Service = require('egg').Service;

class InfoService extends Service {
    async getInfo() {
        const { ctx, app } = this;
        const { account } = ctx.request.query;
        let where = `WHERE account = '${account}' AND visible = 1`
        if (account !== 'admin') {
            where = `WHERE account = '${account}'`
        }
        let sql = 'SELECT * FROM `admin_user`' +where+ ' LIMIT 1'
        const InfoList = await app.mysql.query(sql);

        if (InfoList.length) {
            return {
                success: true,
                info: {
                    account: account,
                    userId: account === 'admin' ? '' : InfoList[0].Id, 
                    username: InfoList[0].username,
                    wechat: InfoList[0].wechat || '',
                    QQ: InfoList[0].QQ || '',
                    github:InfoList[0].github || '',
                    keywords:InfoList[0].keywords,
                    description:InfoList[0].description,
                    sendword:InfoList[0].sendword,
                },
                msg: '获取用户信息成功'
            };
        } else {
            return { success: false, app, sql, msg: '获取用户信息失败', code: '无此账号' };
        }
    }
}

module.exports = InfoService;