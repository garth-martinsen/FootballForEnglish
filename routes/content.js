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
  var da = allQuestions.slice(0,allQuestions.length); //  diminishing array, will decrease in size each time an index is randomly selected until it is empty. 
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
  var item = byCount.get(cnt)[0]; // for some reason, this returns an array.
//  console.log("Item at count: " + cnt + ' is: ' + JSON.stringify(item));
  return item;
} //function
var asNumber=function (str){ return Number(str.match(/[-0-9]*/g)[0]);
} //function
 this.displayMainPage = function(req, res, next) {
        "use strict";
           console.log('Entered displayMainPage with req: '+ JSON.stringify(req) + ' and res: ' + JSON.stringify(res));
            return res.render('football', 
              {
                 'name' : 'Americas Cup of English'
                , remaining:100
                , scoreA : scoreA
                , scoreB : scoreB
                , team:teams.get(ballDirection) 
                ,'questionA': "What is the opposite of Tall?"
                , answerA: 'The opposite of Tall is Short.'
                , ballLocation: ballLocation
                , pxpos: ballPositions[ballLocation]
                , ballDirection : 0
                , leftArrowIsVisible:(ballDirection>0)? 0 : 1 
                , rightArrowIsVisible : (ballDirection>0)? 1 : 0
              }
            );
 }//function


 this.changePossession = function(req, res, next) {
        "use strict";
          //if z-index of LeftArrow is 0, rightArrow is shown, else leftArrow z-index=1, leftArrow is shown.
           var cnt = req.body.remaining.match(/[-0-9]+/g); // This will be a number between 100 and 0. If it is negative, the game is over
           var bl =req.body.ballLocation.match(/[0-9]+/g);  
           var bd =req.body.ballDirection.match(/[-0-9]+/g);  
           var pss = req.body.leftArrowIsVisible.match(/[0-9]+/g); // This will be a zero(show RightArrow) or a one (show LeftArrow).
           var sA =req.body.scoreA.match(/[-0-9]+/g);  
           var sB =req.body.scoreB.match(/[-0-9]+/g);  
           var count = Number(cnt[0]);
           var ballLocation = Number(bl[0]);
           var ballDirection = Number(bd[0]);
           var poss = Number(pss[0]);
           var scoreA = Number(sA[0]);
           var scoreB = Number(sB[0]);
           var title, question, answer;
//           console.log('Entered content.displayChangePossession poss: ' + poss + ', direction: ' + ballDirection + ' with location: ' + ballLocation );
           var leftArrowIsVisible = (poss ^ 1); 
           ballDirection = - ballDirection;
           count-- ;
       // See if the game is over. It stops when count <1.
           if(count<1){
              title= 'Americas Cup of English Is Over!!!';
              question = 'Great game!!!';
              answer = 'You are all winners!!!';
              ballLocation=2;
              ballDirection = scoreB-scoreA;
           }else{
             title = 'Americas Cup of English';
             var item = getByCount(count); 
             if(item === null) throw({error: 'item is not found at count: ' + count})
             question = item.q;
             answer = 'Do not display until answered';
          }
           console.log('...Changed possession to: ' +  leftArrowIsVisible  + ', ballDirection to: ' + ballDirection + ' with ballLocation: ' + ballLocation );
           return res.render('football', 
               {  
                 name : title
                , remaining:count
                , scoreA : scoreA
                , scoreB : scoreB
                , team:teams.get(ballDirection) 
                ,'questionA': question 
                , answerA: answer 
                , ballLocation: ballLocation
                , pxpos: ballPositions[ballLocation]
                , ballDirection : ballDirection
                , leftArrowIsVisible:(ballDirection>0)? 0 : 1 
                , rightArrowIsVisible : (ballDirection>0)? 1 : 0
               }
           );
 }//function
//This function will move the ball to the next location and decrements remaining question count by 1. 
 this.advanceBall = function(req, res, next) {
        "use strict";

           var bl= (req.body.ballLocation).match(/[0-9]+/g);
           var bd= (req.body.ballDirection).match(/[-0-9]+/g);
           var cnt = req.body.remaining.match(/[0-9]+/g);
           var pss = req.body.leftArrowIsVisible.match(/[0-9]+/g);
           var sA =req.body.scoreA.match(/[-0-9]+/g);  
           var sB =req.body.scoreB.match(/[-0-9]+/g);  

           var ballLocation = Number(bl[0]); 
           var ballDirection = Number(bd[0]);
           var count = Number(cnt[0]); 
           var poss = Number(pss[0]);
           var scoreA = Number(sA[0]);
           var scoreB = Number(sB[0]);
           var question, answer, title;

 //          console.log('Entered displayAdvance from: ' + ballLocation + ' in direction: ' + ballDirection + ' questionsRemaining: ' + count );
           if( ballDirection === 1){
             ballLocation++; 
           } else if(ballDirection === -1){
            ballLocation--; }
           else{
             console.log('Error. BallDirection is: ' + ballDirection);}
           //After moving check if ball is in Goal. If so, change direction and increment score.
           if(ballLocation === 0 && ballDirection===-1){
               scoreA++;
               ballDirection = -ballDirection;
               poss = poss^1;
           } 
           else if(ballLocation === 4 && ballDirection===1) {
               scoreB++;
               ballDirection = -ballDirection;
               poss = poss^1;
           }
          count--;
          // See if the game is over. It stops when count <1. 
          if(count<1){
              title= 'Americas Cup of English Is Over!!!';
              question = 'Great game!!!';
              answer = 'You are all winners!!!';
              ballLocation=2;
              ballDirection = scoreB-scoreA;
          }else{
         title = 'Americas Cup of English';
         var item = getByCount(count); 
         if(item === null) throw({error: 'item is not found at count: ' + count})
         question = item.q;
         answer = 'Do not display until answered';
         }
         var  params = {
           name :title 
         , remaining : count 
         , scoreA : scoreA 
         , scoreB :  scoreB
         , team:teams.get(ballDirection) 
         , questionA : question 
         , answerA :  answer
         , ballLocation : ballLocation 
         , pxpos : ballPositions[ballLocation] 
         , ballDirection : ballDirection 
         , leftArrowIsVisible:(ballDirection>0)? 0 : 1 
         , rightArrowIsVisible : (ballDirection>0)? 1 : 0
          }; 

    return res.render('football',params );
 }//function
  this.displayQuestion = function(req, res, next) {
         "use strict";
             var scoreA =asNumber(req.body.scoreA);
             var scoreB =asNumber(req.body.scoreB);
             var count = asNumber(req.body.remaining);
             var ballDirection = asNumber(req.body.ballDirection);
             var ballLocation = asNumber(req.body.ballLocation);
             var title, question, answer, item;
 
               count--; //for index of next question.
               if(count<1){
                 title= 'Americas Cup of English Is Over!!!';
                 question = 'Great game!!!';
                 answer = 'You are all winners!!!';
                 ballDirection = scoreB-scoreA;
               }else{
                 item =getByCount(count);
                 if(item === null) throw({error: 'item is not found at count: ' + count})
                 console.log('returned item: ' + JSON.stringify(item));
                 title= 'Americas Cup of English';
                 question = item.q;
                 answer = 'Do not show until answered.';
               console.log('Entered displayQuestion with ball at: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count + ' question: ' +  item.q );
             }
            return res.render('football', {
                   name : title
                 , remaining:count
                 , scoreA : scoreA
                 , scoreB : scoreB
                 , team:teams.get(-ballDirection) 
                 , questionA:question
                 , answerA:answer
                 , ballLocation: ballLocation
                 , pxpos: ballPositions[ballLocation]
                 , ballDirection: ballDirection
                 , leftArrowIsVisible: (ballDirection>0)? 0 : 1
                 , rightArrowIsVisible : (ballDirection>0)? 1 : 0
            }
            ); //render
 }//function
/*------
	ballLocation:2/
	ballDirection:1/
	leftArrowIsVisible:0/
	rightArrowIsVisible:1/
	remaining:100/
	pxpos:163px
	scoreA:0
	scoreB:0
-------*/
 this.displayAnswer = function(req, res, next) {
        "use strict";
            var scoreA =asNumber(req.body.scoreA);
            var scoreB =asNumber(req.body.scoreB);
            var count = asNumber(req.body.remaining);
            var ballDirection = asNumber(req.body.ballDirection);
            var ballLocation = asNumber(req.body.ballLocation);

           console.log('Entered displayAnswer with ball at: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count );
           var item = getByCount(count);
           if(item === null) throw({error: 'item is not found at count: ' + count})
           return res.render('football', {
                  name : 'Americas Cup of English'
                , remaining: count
                , scoreA : scoreA
                , scoreB : scoreB
                , team:teams.get(ballDirection) 
                , questionA:item.q 
                , answerA:item.a 
                , ballLocation: ballLocation
                , pxpos: ballPositions[ballLocation] 
                , ballDirection: ballDirection
                , leftArrowIsVisible: (ballDirection>0)? 0 : 1
                , rightArrowIsVisible : (ballDirection>0)? 1 : 0
           }
           ); //render
}//function  
console.log('Finished contentHandler.')
}   //ContentHandler.

module.exports = ContentHandler;
