/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
 'GET /': 'ArticlesController.getHomePage' ,
 'GET /:articlename': 'ArticlesController.getPage',

  // Article Routes
  'GET /api/v1/articles': 'ArticlesController.getArticles',
  'GET /api/v1/article/:articlename': 'ArticlesController.getArticle',
  'POST /api/v1/articles/create': "ArticlesController.generateArticle",
  'POST /api/v1/:articlename/update': "ArticlesController.updateArticle",

  // Ratings routes
  'GET /api/v1/:articlename/rating': 'ArticlesController.getRating',
  'POST /api/v1/:articlename/rating/:voteDirection': 'ArticlesController.postRating'


  //'POST /api/v1/article'
};
