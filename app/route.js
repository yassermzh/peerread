/*jshint node:true, globalstrict: true*/
'use strict';


var request = require('request');
var fs= require('fs');
var url= require('url');

module.exports = function (app){

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


    function prepareBody(body, ph){
	body=body.replace(/(href|src)=(["'])(((?!http)[\w\/])+)/g, function(e,p0,p1,p2){
            console.log('e=%s,ph=%s, p0=%s, p1=%s, p2=%s',e,ph, p0,p1,p2);
	    console.log(p0+'='+p1+url.resolve(ph,p2));
            return p0+'='+p1+url.resolve(ph,p2);
	});
	return body;
    }
};
