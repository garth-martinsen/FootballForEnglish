// file: /Users/garth/Documents/Programming/football/routes/englishQuestions.js

/* The PlayersDAO must be constructed with a connected database object */
function PlayersDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
       console.log('Entered PlayersDAO constructor...');
    if (false === (this instanceof PlayersDAO)){
        console.log('Warning: PlayersDAO constructor called without "new" operator');
        return new PlayersDAO(db);
        }

    var players = db.collection('players');
  //functions
//Ball position is from left to right 0,1,2,3,4 : goal, quarter, mid, quarter, goal. at midfield players would be 13 and 23 from opposite teams. 
    this.getTwo = function(ballPosition, callback){
        "use strict";
    console.log('entered players.getTwo at: '+ ballPosition);
    var query = {position: ballPosition }
    var plyrs = players.find(query).toArray();
    callback(null, plyrs); 
} //function
console.log('Finished PlayersDAO constructor.');
} //constructor
module.exports.PlayersDAO = PlayersDAO;
