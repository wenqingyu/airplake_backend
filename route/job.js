'use strict'
exports.autoroute = {
    get: {
        '/api/v1/jobs': list,
        '/api/v1/jobs/:id': detail //明细
    },
    post: {
        '/api/v1/jobs': add
    },
    put: {

    },
    delete: {

    }
};
var co = require('co');
var promise = require('bluebird');
var logger = log4js.getLogger('job');
var err = require('../err');
logger.setLevel(gbObj.conf.logLevel);

//获取列表
function list(req, res) {
    co(function* () {
        let sql = gbObj.mysql.makeSQLSelect('job', ['id', 'title', 'des', 'city', 'servicetype',
            "DATE_FORMAT(starttime,'%Y-%m-%d') as starttime", "DATE_FORMAT(endtime,'%Y-%m-%d') as endtime",
            'max', 'min', 'location']);
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
        let sql = gbObj.mysql.makeSQLInsert('job', req.body);
        let result = yield gbObj.pool.queryAsync(sql);
        res.apiSuccess();
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
    })
}

/**
 * 明细
 */
function detail(req, res) {
    co(function* () {
        let id = req.params.id;
        let sql = gbObj.mysql.makeSQLSelect('job', ['id', 'title', 'des', 'city', 'servicetype',
            "DATE_FORMAT(starttime,'%Y-%m-%d') as starttime", "DATE_FORMAT(endtime,'%Y-%m-%d') as endtime",
            'max', 'min', 'location'], { id: id });
        let result = yield gbObj.pool.queryAsync(sql);
        res.apiSuccess(result);
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
    })
}