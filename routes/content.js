/*----------- File: routes/content.js---------------*/
 var ObjectId = require('mongodb').ObjectID;

 var EnglishQuestionsDAO =   require('./englishQuestions').EnglishQuestionsDAO
 ,   PlayersDAO =   require('./players').PlayersDAO
 var   sanitize = require('validator').sanitize // Helper to sanitize form input;
 ,   allQuestions, allPlayers, questionA, questionB, playerA, playerB, answerA, answerB, questionsRemaining;

/* ---------------The ContentHandler must be constructed with a connected db -------- */

function ContentHandler (db) {
    "use strict";
     console.log('Entered contentHandler with db'); 
     var ballPositions = ['68px','340px','580px','850px','1100px']

      var questionsDao = new EnglishQuestionsDAO(db);
      var playersDao = new PlayersDAO(db);
//      questionsDao.getAll(function(err, questions){ allQuestions = questions });
//      playersDao.getAll(function(err, players){ allPlayers = players} );

//functions

function asNumber(str){
  log.console('Entered function asNumber with :' +  str);
  return Number(str.match(/[-0-9]+/g)[0]) //preceding - allows for negative numbers.
}//function
 this.displayMainPage = function(req, res, next) {
        "use strict";
           console.log('Entered displayMainPage with req: '+ JSON.stringify(req) + ' and res: ' + JSON.stringify(res));
            return res.render('football', 
              {
                 name : 'Football for English'
                , remaining:33
                , playerA: 'Garth_Martinsen'
                ,'playerB': "Betty_Martinsen"
                ,'questionA': "What_is_the_opposite_of_Tall?"
                ,'questionB': "What_is_the_opposite_of_Up?"
                , answerA: 'The_opposite_of_Tall_is_Short.'
                , answerB:'The_opposite_of_Up_is_Down.'
                , ballLocation: ballLocation
                , pxpos: ballPositions[ballLocation]
                , leftArrowIsVisible: 0
                , ballDirection : 0
                , scoreA : scoreA
                , scoreB : scoreB
              }
            );
 }//function
 this.displayChangePossession = function(req, res, next) {
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
                 name : 'Football for English'
                , remaining:count
                , playerA: 'Garth_Martinsen'
                ,'playerB': "Betty_Martinsen"
                ,'questionA': "What_is_the_opposite_of_Tall?"
                ,'questionB': "What_is_the_opposite_of_Up?"
                , answerA: 'The_opposite_of_Tall_is_Short.'
                , answerB:'The_opposite_of_Up_is_Down.'
                , ballLocation: ballLocation
                , pxpos: ballPositions[ballLocation]
                , leftArrowIsVisible: leftArrowIsVisible
                , ballDirection : ballDirection
                , scoreA : scoreA
                , scoreB : scoreB
               }
           );
 }//function
//This function will move the ball to the next location and decrements remaining question count by 2. 
// Future: it will populate the next two players and questions.
 this.displayAdvance = function(req, res, next) {
        "use strict";
           var bl= (req.body.ballLocation).match(/[0-9]+/g);
           var bd= (req.body.ballDirection).match(/[-0-9]+/g);
           var cnt = req.body.remaining.match(/[0-9]+/g);
           var pss = req.body.leftArrowIsVisible.match(/[0-9]+/g);
           var sA =req.body.scoreA.match(/[-0-9]+/g);  
           var sB =req.body.scoreB.match(/[-0-9]+/g);  
           //console.log('Count: ' + cnt + ' leftIsVisible: '+ pss);
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
           //After moving check if ball is in Goal. If so, change directions.
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
          console.log('...Advanced to: ' + ballLocation + ' direction: ' + ballDirection + ' timer: ' + count + ' poss: ' + poss);
            return res.render('football', {
                  name : 'Football for English'
                , remaining: (count -2)
                , playerA: 'Mickey_Mouse'
                , playerB: 'Donald_Duck'
                , questionA: 'AQuestion' 
                , questionB: 'BQuestion' 
                , answerA: 'AnswerA'   
                , answerB: 'AnswerB'  //following are hidden or in style.
                , ballLocation: ballLocation
                , pxpos: ballPositions[ballLocation] 
                , leftArrowIsVisible : poss 
                , ballDirection : ballDirection
                , scoreA : scoreA
                , scoreB : scoreB
            });
 }//function
/* ------------------------
 this.displayQuestions = function(req, res, next) {

        "use strict";
           var sA =req.body.scoreA.match(/[-0-9]+/g);  
           var sB =req.body.scoreB.match(/[-0-9]+/g);  
           var ballLocation = req.body.ballLocation;
           var count = req.body.count;
           console.log('Entered displayQuestions from: ' + ballLocation + ' with count: ' + count );
           var poss = req.body.leftArrowIsVisible;
           var scoreA = Number(sA[0]);
           var scoreB = Number(sB[0]);
           questions.getTwo(count, function(err, questions){
              if(err) throw err;
              players.getTwo(ballLocation, function(err, playrs){
               if(err) throw err;
               return res.render('football', {
                 name : 'Football for English'
                ,remaining:count-2
                ,playerA: playrs[0]
                ,playerB: playrs[1]
                ,questionA:questions[0].q 
                ,questionB: questions[1].q 
                ,answerA: questions[0].a   
                ,answerB: questions[1].a  //following are hidden or in style.
                ,ballLocation: ballLocation
                ,pxpos: ballPositions[ballLocation] 
                ,leftArrowIsVisible: poss
                , scoreA : scoreA
                , scoreB : scoreB
           }
           ); //render
          }); //playrs
        });//questions
}//function
---------------------------*/
console.log('Finished contentHandler.')
}   //ContentHandler.

module.exports = ContentHandler;
