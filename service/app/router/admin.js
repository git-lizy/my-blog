'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;
  const adminAuth = app.middleware.adminLoginCheck({}, app);
  router.post('/admin/login', controller.admin.login.index);
  router.post('/admin/logout', adminAuth, controller.admin.logout.index);
  router.get('/admin/info', controller.admin.info.index);
  router.get('/admin/getArticleList', adminAuth, controller.admin.article.getArticleList);
  router.post('/admin/upload', adminAuth, controller.admin.file.upload);
  router.post('/admin/delete', adminAuth, controller.admin.file.delete);
  router.get('/admin/getRandomArticleId', adminAuth, controller.admin.article.getRandomArticleId);
  router.post('/admin/releaseArticle', adminAuth, controller.admin.article.releaseArticle);
  router.post('/admin/updateArticle', adminAuth, controller.admin.article.updateArticle);
  router.post('/admin/deleteArticle', adminAuth, controller.admin.article.deleteArticle);
  router.get('/admin/articleDetail', adminAuth, controller.admin.article.getArticleDetail);

};
