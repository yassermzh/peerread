
var fs = require('fs'),
    passport = require('./auth');

var controller = require('./controllers/bootstrap-controller');
var vulnsController = require('./controllers/vulns-controller'); 

function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        //res.redirect("/login");
        res.send(401);
    }
}

module.exports = function (app) {


    // app.post('/post',function(req,res){
    //     console.log('body.rule=%s', req.body.rule);
    //     res.json(req.body);
    // });
    app.all('/vuln/:vulnSrc/clone/:action', controller.downloader);
    app.all('/vuln/:vulnSrc/scrape/:action', controller.scraper);
    app.all('/vuln/:vulnSrc/schedule/:action', controller.scheduler);
    app.all('/vuln/stats', controller.stats);
    app.all('/vuln/:vulnSrc?/:id?', controller.viewer);
    // app.all('/vuln/graph/:vulnSrc?/:id?', controller.vulns);
    app.get('/graph/', vulnsController.list);
    app.get('/graph/:id', vulnsController.show);

    // app.get('/vuln/:vulnSrc/:id', controller.viewer);
    // app.post('/vuln/:vulnSrc?', controller.viewer);
    // clone osvdb
    // app.get('/clone/osvdb/start', osvdbDownloader.start);
    // app.get('/clone/osvdb/stop', osvdbDownloader.stop);
    // app.get('/clone/osvdb/status', osvdbDownloader.getStatus);

    // // clone secunia
    // app.get('/clone/secunia/start', secuniaDownloader.start);
    // app.get('/clone/secunia/stop', secuniaDownloader.stop);
    // app.get('/clone/secunia/status', secuniaDownloader.getStatus);

    // // scrape osvdb
    // app.get('/scrape/osvdb/start', osvdbScraper.start);
    // app.get('/scrape/osvdb/stop', osvdbScraper.stop);
    // app.get('/scrape/osvdb/status', osvdbScraper.getStatus);
    // app.get('/osvdb/:id', osvdbScraper.getVulnByID);

    // // scrape secunia
    // app.get('/scrape/secunia/start', secuniaScraper.start);
    // app.get('/scrape/secunia/stop', secuniaScraper.stop);
    // app.get('/scrape/secunia/status', secuniaScraper.getStatus);
    // app.get('/secunia/:id', secuniaScraper.getVulnByID);

    // // scrape nvd
    // app.get('/scrape/nvd/start', nvdScraper.start);
    // app.get('/scrape/nvd/stop', nvdScraper.stop);
    // app.get('/scrape/nvd/status', nvdScraper.getStatus);
    // app.get('/nvd/:id', nvdScraper.getVulnByID);

    // schedule
    
    // app.all('/schedule/:vulnSrc/:action', controller.scheduler);

    // app.get(/(repo\/.+)$/, function(req, res) { res.sendfile(req.params[0]); });

 
    // app.get('/partials/admin', authenticatedOrNot, function(req,res){
    //     // res.send('fuck youuuuuuuuu');
    //     res.render('partials/admin');
    // });

    app.get('/partials/:file', function(req,res){
        // res.send('fuck youuuuuuuuu');
        res.render('partials/'+req.params.file);
    });

    // app.get('/', function(req,res){
    //     res.render('index');
    // });
    
    
    app.get('/show/filter', function(req,res){
        res.render('filter');
    });

    // app.get('/admin', function(req,res){
    //     res.render('admin');
    // });
    

    // authentication 

      // // user routes
      // app.get('/login', users.login)
      // app.get('/signup', users.signup)
      // app.get('/logout', users.logout)
      // app.post('/users', users.create)
    // route to test if the user is logged in or not
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
    
    // app.post('/login',
    //     passport.authenticate('local',
    //         { successRedirect: '/',
    //         failureRedirect: '/login'
    //         })
    // );
    
    // app.get('/login', function (req, res) {
    //     res.sendfile('./app/views/login.html');
    // });

    // app.get('/logout', function(req, res){
    //   req.logout();
    //   res.redirect('/');
    // });


    app.get('/img/logo/:vulnSrc', function(req,res){
        fs.readFile('./public/img/'+vulnSrc+'_logo.png',function(err, buf) {
            if (err) {
                res.json(false);
                return;
            }
            var imgBase64 = buf.toString('base64');
            res.json({'encodedImg': imgBase64, 'name': vulnSrc});
        });
        // res.send('hello');
    });
    // logger.info('router called...');


    // app.get('/assets/*', function(req,res){
    //     res.send(401);
    // });

    app.get('index', function(req,res){
        res.render('index');
    });

    
    app.get(/^((?!\/assets\/).)*$/, function(req,res){
        res.render('show');
    });

    // app.get("/fuck*", function(req,res){
    //     res.location('/fuck/');
    //     res.render('show');
    // });
};