Production Down Time
====================
A basic Node.js application that will draw various charts based upon input like Production line vs. duration for a given date and shift

Steps to run the app
====================
* After cloning the repo, install the dependencies by running **npm install**
* To start the server, run **npm start** on the base directory

Developer guide:
===============
* app.js defines all the required modules.
* routes/index.js defines where to route the requests on app.js gets a request
* middleware/dbCOnnector.js defines the db connection pool
* middleware/query.js perfoms the query once it gets request from routes/index.js and renders it
* views/index.jade displays the intial page of the application
* views/displayChart.jade displays the final Chart after middleware/query.js renders it
* public/javascripts/main.js performs the rendering of the chart once JsonArray is loaded on {#mychart} /displayChart.jade
