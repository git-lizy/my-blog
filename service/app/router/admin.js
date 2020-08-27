'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
    const { router, controller } = app;
    const adminAuth = app.middleware.adminLoginCheck();
    router.post('/admin/login', controller.admin.login.index)
    router.get('/admin/getArticleList',adminAuth, controller.admin.article.getArticleList);

};
