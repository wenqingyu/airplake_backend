'use strict'
exports.autoroute = {
    get: {
    },
    post: {
        '/api/v1/users/verification': verification //邮箱验证
    },
    put: {

    },
    delete: {

    }
};
var co = require('co');
var nodemailer = require('nodemailer');
var promise = require('bluebird');
var logger = log4js.getLogger('user');
var crypto = require('crypto');
logger.setLevel(gbObj.conf.logLevel);

/**
 * 邮箱验证
 */
function verification(req, res) {
    co(function* () {
        //查看用户名是否重复
        let sql = gbObj.mysql.makeSQLSelect('user', ['count(1) as num'], { name: req.body.name });
        let result = yield gbObj.pool.queryAsync(sql);
        if (result[0] && result[0].num > 0) {
            logger.error(err.nameExists);
            return res.apiError(err.nameExists);
        }
        //对密码进行加密
        let password = sha1(req.body.password);
        // 设置邮件内容
        let mailOptions = {
            from: gbObj.conf.email.from, // 发件地址
            to: req.body.email, // 收件列表
            subject: "验证邮箱", // 标题
            html: '你好，欢迎注册账号</br>验证地址:'+ gbObj.conf.email.redirect +'?name=' + req.body.name + '&email=' + req.body.email + '&password=' + password// html 内容
        }
        let sendRes = yield sendAsync(mailOptions);
        res.apiSuccess();
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
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