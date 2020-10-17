const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/admin', {
        target: 'http://localhost:7001/'
    }));
    app.use(proxy('/default', {
        target: 'http://localhost:7001/'
    }));
};
