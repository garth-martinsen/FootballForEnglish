
/*----------- File: routes/content.js---------------*/
 var ObjectId = require('mongodb').ObjectID;

// var EnglishQuestionsDAO =   require('./englishQuestions').EnglishQuestionsDAO
// ,   PlayersDAO =   require('./players').PlayersDAO
 var   sanitize = require('validator').sanitize // Helper to sanitize form input;
 ,   allQuestions, allPlayers, questionA, questionB, playerA, playerB, answerA, answerB, questionsRemaining;

/* ---------------The ContentHandler must be constructed with a connected db -------- */

function ContentHandler (db) {
    "use strict";
     console.log('Entered contentHandler with db'); 
     var ballPositions = ['68px','340px','580px','850px','1100px']

/* --------------
      var questionsDao = new EnglishQuestionsDAO(db);
      var playersDao = new PlayersDAO(db);
      questionsDao.getAll(function(err, questions){ allQuestions = questions });
      playersDao.getAll(function(err, players){ allPlayers = players} );
--------------*/

//functions
 this.displayMainPage = function(req, res, next) {
        "use strict";
           console.log('Entered displayMainPage with req: '+ JSON.stringify(req) + ' and res: ' + JSON.stringify(res));
            return res.render('football', 
              {
                 name : 'Football for English'
                ,remaining:33
              }
            );
 }//function
/* ------------------------
 this.displayChangePossession = function(req, res, next) {
        "use strict";
           var poss = req.body.leftZVal; // This will be a zero(LeftArrow) or a one (RightArrow).
           var ballLocation = req.body.ballLocation;
           console.log('Entered content.displayChangePossession from: ' + poss );
           if(poss === 0 ){poss=1;} else{ poss=0;}  //if z-index of LeftArrow is 0, rightArrow is shown, else leftArrow z-index=1, leftArrow is shown.
           console.log('Changed possession to: ' +  poss );
            res.render('football', {
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
                ,leftZVal: poss
            });
 }//function
 this.displayAdvance = function(req, res, next) {
        "use strict";
           console.log('Entered displayAdvance from: ' + ballLocation );
           var ballLocation = req.body.ballLocation;
           var poss = req.body.leftZVal;
           ballLocation += 250 +'px';
           var count = req.body.count;
           console.log('Advanced to ballLocation: ' + ballLocation );
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
                ,leftZVal: poss
            });
 }//function
 this.displayQuestions = function(req, res, next) {
        "use strict";
           var ballLocation = req.body.ballLocation;
           var count = req.body.count;
           console.log('Entered displayQuestions from: ' + ballLocation + ' with count: ' + count );
           var poss = req.body.leftZVal;
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
                ,leftZVal: poss
           }
           ); //render
          }); //playrs
        });//questions
}//function
---------------------------*/
console.log('Finished contentHandler.')
}   //ContentHandler.

module.exports = ContentHandler;
