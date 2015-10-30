/*----------- File: routes/content.js---------------*/
 var ObjectId = require('mongodb').ObjectID;

 var EnglishQuestionsDAO =   require('./englishQuestions').EnglishQuestionsDAO
 ,   PlayersDAO =   require('./players').PlayersDAO
 var   sanitize = require('validator').sanitize // Helper to sanitize form input;
 ,   allQuestions, allPlayers, questionA, answerA ;

/* ---------------The ContentHandler must be constructed with a connected db -------- */

function ContentHandler (db, url, ballPositions) {
    "use strict";
     console.log('Entered contentHandler with db, url, ballPositions'); 
     console.log('In ContentHandler, BallPositions are: ' + ballPositions); 
     console.log('In ContentHandler, url is: ' + url); 

     

      var questionsDao = new EnglishQuestionsDAO(db);
      var playersDao = new PlayersDAO(db);
//      questionsDao.getAll(function(err, questions){ allQuestions = questions });
//      playersDao.getAll(function(err, players){ allPlayers = players} );

//functions
/* -----------------
app.post('/possession', contentHandler.changePossession);
   app.post('/advance', contentHandler.advanceBall);
   app.post('/question', contentHandler.displayQuestion);
   app.post('/answer', contentHandler.displayAnswer);

---------------------*/
var asNumber=function (str){ return Number(str.match(/[-0-9]*/g)[0]);}
 this.displayMainPage = function(req, res, next) {
        "use strict";
           console.log('Entered displayMainPage with req: '+ JSON.stringify(req) + ' and res: ' + JSON.stringify(res));
            return res.render('football', 
              {
                'name' : 'Americas Cup of English'
                , remaining:33
                , scoreA : scoreA
                , scoreB : scoreB
                , team: 'team'
                ,'questionA': "What_is_the_opposite_of_Tall?"
                , answerA: 'The_opposite_of_Tall_is_Short.'
                , ballLocation: ballLocation
                , pxpos: ballPositions[ballLocation]
                , ballDirection : 0
                , leftArrowIsVisible: 0
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
//           count -=2;
           console.log('...Changed possession to: ' +  leftArrowIsVisible  + ', ballDirection to: ' + ballDirection + ' with ballLocation: ' + ballLocation );
           return res.render('football', 
               {  
                 name : 'Americas Cup of English'
                , remaining:count
                , scoreA : scoreA
                , scoreB : scoreB
                , team : 'team'
                ,'questionA': "What_is_the_opposite_of_Tall?"
                , answerA: 'The_opposite_of_Tall_is_Short.'
                , ballLocation: ballLocation
                , pxpos: ballPositions[ballLocation]
                , ballDirection : ballDirection
                , leftArrowIsVisible: leftArrowIsVisible
               }
           );
 }//function
//This function will move the ball to the next location and decrements remaining question count by 2. 
// Future: it will populate the next question.
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
           if((ballLocation === 0 && ballDirection===-1) || (ballLocation === 4)&&(ballDirection===1)) {
             if(ballDirection === -1) { 
               scoreA += 1;}
             else if(ballDirection ===1) {
               scoreB += 1;}
             ballDirection = -ballDirection;
             poss = poss^1;
            }else {
            count -=2;
           }
 
         var  params = {name : 'Americas Cup of English', 
           remaining : count, 
           scoreA : scoreA, 
           scoreB :  scoreB,
           team :  'team',
           questionA :  'Next Question from DB',
           answerA :  'Do not show until answered',
           ballLocation : ballLocation, 
           pxpos : ballPositions[ballLocation], 
           ballDirection : ballDirection, 
           leftArrowIsVisible : 0
          }; 
//          questions.getNext(count, function(err, question){
//               if(err) throw err;
//               params.questionA = question.q;
          console.log('...Advanced to position: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count + ' poss: ' + poss);
            return res.render('football',params );
//         });
 }//function
 this.displayQuestion = function(req, res, next) {
        "use strict";
           console.log('Entered displayQuestion  with params: ' + JSON.stringify(params));
           var scoreA =asNumber(req.body.scoreA);
           var scoreB =asNumber(req.body.scoreB);  
           var count = asNumber(req.body.remaining);
           var ballDirection = asNumber(req.body.ballDirection);
           var ballLocation = asNumber(req.body.ballLocation);

           console.log('Entered displayQuestion with ball at: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count + ' poss: ' + poss);
           questions.getNext(count, function(err, question){
              if(err) throw err;

               return res.render('football', {
                 name : 'Americas Cup of English'
                ,remaining:count
                , scoreA : scoreA
                , scoreB : scoreB
                , team: 'team'   //Future TODO: use the ballDirection to determine which Team to display.
                ,questionA:question.q 
                ,answerA: ''
                ,ballLocation: ballLocation
                ,pxpos: ballPositions[ballLocation] 
                ,ballDirection: ballDirection
                ,leftArrowIsVisible: poss
           }
           ); //render
        }); //questions
}//function
 this.displayAnswer = function(req, res, next) {
        "use strict";
           var sA =req.body.scoreA.match(/[-0-9]+/g);  
           var sB =req.body.scoreB.match(/[-0-9]+/g);  
           var bl = req.body.ballLocation.match(/[-0-9]+/g);
           var cnt = req.body.remaining.match(/[-0-9]+/g);
           console.log('Entered displayQuestions from: ' + ballLocation + ' with count: ' + count );
           var count = Number(cnt[0]);
           var scoreA = Number(sA[0]);
           var scoreB = Number(sB[0]);
           var ballLocation = Number(bl[0]);
           questions.getNext(count, function(err, question){
              if(err) throw err;

               return res.render('football', {
                 name : 'Americas Cup of English'
                ,remaining:count
                , scoreA : scoreA
                , scoreB : scoreB
                , team: 'team'   //Future TODO: use the ballDirection to determine which Team to display.
                ,questionA:question.q 
                ,answerA:question.a 
                ,ballLocation: ballLocation
                ,pxpos: ballPositions[ballLocation] 
                ,ballDirection: ballDirection
                ,leftArrowIsVisible: poss
           }
           ); //render
        });//questions
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
leftArrow: '>%=leftArrowIsVisible%>'
 ---------------------*/
console.log('Finished contentHandler.')
}   //ContentHandler.

module.exports = ContentHandler;
