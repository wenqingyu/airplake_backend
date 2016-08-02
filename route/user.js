'use strict'
exports.autoroute = {
    get: {

    },
    post: {
        '/api/v1/users/login': login,  //登录
        '/api/v1/users/verification': verification, //邮箱验证
    },
    put: {
        '/api/v1/users/:token': update //用户注册
    },
    delete: {

    }
};
var co = require('co');
var nodemailer = require('nodemailer');
var promise = require('bluebird');
var logger = log4js.getLogger('user');
var crypto = require('crypto');
var err = require('../err');
var jwt = require('jsonwebtoken');
var _ = require('underscore');
logger.setLevel(gbObj.conf.logLevel);

/**
 * 登录
 */
function login(req, res) {
    co(function* () {
        //定义需要加密的obj
        let tokenObj = {};
        //对密码进行sha1加密
        let password = sha1(req.body.password);
        let sql = gbObj.mysql.makeSQLSelect('user', ['*'], { flag: 1, password: password, name: req.body.name });
        let result = yield gbObj.pool.queryAsync(sql);
        if (!result || result.length == 0) {
            logger.error(err.loginError);
            return res.apiError(err.loginError);
        }
        _.extend(tokenObj, result[0]);
        //获取登录者的权限
        sql = gbObj.mysql.makeSQLSelect('power', ['source', 'permission'], { roleid: tokenObj.roleid });
        result = yield gbObj.pool.queryAsync(sql);
        //赋值权限
        tokenObj.perssion = result;
        tokenObj.expire = parseInt(Date.parse(new Date())) / 1000 + 1200;
        let token = jwt.sign(tokenObj, 'air');
        res.setHeader('token', token);
        //返回结果
        let resResult = {};
        //1:服务商 2:用户
        resResult.type = tokenObj.vendorid ? 1 : 2;
        resResult.isverification = tokenObj.isverification;
        res.apiSuccess(resResult);
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
    })
}

/**
 * 邮箱验证
 */
function verification(req, res) {
    co(function* () {
        //查看邮箱是否重复
        let sql = gbObj.mysql.makeSQLSelect('user', ['count(1) as num'], { email: req.body.email, flag: 1 });
        let result = yield gbObj.pool.queryAsync(sql);
        if (result[0] && result[0].num > 0) {
            logger.error(err.emailExists);
            return res.apiError(err.emailExists);
        }
        let redirect = gbObj.conf.email.redirect;
        sql = gbObj.mysql.makeSQLSelect('user', ['count(1) as num'], { email: req.body.email });
        result = yield gbObj.pool.queryAsync(sql);
        //若不存在未验证的数据,则插入
        if (result[0] && result[0].num == 0) {
            //信息入库
            sql = gbObj.mysql.makeSQLInsert('user', req.body);
            result = yield gbObj.pool.queryAsync(sql);
        }
        //jwt加密
        let token = jwt.sign({ email: req.body.email, expire: parseInt(Date.parse(new Date())) / 1000 + 1200 }, 'air');
        // 设置邮件内容
        let mailOptions = {
            from: gbObj.conf.email.from, // 发件地址
            to: req.body.email, // 收件列表
            subject: "验证邮箱", // 标题
            html: '你好，欢迎注册账号</br>验证地址:'
            + redirect
            + '?token=' + token// html 内容
        }
        let sendRes = yield sendAsync(mailOptions);
        res.apiSuccess();
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
    })
}

/**
 * 用户注册
 */
function update(req, res) {
    co(function* () {
        let token = jwt.verify(req.params.token, 'air');
        //判断email是否存在
        if (!!!token.email) {
            logger.error(err.invalid);
            return res.apiError(err.invalid);
        }
        //判断是否过期
        if (token.expire < (parseInt(Date.parse(new Date())) / 1000)) {
            logger.error(err.expire);
            return res.apiError(err.expire);
        }
        //判断该用户是否已经验证过
        let sql = gbObj.mysql.makeSQLSelect('user', ['count(1) as num'], { email: token.email, flag: 1 });
        let result = yield gbObj.pool.queryAsync(sql);
        //若该邮箱已验证过，则提示；
        if (result[0] && result[0].num > 0) {
            logger.error(err.verification);
            return res.apiError(err.verification);
        }
        req.body.user.roleid = 3;
        //验证标识位
        req.body.user.flag = 1;
        req.body.user.password = sha1(req.body.user.password);
        //进行保存操作
        sql = gbObj.mysql.makeSQLUpdate('user', req.body.user, { email: token.email });
        result = yield gbObj.pool.queryAsync(sql);
        //生成resheader里面的token
        let tokenObj = {};
        _.extend(tokenObj,req.body.user);
        tokenObj.email = token.email;
        tokenObj.expire = parseInt(Date.parse(new Date())) / 1000 + 1200;
        //获取登录者的权限
        sql = gbObj.mysql.makeSQLSelect('power', ['source', 'permission'], { roleid: tokenObj.roleid });
        result = yield gbObj.pool.queryAsync(sql);
        //赋值权限
        tokenObj.perssion = result;
        res.setHeader('token', jwt.sign(tokenObj, 'air'));
        res.apiSuccess();
    }).catch(function (er) {
        logger.error(er);
        res.apiError(er);
    })
}

function sendAsync(mailOptions) {
    let smtpTransport = nodemailer.createTransport(gbObj.conf.email.trans);
    return new Promise(function (resolve, reject) {
        // 发送邮件
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
            smtpTransport.close(); // 如果没用，关闭连接池
        });
    })
}

/**
 *  sha1加密算法
 **/
function sha1(str) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(str);
    return sha1.digest('hex');
}