/*----------- File: routes/content.js---------------*/
 var ObjectId = require('mongodb').ObjectID;
 var EnglishQuestionsDAO =   require('./englishQuestions').EnglishQuestionsDAO
 ,   PlayersDAO =   require('./players').PlayersDAO
 var   sanitize = require('validator').sanitize // Helper to sanitize form input;
 ,   allQuestions, allPlayers, questionA, answerA ;
var $ = require('jquery');
/* ---------------The ContentHandler must be constructed with a connected db -------- */

      var c4g = new Map;
      var byCount= new Map;
function ContentHandler (db, url, ballPositions) {
    "use strict";
     console.log('Entered contentHandler with db, url, ballPositions'); 
     console.log('In ContentHandler, BallPositions are: ' + ballPositions); 
     console.log('In ContentHandler, url is: ' + url); 

      var questionsDao = new EnglishQuestionsDAO(db);
      var playersDao = new PlayersDAO(db);
      questionsDao.getAll(function(err, questions){ allQuestions = questions ; randomize();});

//functions ...
var nextRandomIndex= function(diminishingArray){
return Math.floor((Math.random() * diminishingArray.length) );
}//function
// when randomize is complete, each item in allQuestions will have a randomly assigned index  value between 1 and allQuestions.length. 
//The game will be played with the first 100 items, and will count down from 100 to 0.
var randomize = function() {
       "use strict";
// start with allQuestions from db, and counter set to zero.
  var counter = 0;
// copy allQuestions into a diminishingArray, da. While da is not empty, randomly remove an item from da and insert it into byCount map.
  var da = allQuestions.slice(0,allQuestions.length); //  diminishing array, will decrease in size each time an index is randomly selected and removed, `until it is empty. 
  while(da.length >0){
    var index = nextRandomIndex(da);
    var item= da.splice(index,1); //removes and returns the element at index.
    item.count=counter++;
 //   console.log('random item at: ' + item.count + '  is: ' + JSON.stringify(item));
    byCount.set(item.count, item);
 }
console.log('ByCount map contains: ' + byCount.size);
}//function
var getByCount=function(cnt){
  var item = byCount.get(cnt)[0]; // for some reason, get() returns an array, so just take first element.
//  console.log("Item at count: " + cnt + ' is: ' + JSON.stringify(item));
  return item;
} //function
var asNumber=function (str){ return Number(str.match(/[-0-9]*/g)[0]);
} //function
this.displayMainPage = function(req, res, next) {
        "use strict";
           var ballLocation = 2; //midfield.
          //random draw determines ball direction at start of game.
           var ballDirection = (Math.random()<0.5)? -1 : 1; //   startingPossession 
           console.log('StartingPossession: ' + ballDirection )
           var count = asNumber(req.body.remaining);
           var leftIndex = asNumber(req.body.leftIndex);
           var rightIndex = asNumber(req.body.rightIndex);
           console.log(' leftIndex: '+ leftIndex + ' rightIndex: ' + rightIndex + ' remaining: ' +count + ' leftScore: '+ 0 + ' rightScore: ' +0) 
           console.log( ' ballLocation: ' + ballLocation + ' ballDirection: ' + ballDirection);
           // Render the game display to explain the rules and show example question and answer.
            return res.render('football', 
              {
                  name : 'Americas Cup of English'
                , remaining: count
                , leftScore: 0
                , rightScore: 0
                , team: '' 
                , mode: '' 
                ,'questionA': "Example: What is the opposite of Tall?"
                , answerA: 'Example: The opposite of Tall is Short.'
                , ballLocation: ballLocation
                , ballDirection : ballDirection
                , leftIndex : leftIndex
                , rightIndex : rightIndex
              }
            );
 }//function

// a change of direction, or change of possession no longer displays the next question. The next question is displayed only upon pressing the button "question"
 this.changePossession = function(req, res, next) {
        "use strict";
           var leftIndex = asNumber(req.body.leftIndex);
           var rightIndex = asNumber(req.body.rightIndex);
           var leftScore =asNumber(req.body.leftScore);
           var rightScore =asNumber(req.body.rightScore);  
           var count = asNumber(req.body.remaining);// This will be a number between 100 and 0. If it is less than 1, the game is over
           var ballLocation = asNumber(req.body.ballLocation);
           var ballDirection = asNumber(req.body.ballDirection);
           var team = asNumber(req.body.team);
           var mode = asNumber(req.body.mode);
           var question, answer;
           //purpose of call is to change direction of ball movement.
           if(ballLocation === 0 || ballLocation === 4){ 
             console.log('You cannot change possession when the ball is in a goal.');
           } else {
             ballDirection = -ballDirection;
             console.log('...Changed possession. New ballDirection is: ' + ballDirection + ' with ballLocation: ' + ballLocation );
           }
// Render Change Possession
           return res.render('football', 
               {  
                  name : 'Americas Cup of English'
                , remaining: count
                , leftScore: leftScore
                , rightScore: rightScore
                , team: team 
                , mode: mode 
                ,'questionA': ''
                , answerA: ''
                , ballLocation: ballLocation
                , ballDirection : ballDirection
                , leftIndex : leftIndex
                , rightIndex : rightIndex
               }
           );
         
 }//function
//This function will move the ball to the next location and clear text from textboxes for question and answer . 
 this.advanceBall = function(req, res, next) {
        "use strict";
           var question, answer ;
           var count = asNumber(req.body.remaining);
           var leftIndex =asNumber(req.body.leftIndex);
           var rightIndex =asNumber(req.body.rightIndex);
           var leftScore =asNumber(req.body.leftScore);
           var rightScore =asNumber(req.body.rightScore);
           var ballLocation = asNumber(req.body.ballLocation);
           var ballDirection = asNumber(req.body.ballDirection);
           var team = asNumber(req.body.team);
           var mode = asNumber(req.body.mode);

           //Advance the ball in the direction of ball position.
           if( ballDirection === 1){
             ballLocation++; 
           } else if(ballDirection === -1){
            ballLocation--; }
           else{
             console.log('Error. BallDirection is: ' + ballDirection);}
           //After moving check if ball is in Goal. If so, change direction and increment score.
           if(ballLocation === 0 && ballDirection===-1){
               console.log('Goal!!!');
               leftScore++;
               ballDirection = -ballDirection;
           } 
           else if(ballLocation === 4 && ballDirection===1) {
               console.log('Goal!!!');
               rightScore++;
               ballDirection = -ballDirection;
           }
           console.log('Advanced ball to: ' + ballLocation + ' in direction: ' + ballDirection + ' questionsRemaining: ' + count );
         var  params = {
                  name : 'Americas Cup of English'
                , remaining: count
                , leftScore: leftScore
                , rightScore: rightScore
                , team: team 
                , mode: mode 
                ,'questionA': ''
                , answerA: ''
                , ballLocation: ballLocation
                , ballDirection : ballDirection
                , leftIndex : leftIndex
                , rightIndex : rightIndex
        }; 
// Render Ball Advancement.
    return res.render('football',params );
 }//function
  this.displayQuestion = function(req, res, next) {
         "use strict";

             var leftIndex =asNumber(req.body.leftIndex);
             var rightIndex =asNumber(req.body.rightIndex);
             var leftScore =asNumber(req.body.leftScore);
             var rightScore =asNumber(req.body.rightScore);
             var count = asNumber(req.body.remaining);
             var ballDirection = asNumber(req.body.ballDirection);
             var ballLocation = asNumber(req.body.ballLocation);
             var team = asNumber(req.body.team);
             var mode = asNumber(req.body.mode);
             var title, question, answer, item;
 
               if(count<1){
                 title= 'Americas Cup of English Is Over!!!';
                 question = 'Great game!!!';
                 answer = 'You are all winners!!!';
                // ballDirection = (scoreB-scoreA)/Math.abs(scoreB-scoreA);
               }else{
                 count--; //for index of next question.
                 item =getByCount(count);
                 if(item === null) throw({error: 'item is not found at count: ' + count})
                 title= 'Americas Cup of English';
                 question = item.q;
                 answer = 'Do not show until answered.';
                 console.log('Entered displayQuestion with ball at: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count + ' question: ' +  item.q );
             }
 //Render Show Next Question
            return res.render('football', 
                 {
                  name : title
                , remaining: count
                , leftScore: leftScore
                , rightScore: rightScore
                , team: team 
                , mode: mode 
                ,'questionA': question
                , answerA: answer 
                , ballLocation: ballLocation
                , ballDirection : ballDirection
                , leftIndex : leftIndex
                , rightIndex : rightIndex
            }
            ); //render
 }//function
 this.displayAnswer = function(req, res, next) {
        "use strict";

            var count = asNumber(req.body.remaining);
            var leftIndex =asNumber(req.body.leftIndex);
            var rightIndex =asNumber(req.body.rightIndex);
            var leftScore =asNumber(req.body.leftScore);
            var rightScore =asNumber(req.body.rightScore);
            var ballDirection = asNumber(req.body.ballDirection);
            var ballLocation = asNumber(req.body.ballLocation);
            var team = asNumber(req.body.team);
            var mode = asNumber(req.body.mode);


           var item = getByCount(count);
           if(item === null) throw({error: 'item is not found at count: ' + count})
           console.log('Entered displayAnswer with ball at: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count + ' answer: ' + item.a);
 //Render Show Answer
           return res.render('football', {
                  name : 'Americas Cup of English'
                , remaining: count
                , leftScore: leftScore
                , rightScore: rightScore
                , team: team
                , mode :mode  
                , questionA:item.q 
                , answerA:item.a 
                , ballLocation: ballLocation
                , ballDirection: ballDirection
                , leftIndex : leftIndex
                , rightIndex : rightIndex
              }
           ); //render
}//function  
console.log('Finished contentHandler.')
}   //ContentHandler.

module.exports = ContentHandler;

