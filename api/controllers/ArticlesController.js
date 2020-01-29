/**
 * ArticlesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getHomePage: async function (req, res){
    const query = `SELECT articlename FROM articles WHERE public = 1`;
    const result = await sails.sendNativeQuery(query)    
    let articleNames = []

    if(result.rows.length > 0){
      result.rows.forEach((article) => {
        articleNames.push(article.articlename)
      })
    } else {
      return res.notFound()
    }

    return res.view('pages/homepage', { articleNames})
  },

  getPage: async function(req, res){
    var articlename = req.param('articlename').toLowerCase();
    var query = `SELECT * FROM articles WHERE articlename = $1 AND public = 1`;
    var rawResult = await sails.sendNativeQuery(query, [articlename]); 
    if(rawResult.rows.length > 0){ 
        var target = rawResult.rows[0];
        var content = JSON.parse(target.content);
        var articlename_returned = target.articlename;

        var createdTime = new Date(target.createdAt);
        var updatedTime = new Date(target.updatedAt);
        sails.log(articlename_returned, content, createdTime, updatedTime);
        
        return res.view('pages/article', {article: content, articlename: articlename_returned, ct: createdTime, ut: updatedTime})
    }else{
        return res.notFound(); //If page doesnt exist, give them a 404. TODO: Later we can add a suggestion page to intake suggestions or fully fleshed articles.
    }
  },    
  getArticles: async function(req, res){
    var query = `SELECT * FROM articles`;
    var rawResult = await sails.sendNativeQuery(query, []);
    if(rawResult.rows.length > 0){
        var data = rawResult.rows;
        return res.ok(data);
    }else{
        return res.ok([]);
    }
  },
  getArticle: async function(req, res){
    var articlename = req.param('articlename').toLowerCase();
    var query = `SELECT * FROM articles WHERE articlename = $1`;
    var rawResult = await sails.sendNativeQuery(query, [articlename]); 
    if(rawResult.rows.length > 0){ 
        var data = rawResult.rows[0];    
        return res.ok(data);
    }else{
        return res.ok([]); //If page doesnt exist, give them a 404. TODO: Later we can add a suggestion page to intake suggestions or fully fleshed articles.
    }
  },
};

