'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller } = app;
  router.get('/default/articleType', controller.default.article.getArticleType);
  router.post('/default/deleteArticleType', controller.default.article.deleteArticleType);
  router.post('/default/updateArticleType', controller.default.article.updateArticleType);
  router.post('/default/addArticleType', controller.default.article.addArticleType);
  router.get('/default/articleList', controller.default.article.getArticleList);
  router.get('/default/articleDetail', controller.default.detail.getArticleDetail);
  router.post('/default/addFavour', controller.default.detail.addFavour);
  router.get('/default/hotList', controller.default.hot.getHotList);
  router.get('/default/otherMsgById', controller.default.article.getOtherMsgById);
  router.get('/default/getArticleTotals', controller.default.article.getArticleTotals);
  router.get('/default/getBgImage', controller.default.bg.getBgImage);
 
};
