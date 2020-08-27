const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/admin', {
        target: 'http://localhost:7002/'
    }));
};
