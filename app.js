var express = require('express')
  , MongoClient = require('mongodb')// MongoClient // Driver for connecting to MongoDB
  , routes = require('./routes') // Routes for our application
  , bodyParser = require('body-parser')
  , compression = require('compression')
  , cookieSession = require('cookie-session')
  , os = require('os');
//  app.set('images', __dirname + '/public/images');
  var app = express();
  app.use(express.static('public'));
  var ballPositions = ['68px','340px','580px','850px','1100px']

  console.log()
  console.log('*************************************************')
  console.log('OS arch:' + JSON.stringify(os.arch()));
  console.log('process.platform :' + JSON.stringify(process.platform));
  console.log('*************************************************')
  console.log()

  app.use(compression())               // gzip/deflate outgoing responses 
  app.use(cookieSession({  keys: ['secret1', 'secret2'] }))            // store session state in browser cookie 
  app.use(bodyParser.urlencoded({ extended: true }));    // parse urlencoded request bodies into req.body 
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views'); 
  MongoClient.connect('mongodb://localhost:27017/football', function(err, db) {
    "use strict";
  if(err) throw err;

  // display the main screen with the links to choices of action.	
   app.get('/', function(req, res){
     res.render('football', { 
                                'name' : 'Copa Americas de English'
                               ,'remaining':100
                               ,'playerA': "Garth_Martinsen"
                               ,'playerB': "Betty_Martinsen"
                               ,'questionA': "What_is_the_opposite_of_Tall?"
                               ,'questionB': "What_is_the_opposite_of_Up?"
                               , answerA: 'The_opposite_of_Tall_is_Short.'
                               , answerB:'The_opposite_of_Up_is_Down.' 
                               , ballLocation: 0
                               , pxpos: ballPositions[0]
                               , leftArrowIsVisible : 0
                               , ballDirection : 1
                               , scoreA : 0
                               , scoreB : 0
                            }
               );
   });

   // Define Application routes ---------------------
   routes(app, db)

   //Error when page not found
   app.use(function onerror( err, req, res, next) {
    res.status('404').send({Error: err})
   });
});
 var listener = app.listen(8585, function(){
    app.url= 'http://localhost' + ':' +  listener.address().port ;
    console.log('Listening at:' + app.url);
});
