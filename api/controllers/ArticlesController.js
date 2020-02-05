/**
 * ArticlesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getHomePage: async function(req, res) {
    const query = `SELECT articlename, rating FROM articles WHERE public = 1`;
    const result = await sails.sendNativeQuery(query);
    let articles = [];

    if (result.rows.length > 0) {
      result.rows.forEach(article => {
        articles.push({
          title: article.articlename,
          rating: article.rating
        });
      });
    } else {
      return res.notFound();
    }

    return res.view("pages/homepage", { articles });
  },

  getPage: async function(req, res) {
    var articlename = req.param("articlename").toLowerCase();
    var query = `SELECT * FROM articles WHERE articlename = $1 AND public = 1`;
    var rawResult = await sails.sendNativeQuery(query, [articlename]);

    if (rawResult.rows.length > 0) {
      var target = rawResult.rows[0];
      var content = JSON.parse(target.content);
      var articlename_returned = target.articlename;
      const rating = target.rating;
      var createdTime = new Date(target.createdAt);
      var updatedTime = new Date(target.updatedAt);
      // sails.log(articlename_returned, content, createdTime, updatedTime);
      return res.view("pages/article", {
        article: content,
        articlename: articlename_returned,
        rating,
        ct: createdTime,
        ut: updatedTime
      });
    } else {
      return res.notFound(); //If page doesnt exist, give them a 404. TODO: Later we can add a suggestion page to intake suggestions or fully fleshed articles.
    }
  },
  getArticles: async function(req, res) {
    var query = `SELECT * FROM articles`;
    var rawResult = await sails.sendNativeQuery(query, []);
    if (rawResult.rows.length > 0) {
      var data = rawResult.rows;
      return res.ok(data);
    } else {
      return res.ok([]);
    }
  },
  getArticle: async function(req, res) {
    var articlename = req.param("articlename").toLowerCase();
    var query = `SELECT * FROM articles WHERE articlename = $1`;
    var rawResult = await sails.sendNativeQuery(query, [articlename]);

    if (rawResult.rows.length > 0) {
      var data = rawResult.rows[0];
      return res.ok(data);
    } else {
      return res.ok([]); //If page doesnt exist, give them a 404. TODO: Later we can add a suggestion page to intake suggestions or fully fleshed articles.
    }
  },
  generateArticle: async function(req, res) {
    const newArticleName = req.body.articlename;
    const checkArticlesQuery = `SELECT articlename FROM articles WHERE articlename = $1`;
    const checkArticlesResult = await sails.sendNativeQuery(
      checkArticlesQuery,
      [newArticleName]
    );
    const articleExists = checkArticlesResult.rows.length > 0 ? true : false;
    const createdAt = Math.round(new Date().getTime());
    const updatedAt = Math.round(new Date().getTime());

    if (articleExists) {
      res.status(400).send({success: false, message: "Article already exists"});
    }

    const insertArticleQuery = `INSERT INTO articles (
      articlename,
      content,
      sources,
      createdAt,
      updatedAt,
      public,
      rating)
      VALUES($1, $2, $3, $4, $5, $6, 0)`;

    await sails.sendNativeQuery(insertArticleQuery, [
      newArticleName,
      req.body.content,
      req.body.sources,
      createdAt,
      updatedAt,
      req.body.public
    ]);

    return res.ok({success: true, message: "Article created"});
  },
  updateArticle: async function(req, res) {
    // CURRENT ARTICLE
    const articleName = req.param('articlename');
    const getCurrentArticleQuery = `SELECT * FROM articles WHERE articlename = $1`
    const queryResult = await sails.sendNativeQuery(getCurrentArticleQuery, [articleName])
    const articleExists = queryResult.rows.length > 0 ? true : false
    const method = req.body.updateMethod
    const updatedAt = Math.round(new Date().getTime())

    var appendedContent = [];
    var appendedSources = [];

    if(articleExists){
      const articleProperties = queryResult.rows[0]

      var oldContent = JSON.parse(articleProperties.content)
      var oldSources = JSON.parse(articleProperties.sources)
      var publicStatus = JSON.parse(articleProperties.public)

      if(req.body.newContent){
        var newContent = JSON.parse(req.body.newContent)
        if(typeof newContent === 'object' && newContent.length > 0){
          var appendedContent = oldContent.concat(newContent)
        }
      }else{
        appendedContent = oldContent
      }
      if(req.body.newSources){
        var newSources = JSON.parse(req.body.newSources)
        if (typeof newSources === 'object' && newSources.length > 0){
          var appendedSources = oldSources.concat(newSources)
        }
      }else{
        appendedSources = oldSources
      }
      const updatedPublicStatus = req.body.public
      
      if(updatedPublicStatus){
        publicStatus = updatedPublicStatus
      }

      if (method == "append"){

      }else if (method == "overwrite"){
        if(newContent){
          appendedContent = newContent;
        }
        if(newSources){
          appendedSources = newSources;
        }
      }else{
        return res.status(400).send({success: false, message: "Either no method was provided or an incorrect method was provided. Please provide a method of either 'append' or 'overwrite' in your JSON request"});
      }

      var appendedContent = JSON.stringify(appendedContent);
      var appendedSources = JSON.stringify(appendedSources);
      
      var updateArticle = await sails.sendNativeQuery("UPDATE articles SET content = $1, sources = $2, public = $3, updatedAt = $4 WHERE articlename = $5", [appendedContent, appendedSources, publicStatus, updatedAt, articleName]);
      //console.log(appendedContent, appendedSources, oldContent, oldSources, newContent, newSources)
      if (updateArticle) { //TODO: Change this condition to see if query was seuccesful or errored
        var article = await sails.sendNativeQuery(getCurrentArticleQuery, [articleName])
        return res.ok({success: true, article: article.rows[0]}); 
      }else{
        return res.status(500).send({success: false, message: error500});
      }
    }else{
      return res.status(400).send({success: false, message: "No article found with that name. Please create the article first or try again with a proper article name"});
    }
  },
  // RATINGS - functions relating to the ratings feature for articles
  getRating: async function(req, res) {
    const articlename = req.param("articlename").toLowerCase();
    const query = `SELECT articlename, rating FROM articles WHERE articlename = $1`;
    const result = await sails.sendNativeQuery(query, [articlename]);
    const data = result.rows[0];

    return res.ok(data);
  },
  postRating: async function(req, res) {
    const articlename = req.param("articlename").toLowerCase();
    const voteDirection = req.param("voteDirection");

    const ratingQuery = `SELECT rating FROM articles WHERE articlename = $1`;
    const updateQuery = `UPDATE articles SET rating = $1 WHERE articlename = $2`;
    const ratingResult = await sails.sendNativeQuery(ratingQuery, [
      articlename
    ]);

    let ratingValue = ratingResult.rows[0].rating;

    if (voteDirection === "upvote") {
      ratingValue = ratingValue + 1;
    } else if (voteDirection === "downvote") {
      ratingValue = ratingValue - 1;
    }

    await sails.sendNativeQuery(updateQuery, [ratingValue, articlename]);

    return res.ok(`Article rating updated`);
  }
};
