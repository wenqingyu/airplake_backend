'use strict'
exports.autoroute = {
    get: {
        '/api/v1/vendors': list, //获取列表
        '/api/v1/vendors/:id': detail //明细
    },
    post: {
        '/api/v1/vendors': add //新增服务商入口
    },
    put: {
        '/api/v1/vendors/:id': update //更新服务商入口
    },
    delete: {
        '/api/v1/vendors/:id': del //删除服务商入口
    }
};
var co = require('co');
var Promise = require('bluebird');
var err = require('../err');
var logger = log4js.getLogger('portal');
var jwt = require('jsonwebtoken');
logger.setLevel(gbObj.conf.logLevel);

/**
 * 新增服务商入口
 */
function add(req, res) {
    co(function* () {
        //查看团队名称是否重复
        let sql = gbObj.mysql.makeSQLSelect('vendor', ['count(1) as num'], { teamname: req.body.vendor.teamname });
        let result = yield gbObj.pool.queryAsync(sql);
        if (result[0] && result[0].num > 0) {
            logger.error(err.teamnameExists);
            return res.apiError(err.teamnameExists);
        }
        //进行保存操作
        sql = gbObj.mysql.makeSQLInsert('vendor', req.body.vendor);
        result = yield gbObj.pool.queryAsync(sql);
        req.body.user = req.body.user || {};
        req.body.user.name = req.body.user.name || req.token.name;
        req.body.user.roleid = 4;
        req.body.user.vendorid = result.insertId;
        //修改用户表的vendorid
        sql = gbObj.mysql.makeSQLUpdate('user', req.body.user, { email: req.token.email });
        result = yield gbObj.pool.queryAsync(sql);
        //获取服务商的权限
        sql = gbObj.mysql.makeSQLSelect('power', ['source', 'permission'], { roleid: 4 });
        result = yield gbObj.pool.queryAsync(sql);
        //赋值权限
        req.token.perssion = result;
        req.token.roleid = 4;
        req.token.vendorid = result.insertId;
        res.setHeader('x-token', jwt.sign({email:req.token.email,name:req.body.user.name,roleid:4,
                              isverification:null}, 'air'));
        gbObj.redis.setex(req.token.email,1200,JSON.stringify(req.token));
        res.apiSuccess();
    }).catch(function (er) {
        logger.error(er);
        res.apiError(er);
    })
}

/**
 * 更新服务商入口
 */
function update(req, res) {
    co(function* () {
        //查看团队名称是否重复
        let id = req.params.id;
        let sql = "SELECT count(1) as num FROM vendor WHERE teamname = @teamname@ AND id!=@id@;";
        sql = gbObj.mysql.makeSQL(sql, { teamname: req.body.teamname, id: id });
        let result = yield gbObj.pool.queryAsync(sql);
        if (result[0] && result[0].num > 0) {
            logger.error(err.nameExists);
            return res.apiError(err.nameExists);
        }
        sql = gbObj.mysql.makeSQLUpdate('vendor', req.body, { id: id });
        result = yield gbObj.pool.queryAsync(sql);
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