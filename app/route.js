/*jshint node:true, globalstrict: true*/
'use strict';


var request = require('request');
var fs= require('fs');
var url= require('url');

var passport = require('./auth');

function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        //res.redirect("/login");
        res.send(401);
    }
}


module.exports = function (app){

    app.get('./page.html',function(req, res, next){
	res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
	res.setHeader("Pragma", "no-cache");
	res.setHeader("Expires", "0");
	return next();
    });

    app.post('/read',function(req,res){
	var reqUrl=req.body.url;
	var reqUrlParsed=url.parse(reqUrl);
	request(reqUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
		body=prepareBody(body,reqUrl);
		// console.log(body);
		fs.writeFileSync('./public/page.html', body);
		res.render('main');
            }
	});
    });

    app.get('/main', function(req,res){
	res.render('main');
    });

    app.post('/getURL', function(req,res){
	console.log(req.body.url);
	var reqUrl=req.body.url;
	request(reqUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
		body=prepareBody(body, reqUrl);
		fs.writeFileSync('./public/page.html', body);
		res.send('got data, url='+req.body.url);
            }
	});
    });

    app.get('/app', function(req,res){
        res.render('swa');
    });
    

    app.get('/auth/loggedin', function(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
    });

    // route to log in
    app.post('/auth/login', passport.authenticate('local'), function(req, res) {
      res.send(req.user);
    });

    // route to log out
    app.get('/auth/logout', function(req, res){
      req.logout();
      res.send(200);
    });

    app.get('/test', function(req,res){
	res.render('test-ng');
    });
    
    app.get('/partials/:file', function(req,res){
        // res.send('fuck youuuuuuuuu');
        res.render('partials/'+req.params.file);
    });

    app.get(/^((?!\/assets\/).)*$/, function(req,res){
        res.render('swa');
    });

    
    function prepareBody(body, ph){
	body=body.replace(/(href|src)=(["'])(((?!http)[\w\/])+)/g, function(e,p0,p1,p2){
            console.log('e=%s,ph=%s, p0=%s, p1=%s, p2=%s',e,ph, p0,p1,p2);
	    console.log(p0+'='+p1+url.resolve(ph,p2));
            return p0+'='+p1+url.resolve(ph,p2);
	});
	return body;
    }
};
