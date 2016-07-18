'use strict'
exports.autoroute = {
    get: {
        '/api/v1/portals': list, //获取列表
        '/api/v1/portals/:id': detail //明细
    },
    post: {
        '/api/v1/portals': add //新增服务商入口
    },
    put: {
        '/api/v1/portals/:id': update //更新服务商入口
    },
    delete: {
        '/api/v1/portals/:id': del //删除服务商入口
    }
};
var co = require('co');
var Promise = require('bluebird');
var err = require('../err');
var logger = log4js.getLogger('portal');
logger.setLevel(gbObj.conf.logLevel);

/**
 * 新增服务商入口
 */
function add(req, res) {
    co(function* () {
        //查看团队名称是否重复
        let sql = gbObj.mysql.makeSQLSelect('portal', ['count(1) as num'], { teamname: req.body.teamname });
        let result = yield gbObj.pool.queryAsync(sql);
        if (result[0] && result[0].num > 0) {
            logger.error(err.nameExists);
            return res.apiError(err.nameExists);
        }
        //进行保存操作
        sql = gbObj.mysql.makeSQLInsert('portal', req.body);
        result = yield gbObj.pool.queryAsync(sql);
        res.apiSuccess();
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
    })
}

/**
 * 更新服务商入口
 */
function update(req, res) {
    co(function* () {
        let sql = gbObj.mysql.makeSQLUpdate('portal', req.body, { id: id });
        let result = yield gbObj.pool.queryAsync(sql);
        res.apiSuccess();
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
    })
}

/**
 * 删除服务商入口
 */
function del(req, res) {
    co(function* () {
        let id = req.params.id;
        let sql = gbObj.mysql.makeSQLDelete('portal', { id: id });
        let result = yield gbObj.pool.queryAsync(sql);
        res.apiSuccess();
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
    })
}

/**
 * 获取列表
 */
function list(req, res) {
    co(function* () {
        let sql = gbObj.mysql.makeSQLSelect('portal', ['*']);
        let result = yield gbObj.pool.queryAsync(sql);
        res.apiSuccess(result);
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
        let sql = gbObj.mysql.makeSQLSelect('portal', ['*'], { id: id });
        let result = yield gbObj.pool.queryAsync(sql);
        res.apiSuccess(result);
    }).catch(function (err) {
        logger.error(err);
        res.apiError(err);
    })
}