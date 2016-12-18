var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();
// 设置 handlebars 视图引擎
var handlebars = require('express3-handlebars')
                 .create({defaultLayout:'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

//指定程序端口
app.set('port',process.env.PORT || 3000);



//static 中间件
app.use(express.static(__dirname + '/public'));

//中间件来检测查询字符串中的 test=1
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
    next();
});

app.get('/', function(req, res){
        // res.type('text/plain');
        // res.send('Meadowlark Travel');
        res.render('home');
});

app.get('/about', function(req, res){
        // res.type('text/plain');
        // res.send('About Meadowlark Travel');
        // var randomFortune = 
        //         fortunes[Math.floor(Math.random() * fortunes.length)];
        res.render('about',{
            fortune:fortune.getFortune(),
            pageTestScript: '/qa/tests-about.js'
        });
});

app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});

//查看浏览器发送的信息
app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

// 定制404页面
app.use(function(req, res){
            //  res.type('text/plain');
             res.status(404);
            //  res.send('404 - Not Found');
            res.render('404');
});

//500页面
app.use(function (err,req,res,next) {
    console.error(err.stack);
    // res.type('text/plain');
    res.status(500);
    // res.send('500 - Server Error');
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});