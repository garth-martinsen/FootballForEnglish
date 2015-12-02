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
  app.ballPositions= ["50px", "264px","560px","862px","1078px" ];


  console.log()
  console.log('*************************************************')
  console.log('OS arch:' + JSON.stringify(os.arch()));
  console.log('process.platform :' + JSON.stringify(process.platform));
  console.log('Path: ' + __filename );

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

  // display the setup screen where teams are chosen and max number of questions is set. 	
   app.get('/', function(req, res){
     res.render('setup', {name: 'Americas Cup of English'});
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
