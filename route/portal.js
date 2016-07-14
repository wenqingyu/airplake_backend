'use strict'
exports.autoroute = {
    get: {

    },
    post: {
        '/api/v1/portals': add //新增服务商入口
    },
    put: {

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
        sql = gbObj.mysql.makeSQLInsert('portal',req.body);
        result = yield gbObj.pool.queryAsync(sql);
        res.apiSuccess();
    }).catch(function (err) {
        logger.error(err);
        res.apiError(er);
    })
}