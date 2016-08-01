'use strict'
exports.autoroute = {
    get: {
        '/api/v1/servicetypes': list
    },
    post: {
        '/api/v1/servicetypes': add
    },
    put: {

    },
    delete: {

    }
};
var co = require('co');
var promise = require('bluebird');
var logger = log4js.getLogger('servicetype');
var err = require('../err');
logger.setLevel(gbObj.conf.logLevel);

//获取列表
function list(req, res) {
    co(function* () {
        let sql = gbObj.mysql.makeSQLSelect('serviceType', ['*']);
        let result = yield gbObj.pool.queryAsync(sql);
        res.apiSuccess(result);
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
    })
}

//新增
function add(req, res) {
    co(function* () {
        let sql = gbObj.mysql.makeSQLInsert('serviceType', req.body);
        let result = yield gbObj.pool.queryAsync(sql);
        res.apiSuccess();
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
    })
}