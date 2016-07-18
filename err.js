/**
 * 定义返回错误文件
 */
module.exports = resErr = {};
resErr.nameExists = createApiError(10001,'Name Is Exists');
resErr.emailExists = createApiError(10002,'Email Is Exists');
resErr.expire = createApiError(10003,'Expire');
//code=出错代码,msg=出错描述信息
function createApiError(code, msg) {
    let err = new Error(msg);
    err.err_code = code;
    err.error_msg = msg;
    return err;
}