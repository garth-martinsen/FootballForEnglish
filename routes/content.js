/*----------- File: routes/content.js---------------*/
 var ObjectId = require('mongodb').ObjectID;

 var EnglishQuestionsDAO =   require('./englishQuestions').EnglishQuestionsDAO
 ,   PlayersDAO =   require('./players').PlayersDAO
 var   sanitize = require('validator').sanitize // Helper to sanitize form input;
 ,   allQuestions, allPlayers, questionA, answerA ;
var $ = require('jquery');

/* ---------------The ContentHandler must be constructed with a connected db -------- */

      var byCount= new Map;
      // will need to modify following, if Brasil participates.
      var teams=new Map;
      teams.set(1, 'Chile');
      teams.set(-1, 'Argentina');
      teams.set(0, 'Tie');
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
var constants4Game=function(req){
 var c4game ={};
  c4game.leftFlag = req.body.leftFlag4Game;
  c4game.rightFlag = req.body.rightFlag4Game;
  c4game.leftArrow = req.body.leftArrow4Game;
  c4game.rightArrow = req.body.rightArrow4Game;
  c4game.leftScoreBar = req.body.leftScoreBar4Game;
  c4game.rightScoreBar = req.body.rightScoreBar4Game;
  c4game.goalBarLeft4Game = req.body.goalBarLeft4Game;
  c4game.goalBarRight4Game = req.body.goalBarRight4Game;
  c4game.rightScoreBar = req.body.rightScoreBar4Game;
  c4game.leftCountry = req.body.leftCountry;
  c4game.rightCountry = req.body.rightCountry;
return c4game;
}
this.gameSetUp = function(req, res, next){
console.log('Entered function gameSetUp()');
}//function
 this.displayMainPage = function(req, res, next) {
        "use strict";
           var ballLocation = 2; //midfield.
          //random draw determines ball direction.
           var ballDirection = (Math.random()<0.5)? -1 : 1; //   startingPossession 
           console.log('StartingPossession: ' + ballDirection )
           // From the game setup page.
           var count = asNumber(req.body.remaining);
           var c4g = constants4Game(req);
           //console.log('c4g is: ' + JSON.stringify(c4g));
           /* ----------------------
               console.log('Entered displayMainPage with:'      
               +  '\nleftArrow: '+ c4g.leftArrow 
               +  '\nright Arrow: ' + c4g.rightArrow 
               +  '\nleftScoreBar: '+ c4g.leftScoreBar 
               +  '\nrightScoreBar: ' + c4g.rightScoreBar 
               +  '\nleftGoalBar: '+ c4g.goalBarLeft4Game 
               +  '\nrightGoalBar: ' + c4g.goalBarRight4Game 
               +  '\nleftFlag: '+ c4g.leftFlag 
               +  '\nrightFlag: ' + c4g.rightFlag );                
   ---------------------------------- */
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
                , pxpos: ballPositions[ballLocation]
                , ballDirection : ballDirection
                , leftArrowIsVisible:(ballDirection>0)? 0 : 1 
                , rightArrowIsVisible : (ballDirection>0)? 1 : 0

                , leftScoreBar4Game : c4g.leftScoreBar
                , rightScoreBar4Game : c4g.rightScoreBar
                , goalBarLeft4Game: c4g.goalBarLeft4Game
                , goalBarRight4Game: c4g.goalBarRight4Game
		, leftFlag4Game : c4g.leftFlag 
                , rightFlag4Game : c4g.rightFlag
		, leftArrow4Game : c4g.leftArrow 
                , rightArrow4Game : c4g.rightArrow
		, leftCountry : c4g.leftCountry 
                , rightCountry : c4g.rightCountry
              }
            );
 }//function

// a change of direction, or change of possession no longer displays the next question. The next question is displayed only upon pressing the button "question"
 this.changePossession = function(req, res, next) {
        "use strict";
         var c4g = constants4Game(req);
       //console.log('In changePossession, c4g is: ' + JSON.stringify(c4g));
           var leftScore =asNumber(req.body.leftScore);
           var rightScore =asNumber(req.body.rightScore);  
           var count = asNumber(req.body.remaining);// This will be a number between 100 and 0. If it is less than 1, the game is over
           var ballLocation = asNumber(req.body.ballLocation);
           var ballDirection = asNumber(req.body.ballDirection);
           var team = asNumber(req.body.team);
           var mode = asNumber(req.body.mode);
           var question, answer;
           //purpose of call is to change direction of ball movement.
           ballDirection = -ballDirection;
           console.log('...Changed possession. New ballDirection is: ' + ballDirection + ' with ballLocation: ' + ballLocation );
           return res.render('football', 
               {  
                  name : 'Americas Cup of English'
                , remaining : count
                , leftScore : leftScore
                , rightScore : rightScore
                , team : team
                , mode : mode
                , questionA : '' 
                , answerA : '' 
                , ballLocation : ballLocation
                , pxpos : ballPositions[ballLocation]
                , ballDirection : ballDirection
                , leftArrowIsVisible :(ballDirection>0)? 0 : 1 
                , rightArrowIsVisible : (ballDirection>0)? 1 : 0

                , leftScoreBar4Game  : c4g.leftScoreBar
                , rightScoreBar4Game : c4g.rightScoreBar
                , goalBarLeft4Game   : c4g.goalBarLeft4Game
                , goalBarRight4Game  : c4g.goalBarRight4Game
                , leftFlag4Game      : c4g.leftFlag
                , rightFlag4Game     : c4g.rightFlag
                , leftArrow4Game     : c4g.leftArrow
                , rightArrow4Game    : c4g.rightArrow
		, leftCountry : c4g.leftCountry 
                , rightCountry : c4g.rightCountry
               }
           );
         
 }//function
//This function will move the ball to the next location and blank out question and answer textboxes. 
 this.advanceBall = function(req, res, next) {
        "use strict";
           var question, answer ;
           var c4g = constants4Game(req);
           var count = asNumber(req.body.remaining);
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
               leftScore++;
               ballDirection = -ballDirection;
               console.log('Goal!!!');
           } 
           else if(ballLocation === 4 && ballDirection===1) {
               rightScore++;
               ballDirection = -ballDirection;
               console.log('Goal!!!');
           }
           console.log('Advanced ball to: ' + ballLocation + ' in direction: ' + ballDirection + ' questionsRemaining: ' + count );
         var  params = {
           name :'Americas Cup of English' 
         , remaining : count 
         , leftScore: leftScore
         , rightScore: rightScore
         , team:team
         , mode: mode
         ,'questionA': '' 
         , answerA: '' 
         , ballLocation : ballLocation 
         , pxpos : ballPositions[ballLocation] 
         , ballDirection : ballDirection 
         , leftArrowIsVisible:(ballDirection>0)? 0 : 1 
         , rightArrowIsVisible : (ballDirection>0)? 1 : 0

         , leftScoreBar4Game : c4g.leftScoreBar
         , rightScoreBar4Game : c4g.rightScoreBar
         , goalBarLeft4Game: c4g.goalBarLeft4Game
         , goalBarRight4Game: c4g.goalBarRight4Game
         , leftFlag4Game : c4g.leftFlag
         , rightFlag4Game : c4g.rightFlag
         , leftArrow4Game : c4g.leftArrow
         , rightArrow4Game : c4g.rightArrow
         , leftCountry : c4g.leftCountry 
         , rightCountry : c4g.rightCountry
          }; 

    return res.render('football',params );
 }//function
  this.displayQuestion = function(req, res, next) {
         "use strict";
       var c4g= constants4Game(req);
       //console.log('In displayQuestion, c4g is: ' + JSON.stringify(c4g));

             var leftScore =asNumber(req.body.leftScore);
             var rightScore =asNumber(req.body.rightScore);
             var count = asNumber(req.body.remaining);
             var ballDirection = asNumber(req.body.ballDirection);
             var ballLocation = asNumber(req.body.ballLocation);
             var team = asNumber(req.body.team);
             var mode = asNumber(req.body.mode);
             var title, question, answer, item;
 
               count--; //for index of next question.
               if(count<1){
                 title= 'Americas Cup of English Is Over!!!';
                 question = 'Great game!!!';
                 answer = 'You are all winners!!!';
                // ballDirection = (scoreB-scoreA)/Math.abs(scoreB-scoreA);
               }else{
                 item =getByCount(count);
                 if(item === null) throw({error: 'item is not found at count: ' + count})
                 title= 'Americas Cup of English';
                 question = item.q;
                 answer = 'Do not show until answered.';
                 console.log('Entered displayQuestion with ball at: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count + ' question: ' +  item.q );
             }
            return res.render('football', {
                   name : title
                 , remaining:count
                 , leftScore: leftScore
                 , rightScore: rightScore
                 , team:team
                 , mode	:mode	
                 , questionA:question
                 , answerA:answer
                 , ballLocation: ballLocation
                 , pxpos: ballPositions[ballLocation]
                 , ballDirection: ballDirection
                 , leftArrowIsVisible: (ballDirection>0)? 0 : 1
                 , rightArrowIsVisible : (ballDirection>0)? 1 : 0

                 , leftScoreBar4Game : c4g.leftScoreBar
                 , rightScoreBar4Game : c4g.rightScoreBar
                 , goalBarLeft4Game: c4g.goalBarLeft4Game
                 , goalBarRight4Game: c4g.goalBarRight4Game
                 , leftFlag4Game : c4g.leftFlag
                 , rightFlag4Game : c4g.rightFlag
                 , leftArrow4Game : c4g.leftArrow
                 , rightArrow4Game : c4g.rightArrow
                 , leftCountry : c4g.leftCountry 
                 , rightCountry : c4g.rightCountry
            }
            ); //render
 }//function
 this.displayAnswer = function(req, res, next) {
        "use strict";
            var c4g= constants4Game(req);
//       console.log('In displayAnswer, c4g is: ' + JSON.stringify(c4g));

            var count = asNumber(req.body.remaining);
            var leftScore =asNumber(req.body.leftScore);
            var rightScore =asNumber(req.body.rightScore);
            var ballDirection = asNumber(req.body.ballDirection);
            var ballLocation = asNumber(req.body.ballLocation);
            var team = asNumber(req.body.team);
            var mode = asNumber(req.body.mode);


           var item = getByCount(count);
           if(item === null) throw({error: 'item is not found at count: ' + count})
           console.log('Entered displayAnswer with ball at: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count + ' answer: ' + item.a);
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
                , pxpos: ballPositions[ballLocation] 
                , ballDirection: ballDirection
                , leftArrowIsVisible: (ballDirection>0)? 0 : 1
                , rightArrowIsVisible : (ballDirection>0)? 1 : 0

                , leftScoreBar4Game : c4g.leftScoreBar
                , rightScoreBar4Game : c4g.rightScoreBar
                , goalBarLeft4Game: c4g.goalBarLeft4Game
                , goalBarRight4Game: c4g.goalBarRight4Game
                , leftFlag4Game : c4g.leftFlag
                , rightFlag4Game : c4g.rightFlag
                , leftArrow4Game : c4g.leftArrow
                , rightArrow4Game : c4g.rightArrow
                , leftCountry : c4g.leftCountry 
                , rightCountry : c4g.rightCountry
           }
           ); //render
}//function  
console.log('Finished contentHandler.')
}   //ContentHandler.

module.exports = ContentHandler;

