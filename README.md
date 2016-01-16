This is my WebScraping example.  It is WORK IN PROGRESS

It is based on a Node.js framework.

I'm using Cheerio.js and Request.js to get tabulated data from an external website and save it as JSON.

I upload the JSON and inject it into the view as a table.

The injector code is fairly DRY but scraping code wants refactoring as I repeat too much code, this is work in progress.

http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

https://scotch.io/tutorials/scraping-the-web-with-node-js

This is my WebScraping example.


This application is deployed on openshift:

http://parkcollector-systraph.rhcloud.com/


to run:  node server.js    
or

don't use nodemon server.js   because the json file changes in the middle of the routine and it thinks it is a file change and re-starts.

