// var  ContentHandler = require('./content')
// This file must be edited. Now it is only a placeholder.

function routes (app, db) {
    console.log('Entered index.js function.')
//    var contentHandler = new ContentHandler(db, app.url);
    console.log('in routes, the  url :' +  app.url);
//    app.get('/', contentHandler.displayMainPage);

//  app.post('/viewreportx', contentHandler.displayReportx);

    console.log('Finished index.js function.')
}
module.exports = routes
