//配置异步请求或者访问资源可能用到的服务器ip
const serviceIpPort = process.env.NODE_ENV==='production'?'':'http://localhost:7001';
export default serviceIpPort
