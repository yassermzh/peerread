
var express = require('express'),
    path = require('path'),
    config = require('./app/config/config').server,
    logger = require('./app/util/log'),
    passport = require('./app/auth');
    

var app = express();
// express settings
//require('./config/express')(app, config, passport);

// console.log(path.join(__dirname, 'repo'));
app.configure(function(){

  // app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  // app.engine('html', require('jade').__express    );

  app.use(express.favicon());
  // app.use(express.logger('dev'));

  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
    // app.use(require('stylus').middleware(__dirname + '/public'));
  app.use('/repo',express.static(path.join(__dirname, 'repo')));
  app.use('/assets',express.static(path.join(__dirname, 'public')));
     
    // app.use(function(err, req, res, next){
    //     console.error(err.stack);
    //     res.send(500, 'Something broke!');
    // });

});

// Bootstrap routes

require('./app/routes')(app);


// Start the app by listening on <port>
// var port = process.env.PORT || 3000;
var port=config.port;
app.listen(port);
logger.info('Express app started on port '+port);
