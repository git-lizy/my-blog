'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
    const { router, controller } = app;
    router.get('/default/articleType', controller.default.article.getArticleType);
    router.get('/default/articleList', controller.default.article.getArticleList);
    router.get('/default/articleDetail', controller.default.detail.getArticleDetail);
    router.get('/default/hotList', controller.default.hot.getHotList);
    router.get('/default/recommendList', controller.default.recommend.getRecommendList);

};
