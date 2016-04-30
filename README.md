This is my WebScraping example.

It is based on a Node.js framework.

I'm using Cheerio.js and Request.js to get tabulated data from an external website and save it as JSON.

With the particular websites I am scraping, I do not know in advance where they are, but there is an "index" site where I can scrape links to where the sites will be.  I scrape this and make a JSON of links to the sites, I then iterate over this JSON to scrape the individual sites creating the data sets in another JSON file.

I upload the JSON and inject it into the view as a table.

Making the code save the data to a file required a time out as I found that the JavaScript proceeds too fast and tries to write a file before the data is available.  Using callbacks did not solve this problem, I think because the HTTP request is set up to be asynchronous regardless and the rest of the function will continue and then callback without its data.  I've tried using JS promises, underscore's delay, and async js's series, but they all have the same problem.

Here are links to the examples I followed to basically get me up and running:
  http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs
  https://scotch.io/tutorials/scraping-the-web-with-node-js

This application is deployed on openshift:
  http://parkcollector-systraph.rhcloud.com/

to run type:  node server.js    

Don't use nodemon server.js   because the json file changes in the middle of the routine and it thinks it is a file change and re-starts.

To Do:
  1) get the node ignore file working so that I can use nodemon.
  2) Add lots more styling !




