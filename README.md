This is my WebScraping example.

It is based on a Node.js framework.

I'm using Cheerio.js and Request.js to get tabulated data from an external website and save it as JSON.

With the particular websites I am scraping, I do not know in advance where they are, but there is an "index" site where I can scrape links to where the sites will be.  I scrape this and make a JSON of links to the sites, I then iterate over this JSON to scrape the individual sites creating the data sets in another JSON file.

I upload the JSON and inject it into the view as a table.

Making the code save the data to a file required a time out as I found that the JavaScript proceeds too fast and tries to write a file before the data is available.  I tried nested function calls, callbacks, underscore js's delay, promises, and async js's series, but they all fail, probably because a HTTP call will be async anyway and take it's time and not hold up the flow of the program.

Here are links to the examples I followed to basically get me up and running:
  http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
  https://scotch.io/tutorials/scraping-the-web-with-node-js

This application is deployed on openshift:
  http://parkcollector-systraph.rhcloud.com/

to run type:  node server.js    

Don't use nodemon server.js   because the json file changes in the middle of the routine and it thinks it is a file change and re-starts.

For development purposes, I don''t actually scrape the websites, I have a local copy, and serve the files with:
python -m SimpleHTTPServer 8000

To Do:
  1) get the node ignore file working so that I can use nodemon.
  2) Add lots more styling !
  3) Recent additions are temporary, particularly in the injector2.js file - which would benefit from moving the repeated code into functions - if it to be kept.
  


