// file: /Users/garth/Documents/Programming/football/routes/englishQuestions.js

/* The EnglishQuestionsDAO must be constructed with a connected database object */
function EnglishQuestionsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
       console.log('Entered EnglishQuestionsDAO constructor...');
    if (false === (this instanceof EnglishQuestionsDAO)){
        console.log('Warning: EnglishQuestionsDAO constructor called without "new" operator');
        return new EnglishQuestionsDAO(db);
        }

    var questions = db.collection('questions');
    var remainingQuestions;
  //functions
    this.getTwo = function(cnt, callback){
        "use strict";
    console.log('entered englishQuestions.getTwo after: '+ cnt);
    var query = {count:{ $lt: cnt}};
    var quests = questions.find(query).limit(2).toArray();
    callback(null, quests); 
} //function
    this.getNext = function(cnt, callback){
        "use strict";
    console.log('entered englishQuestions.getNext using: '+ cnt);
    var query = {count: cnt};
    questions.findOne(query,function(err, doc){
    callback(err, doc); 
    });
} //function
    this.getAll = function( callback){
        "use strict";
    console.log('entered englishQuestions.getAll');
    questions.find({}).toArray(function(err, quests){
    if(err) throw err;
//    console.log('Array: ' + JSON.stringify(quests));
    console.log('In QuestionsDAO, size of question array: ' + quests.length);
    callback(err, quests); 
});
} //function

console.log('Finished EnglishQuestionsDAO constructor.');
} //constructor
module.exports.EnglishQuestionsDAO = EnglishQuestionsDAO;
