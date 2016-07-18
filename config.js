module.exports = {
    //端口
    port: 3010,
    //email配置
    email: {
        trans: 'smtps://xc_white%40126.com:5345451@smtp.126.com', //邮件服务器
        from: 'xc_white@126.com', //发送者账号
        redirect:'http://www.qq.com'
    },
    //数据库配置
    db: {
        host: '139.196.203.14',
        user: 'root',
        password: '123456',
        database: 'airplake',
        multipleStatements: 'true' //一次执行多条sql
    },
    redis: {
        port: 6379,          // Redis port
        host: '139.196.203.14'
    },
    log: {
        appenders: [
            { type: 'console' }, //控制台输出
            {
                type: 'file', //文件输出
                filename: 'log/portal.log',
                maxLogSize: 10240,
                backups: 3,
                category: 'portal'
            },
            {
                type: 'file', //文件输出
                filename: 'log/http.log',
                maxLogSize: 10240,
                backups: 3,
                category: 'http'
            },
            {
                type: 'file', //文件输出
                filename: 'log/user.log',
                maxLogSize: 10240,
                backups: 3,
                category: 'user'
            }
        ]
    },
    logLevel: 'DEBUG'
}