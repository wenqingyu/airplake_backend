var express = require('express');
var app = new express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('underscore');
global.gbObj = {};  //定义全局变量
gbObj.conf = require('./config');
gbObj.mysql = require('shadow-mysql');
global.log4js = require('log4js');
log4js.configure(gbObj.conf.log);
var loadRoute = require('./loadRoute'); //加载路由文件
var routes = loadRoute.allRoutes;
var allRoutesInfo = loadRoute.allRoutesInfo;
var jwt = require('jsonwebtoken');
var err = require('./err');
const perssion = {
    get: 2,
    post: 4,
    put: 8,
    delete: 16
}

//初始化连接
init();
//记录请求
var logger = log4js.getLogger('http');
logger.setLevel(gbObj.conf.logLevel);
app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));
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
//认证权限
app.use(auth);

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
//开启服务器监听
app.listen(gbObj.conf.port);

/**
 * 权限认证
 */
function auth(req, res, next) {
    try {
        //正则匹配，先把登录，验证几个路由过滤，因为不需要验证token
        var reg = /^\/api\/v1\/users\//;
        if(reg.test(req.url) && (req.method.toLocaleLowerCase()=='post' || req.method.toLocaleLowerCase()=='put')){
            return next();
        }
        //非法路由
        if (!req.headers.token) {
            logger.error(err.tokenError);
            return res.apiError(err.tokenError);
        }
        //获取token
        let token = jwt.verify(req.headers.token, 'air');
        //判断是否过期
        if (token.expire < (parseInt(Date.parse(new Date())) / 1000)) {
            logger.error(err.expire);
            return res.apiError(err.expire);
        }
        //获取路由的资源
        let source = req.url.split('/')[3];
        //是否具有该路由权限
        let isPower = false;
        for (let i = 0; i < token.perssion.length; i++) {
            //该路由对应的权限值
            let itemPower = perssion[req.method.toLocaleLowerCase()];
            //判断资源是否一致并且权限值一致
            if (token.perssion[i].source == source && ((itemPower & parseInt(token.perssion[i].permission)) == itemPower)) {
                isPower = true;
                break;
            }
        }
        if (!isPower) {
            logger.error(err.authError);
            return res.apiError(err.authError);
        }else{
            next();
        }
    } catch (e) {
        logger.error(e);
        return res.apiError(e);
    }
}

/**
 * 给res对象添加拓展的返回方法
 */
function extendAPIOutput(req, res, next) {
    //解决跨域问题
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Headers', 'token');
    //相应api成功结果
    res.apiSuccess = (data) => {
        res.jsonp({
            status: 'OK',
            code: 200,
            data: data
        });
    }
    //相应api出错结果，err是一个Error对象
    res.apiError = (err) => {
        res.jsonp({
            status: 'Error',
            error_code: err.err_code || 500,
            error_msg: err.error_msg || err.toString()
        })
    }
    next();
}

/**
 * 初始化连接
 */
function init() {
    //初始化数据库
    gbObj.pool = new gbObj.mysql.Pool(gbObj.conf.db); //将连接池对象放在全局对象上面
}