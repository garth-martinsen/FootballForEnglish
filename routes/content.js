/*----------- File: routes/content.js---------------*/
 var ObjectId = require('mongodb').ObjectID;

 var EnglishQuestionsDAO =   require('./englishQuestions').EnglishQuestionsDAO
 ,   PlayersDAO =   require('./players').PlayersDAO
 var   sanitize = require('validator').sanitize // Helper to sanitize form input;
 ,   allQuestions, allPlayers, questionA, answerA ;
var $ = require('jquery');

/* ---------------The ContentHandler must be constructed with a connected db -------- */

      var byCount= new Map;
      var teams=new Map;
      teams.set(1, 'Chile');
      teams.set(-1, 'Argentina');
function ContentHandler (db, url, ballPositions) {
    "use strict";
     console.log('Entered contentHandler with db, url, ballPositions'); 
     console.log('In ContentHandler, BallPositions are: ' + ballPositions); 
     console.log('In ContentHandler, url is: ' + url); 

      var questionsDao = new EnglishQuestionsDAO(db);
      var playersDao = new PlayersDAO(db);
      questionsDao.getAll(function(err, questions){ allQuestions = questions ; storeByCount(questions)});

//functions ...
var storeByCount = function(questions){
 questions.forEach(function( item){
 byCount.set(item.count, item);
// console.log(JSON.stringify(item))
});
console.log('byCount map size: ' + byCount.size)
} //function
var getByCount=function(cnt){
console.log("Getting the item at count: " + cnt);
var item = byCount.get(cnt);
console.log("Item is: " + JSON.stringify(item));
return item;
} //function
var asNumber=function (str){ return Number(str.match(/[-0-9]*/g)[0]);}
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
//           console.log('Entered content.displayChangePossession poss: ' + poss + ', direction: ' + ballDirection + ' with location: ' + ballLocation );
           var leftArrowIsVisible = (poss ^ 1); 
           ballDirection = - ballDirection;
           count-- ;
           var item = byCount.get(count);
         if(item === null) throw({error: 'item is not found at count: ' + count})
           if(item === null) throw({error: 'item is not found at count: ' + count})
           console.log('...Changed possession to: ' +  leftArrowIsVisible  + ', ballDirection to: ' + ballDirection + ' with ballLocation: ' + ballLocation );
           return res.render('football', 
               {  
                 name : 'Americas Cup of English'
                , remaining:count
                , scoreA : scoreA
                , scoreB : scoreB
                , team:teams.get(ballDirection) 
                ,'questionA': item.q 
                , answerA: 'Do not show until answered.'
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

 //          console.log('Entered displayAdvance from: ' + ballLocation + ' in direction: ' + ballDirection + ' questionsRemaining: ' + count );
           if( ballDirection === 1){
             ballLocation +=1; }
           else if(ballDirection === -1){
            ballLocation += -1; }
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
         var item = byCount.get(count); 
         if(item === null) throw({error: 'item is not found at count: ' + count})

         var  params = {
           name : 'Americas Cup of English' 
         , remaining : count 
         , scoreA : scoreA 
         , scoreB :  scoreB
         , team:teams.get(ballDirection) 
         , questionA : item.q 
         , answerA :  'Do not show until answered'
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
 
               count--; //next question.
               console.log('Entered displayQuestion with ball at: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count );
            var item = byCount.get(count);
            if(item === null) throw({error: 'item is not found at count: ' + count})
            return res.render('football', {
                   name : 'Americas Cup of English'
                 , remaining:count
                 , scoreA : scoreA
                 , scoreB : scoreB
                 , team:teams.get(-ballDirection) 
                 , questionA:item.q
                 , answerA:' Do not show until answered'
                 , ballLocation: ballLocation
                 , pxpos: ballPositions[ballLocation]
                 , ballDirection: ballDirection
                 , leftArrowIsVisible: (ballDirection>0)? 0 : 1
                 , rightArrowIsVisible : (ballDirection>0)? 1 : 0
            }
            ); //render
 }//function
 this.displayAnswer = function(req, res, next) {
        "use strict";
            var scoreA =asNumber(req.body.scoreA);
            var scoreB =asNumber(req.body.scoreB);
            var count = asNumber(req.body.remaining);
            var ballDirection = asNumber(req.body.ballDirection);
            var ballLocation = asNumber(req.body.ballLocation);

           console.log('Entered displayAnswer with ball at: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count );
           var item = byCount.get(count);
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

/* ------------------
game: Copa de America: <%= name %>
clock: '<%=remaining%>' width= 50px readonly ></div>
AScore:'<%=scoreA%>'>
BScore '<%=scoreB%>'>
team:  '<%=Team%>'
question:'<%=questionA%>
answer: '<%=answerA%>'
ballLocation: <%=ballLocation%>
ballpx:  '<%=pxpos%>'                                                                 
ballDir: '<%=ballDirection%>'
leftArrow: '<%=leftArrowIsVisible%>'
rightArrow: <%=rightArrowIsVisible%>
 ---------------------*/
console.log('Finished contentHandler.')
}   //ContentHandler.

module.exports = ContentHandler;
