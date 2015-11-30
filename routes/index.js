 var  ContentHandler = require('./content')
// This file must be edited. Now it is only a placeholder.

function routes (app, db) {
    console.log('Entered index.js function.')
    var contentHandler = new ContentHandler(db, app.url, app.ballPositions);
    app.get('/', contentHandler.gameSetUp);

   app.post('/', contentHandler.displayMainPage);
   app.post('/possession', contentHandler.changePossession);
   app.post('/advance', contentHandler.advanceBall);
   app.post('/question', contentHandler.displayQuestion);
   app.post('/answer', contentHandler.displayAnswer);
   console.log('Finished index.js function.')
}
module.exports = routes
