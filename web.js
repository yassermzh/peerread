/*jshint node:true, globalstrict: true*/
'use strict';

var express = require('express');
var http = require('http');
var passport = require('passport');

var app = express();


// development only
app.configure('development', function(){
    app.set('db uri', 'localhost/dev');
})

// production only
app.configure('production', function(){
    app.set('db uri', 'n.n.n.n/prod');
})

app.configure(function(){

    app.set('views', __dirname + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser());
    app.use(express.bodyParser());

    app.use(express.methodOverride());
    app.use(express.session({ secret: 'keyboard cat' }));

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    
    // simple logger
    // app.use(function(req, res, next){
    // 	console.log('%s %s', req.method, req.url);
    // 	next();
    // });
    
    app.use('/assets/',express.static(__dirname+'/public/'));
});

require('./app/route')(app);

var port = process.env.PORT || 4004;
var server = http.createServer(app);
require('./app/ws-server')(server);
server.listen(port);
console.log('server is listening on port '+port);
