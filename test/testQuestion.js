
  var os = require('os')
  , MongoClient = require('mongodb') // MongoClient // Driver for connecting to MongoDB
  , EnglishQuestionsDAO =   require('../routes/englishQuestions').EnglishQuestionsDAO

  console.log()
  console.log('*************************************************')
  console.log('OS arch:' + JSON.stringify(os.arch()));
  console.log('process.platform :' + JSON.stringify(process.platform));
  console.log('Path: ' + __filename );
  console.log('*************************************************')
  console.log()
console.log(' fetch all available questions from the db football, collection: questions' );
var allItems;
  MongoClient.connect('mongodb://localhost:27017/football', function(err, db) {
    "use strict";
  if(err) throw err;
  console.log('Now connected to the db!');
  var questionDAO = new EnglishQuestionsDAO(db);
   var item, i;
  questionDAO.getAll( function(err, items){
   if(err) throw err;
   allItems=items;
   for(i=0; i < allItems.length; i++){
        console.log( 'item: ' + i + JSON.stringify(allItems[i]));
  }
    console.log('Item 10: ' + JSON.stringify(allItems[10]));
db.close();
});

});
