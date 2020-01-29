module.exports = {


  friendlyName: 'View article',


  description: 'Display "Article" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/article'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
