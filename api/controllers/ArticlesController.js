/**
 * ArticlesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getPage: async function(req, res){
    var articlename = req.param('articlename').toLowerCase();
    var query = `SELECT * FROM articles WHERE articlename = $1 AND public = 1`;
    var rawResult = await sails.sendNativeQuery(query, [articlename]); 
    if(rawResult.length === undefined){ //If page doesnt exist, give them a 404. TODO: Later we can add a suggestion page to intake suggestions or fully fleshed articles.
        //return res.notFound();
    }
    var target = rawResult.rows[0];
    var content = JSON.parse(target.content);
    var articlename_returned = target.articlename;

    var createdTime = new Date(target.createdAt);
    var updatedTime = new Date(target.updatedAt);
    sails.log(articlename_returned, content, createdTime, updatedTime);
    
    return res.view('pages/article', {article: content, articlename: articlename_returned, ct: createdTime, ut: updatedTime})
  },    

};

