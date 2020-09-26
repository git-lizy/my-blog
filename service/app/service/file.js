const Service = require('egg').Service;
const fs = require('mz/fs');

class FileService extends Service {
    //上传
    async upload(file) {
        console.log('file', file);
        const {ctx, app} = this;
        let res = {};
        try {
            //读取文件
            let fileContent = await fs.readFile(file.filepath);
            //写入文件
            const timestamp = new Date().getTime()
            await fs.writeFile(`app/public/${timestamp}.png`, fileContent);
            res = {
                success: true,
                msg: '上传成功',
                path: `/public/${timestamp}.png`
            }
        } catch (e) {
            res = {
                success: false,
                msg: '上传失败',
                code: e,
            }
        }

        return res
    }

    async delete() {
        const {ctx, app} = this;
        // let sql = 'SELECT * FROM `article_list` ORDER BY `hot` DESC LIMIT 0, 10'
        // let res = await app.mysql.query(sql)
        return res
    }

}

module.exports = FileService;
