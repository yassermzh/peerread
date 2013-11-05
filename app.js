/*jshint node:true, globalstrict: true*/
'use strict';

var express = require('express');


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

});
console.log(__dirname);
app.use(express.static(__dirname+'/public/'));

require('./app/route')(app);

app.listen(4004);
console.log('server is listening on port 4004');
