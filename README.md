# tldr - Everything you wanted to know about anything, quickly 
## the Occam’s razor of the Internet
### All the facts without the BS

a [Sails v1](https://sailsjs.com) application


### Version info

This app was originally generated on Tue Jan 28 2020 20:31:08 GMT-0600 (Central Standard Time) using Sails v1.2.3.


### Set up
* Git clone this repo
* Inside the directory run `npm install`
* then create a file in config/ named `local.js`
* Put this in `config/local.js`: 
```
module.exports = {
  datastore_url: 'mysql://mysqluser:password@localhost:3306/tldr',
};
```
* Be sure to change `mysqluser` and `password` in that `local.js` file to your mysql information. It should create the database and table for you. If not, just create the database `tldr` and it will automatically create the tables for you.
* run `node app.js`. You can also use nodemon, pm2, or some other daemon to keep the program running.
* Run the example create API's below to get started with some content.


### Example Create API:    
#### Run these in your browser to quickly create content in the database.
<pre><code>
http://localhost:1337/articles/Create?articlename=Coronavirus&content=["Is a common virus", "Causes respiratory infrections which are typically mild", "SARS and MERS is a type of coronavirus", "MERS first appeared in 2012 in Saudi Arabia", "In 2003, 774 people died from a severe acute respiratory syndrome (SARS) outbreak", "Often a coronavirus causes upper respiratory infection symptoms like a stuffy nose, cough, and sore throat.", "You can treat them with rest and over-the-counter medication.", "The coronavirus can also cause middle ear infections in children.", "Currently 5 cases of Coronavirus in US. one each in Illinois, Arizona and Washington state, and two in California.", "At least 5,974 cases have been confirmed in China and 132 have died as of late January 27, 2020 Chinese officials said. There were 56 confirmed cases in other countries, the World Health Organization said January 27, 2020."]&sources=["https://www.webmd.com/lung/coronavirus", "https://www.nbcnews.com/health/health-news/coronavirus-u-s-map-where-virus-has-been-confirmed-across-n1124546"]    
</code></pre>

<pre><code>
http://localhost:1337/articles/Create?articlename=SpaceX&content=["A private American aerospace manufacturer and space transportation services company headquartered in Hawthorne, California. It was founded in 2002 by Elon Musk with the goal of reducing space transportation costs to enable the colonization of Mars", "SpaceX is now privately valued at $33.3 billion, CNBC reported Friday. MAY 31 2019", "SpaceX successfully launched 60 Starlink satellites into orbit, and revealed that it has raised more than $1 billion in fresh funding in 2019"]&sources=["https://en.wikipedia.org/wiki/SpaceX", "https://www.cnbc.com/2019/05/31/elon-musk-spacex-is-now-worth-more-than-tesla.html"]
</code></pre>

### Other public endpoints:   
http://localhost:1337/api/v1/article/coronavirus   
http://localhost:1337/api/v1/articles   

<!-- Internally, Sails used [`sails-generate@1.16.13`](https://github.com/balderdashy/sails-generate/tree/v1.16.13/lib/core-generators/new). -->



<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->

