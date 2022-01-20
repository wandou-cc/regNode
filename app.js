var createError = require('http-errors');
var express = require('express');
var path = require('path');

const dbObj = require("./utils/Db"); // 数据库对象

var app = express();
app.use(dbObj.connection); // 使用单例模式建立数据库连接， 给express应用对象添加中间件功能
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static("./www"))

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
var reg = require('./routes/reg.js');
app.use('/api', reg);

app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;