/**
 * ArticlesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getHomePage: async function (req, res){
    const query = `SELECT articlename, rating FROM articles WHERE public = 1`;
    const result = await sails.sendNativeQuery(query)    
    let articles = []    

    if(result.rows.length > 0){
      result.rows.forEach((article) => {
        articles.push({
          title: article.articlename,
          rating: article.rating
        })
      })
    } else {
      return res.notFound()
    }

    return res.view('pages/homepage', { articles })
  },

  getPage: async function(req, res){
    var articlename = req.param('articlename').toLowerCase();
    var query = `SELECT * FROM articles WHERE articlename = $1 AND public = 1`;
    var rawResult = await sails.sendNativeQuery(query, [articlename]); 

    if(rawResult.rows.length > 0){ 
        var target = rawResult.rows[0];
        var content = JSON.parse(target.content);
        var articlename_returned = target.articlename;
        const rating = target.rating
        var createdTime = new Date(target.createdAt);
        var updatedTime = new Date(target.updatedAt);
        // sails.log(articlename_returned, content, createdTime, updatedTime);
        return res.view('pages/article', {article: content, articlename: articlename_returned, rating, ct: createdTime, ut: updatedTime})
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
  // RATINGS - functions relating to the ratings feature for articles
  getRating: async function(req, res){
    const articlename = req.param('articlename').toLowerCase()
    const query = `SELECT rating FROM articles`;
    const result = await sails.sendNativeQuery(query, [articlename])
    const data = result.rows[0]

    return res.ok(data)
  },
  postRating: async function(req, res){
    // const voteDirection = req.param('voteDirection')
    // let rating = this.getRating()
    // const query = `UPDATE articles SET rating = $1 WHERE articlename = $2`

    console.log(this.getRating(req.param('articlename')), [])
    // if(voteDirection === 'upvote'){
    //   rating++
    // } else if (voteDirection === 'downvote'){
    //   rating--
    // }

    // await sails.sendNativeQuery(query, [rating, articlename])

    return res.ok('Article rating updated')
  }
};

