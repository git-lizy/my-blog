const Service = require('egg').Service;
const fs = require('mz/fs');
const path = require('path')

class FileService extends Service {
    //上传
    async upload(file,articleId) {
        // console.log('file', file);
        const {ctx, app} = this;
        let res = {};
        try {
            if(!articleId){
                throw '缺失参数articleId'
            }
            //读取文件
            let fileContent = await fs.readFile(file.filepath);
            let type = file.filepath.slice(file.filepath.lastIndexOf('.')+1)

            //判断对应文件夹是否已创建，没有则创建
            let isExisted = !!fs.existsSync(path.resolve(__dirname,`../../../files/${articleId}`));

            if(!isExisted){
                await fs.mkdir(path.resolve(__dirname,`../../../files/${articleId}`))
            }
            //设置命名规则并写入文件
            const timestamp = new Date().getTime()
            const servicePath = path.resolve(__dirname,`../../../files/${articleId}`)+`/${timestamp}.${type}`
            await fs.writeFile(servicePath, fileContent);
            res = {
                success: true,
                msg: '上传成功',
                path: `/files/${articleId}/${timestamp}.${type}`
            }
        } catch (e) {
            res = {
                success: false,
                msg: '上传失败',
                code: e.toString(),
            }
        }

        return res
    }

    //删除
    async delete(filePath,type) {
        //type,删除类型，默认为file文件，还可选directory表示文件夹（此时filepath传articleId）
        const {ctx, app} = this;
        let res = {};
        try {
            if(!filePath){
                throw '缺失参数：oldPath'
            }
            if(type==='file'){
                // console.log('kkkk')
                await fs.unlink(path.resolve(__dirname,`../../../`)+filePath)
            }else if(type==='directory'){
                // console.log('xxxx')
                //递归删除文件夹以及其文件
                await fs.rmdir(path.resolve(__dirname,`../../../files/`)+filePath,{recursive:true})
            }

            res = {
                success: true,
                msg: '删除成功',
                path: filePath
            }

        } catch (e) {
            res = {
                success: false,
                msg: '删除失败',
                code: e.toString(),
            }
        }
        return res
    }

}

module.exports = FileService;
