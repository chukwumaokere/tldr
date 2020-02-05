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
      res.badRequest("Article already exists");
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

    return res.ok("Article created");
  },
  updateArticle: async function(req, res) {
    // CURRENT ARTICLE
    const articleName = req.body.articlename
    const getCurrentArticleQuery = `SELECT * FROM articles WHERE articlename = $1`
    const queryResult = await sails.sendNativeQuery(getCurrentArticleQuery, [articleName])
    const articleProperties = queryResult.rows[0]

    const oldContent = JSON.parse(articleProperties.content)
    const oldSources = JSON.parse(articleProperties.sources)
    const newContent = req.body.newContent
    const newSources = req.body.newSources

    const appendedContent = JSON.stringify(oldContent.concat(newContent))
    const appendedSources = JSON.stringify(oldSources.concat(newSources))

    console.log(typeof newContent)
    console.log(newContent)
    console.log(typeof newSources)
    console.log(newSources)
    console.log(typeof appendedContent)
    console.log(appendedContent)
    console.log(typeof appendedSources)
    console.log(appendedSources)

    console.log(`UPDATE articles SET content = ${appendedContent}, sources = ${appendedSources} WHERE articlename = ${articleName}`)

    const articleExists = queryResult.rows.length > 0 ? true : false
    const updateMethod = req.body.updateMethod
    const updatedPublicStatus = req.body.public
    const updatedAt = Math.round(new Date().getTime())

    // if (!articleExists) {
    //   return res.badRequest("No article found with that name. Please create the article first, or try again with an existing article name")
    // }

    // if (updateMethod === undefined) {
    //   return res.badRequest("updateMethod must be defined. Options are 'append' & 'overwrite'")
    // }
    
    // if (updateMethod === "append"){
    //     await sails.sendNativeQuery(`UPDATE articles SET content = $1 sources = $2 WHERE articlename = $3`, [appendedContent, appendedSources, articleName])
    //     const updatedArticle = await sails.sendNativeQuery(`SELECT * FROM articles WHERE articlename = $1`, [articleName])

    //   if(updatedArticle){
    //       return res.ok({success: true, article: updatedArticle.rows[0]})
    //     } else {
    //       return res.badRequest('Error updating')
    //   }
    // }

    // OVERWRITE ARTICLE PROPERTIES
    if(updateMethod === "overwrite") {
        if (newContent && newSources) {
            content = newContent
            sources = newSources
            await sails.sendNativeQuery(`UPDATE articles SET content = $1, sources = $2 WHERE articlename = $3`, [content, sources, articleName])
            res.ok('Article updated')
        } else if (newContent) {
            content = newContent
            await sails.sendNativeQuery(`UPDATE articles SET content = $1 WHERE articlename = $2`, [content, articleName])
            res.ok('Article updated')
        } else if (newSources) {
            sources = newSources
            await sails.sendNativeQuery(`UPDATE articles SET sources = $1 WHERE articlename = $2`, [sources, articleName])
            res.ok('Article updated')
        } else {
          res.badRequest('You must provide data for the update request to proceed')
        }
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
