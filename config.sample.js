module.exports = {
    //端口
    port: 3010,
    //email配置
    email: {
        trans: 'xxxx', //邮件服务器
        from: 'xxx', //发送者账号
        redirect:'http://www.qq.com'
    },
    //数据库配置
    db: {
        host: 'xxxx',
        user: 'root',
        password: 'xxx',
        database: 'xxx',
        multipleStatements: 'true' //一次执行多条sql
    },
    redis: {
        port: 6379,          // Redis port
        host: 'xxxx'
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