let blog,service,admin,ip
if(process.env.NODE_ENV==='production'){
    ip='47.95.223.83'
    blog = 'http://'+ip+':80'
    service='http://'+ip+':8081'
    admin = 'http://'+ip+':8082'
}else{
    ip='localhost'
    blog = 'http://'+ip+':3000'
    service='http://'+ip+':7001'
    admin = 'http://'+ip+':3001'
}
module.exports = {
    ip,
    blog,
    service,
    admin
}
