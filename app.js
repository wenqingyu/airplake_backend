var express = require('express');
var app = new express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('underscore');
var mysql = require('shadow-mysql');
var loadRoute = require('./loadRoute'); //加载路由文件
var routes = loadRoute.allRoutes;
var allRoutesInfo = loadRoute.allRoutesInfo;

//接收json数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 此中间件可以模拟PUT、DELETE等http操作（express4.x中已经不再集成，如果将express升级到4.x需要安装并手动引入）
app.use(methodOverride());
//引入自定义中间件
app.use(extendAPIOutput);
//put,delete请求时，会先发送options请求，需要给回应
app.options('*', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.status = 200;
    res.send();
})

// 加载路由
_.each(allRoutesInfo, function (route) {
    if (!route.middleWare) {
        app[route.method](route.routeRule, route.func);
    } else {
        app[route.method](route.routeRule, route.middleWare, route.func);
    }
}.bind(app));
// 所有路由都未匹配（404）
app.get('*', function (req, res, next) {
    res.sendStatus(404);
});
app.post('*', function (req, res, next) {
    res.sendStatus(404);
});
app.put('*', function (req, res, next) {
    res.sendStatus(404);
});
app.delete('*', function (req, res, next) {
    res.sendStatus(404);
});

app.listen(3001)
/**
 * 给res对象添加拓展的返回方法
 */
function extendAPIOutput(req, res, next) {
    //解决跨域问题
    res.setHeader('Access-Control-Allow-Origin', '*');
    //相应api成功结果
    res.apiSuccess = (data) => {
        res.jsonp({
            status: 'OK',
            msgbody: data
        });
    }
    //相应api出错结果，err是一个Error对象
    res.apiError = function (err) {
        res.jsonp({
            status: 'Error',
            error_code: err.err_code || 'UNKNOW',
            error_msg: err.error_msg || err.toString()
        })
    }
    next();
}

