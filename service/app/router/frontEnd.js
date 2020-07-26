'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
    const { router, controller } = app;
    router.get('/frontEnd/articleType', controller.frontEnd.home.getArticleType);
    router.get('/frontEnd/articleList', controller.frontEnd.home.getArticleList);

};
