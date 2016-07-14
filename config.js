module.exports = {
    //端口
    port: 3001,
    //数据库配置
    db: {
        host: '139.196.203.14',
        user: 'root',
        password: '123456',
        database: 'airplake',
        multipleStatements: 'true' //一次执行多条sql
    },
    log: {
        appenders: [
            { type: 'console' }, //控制台输出
            {
                type: 'file', //文件输出
                filename: 'log/portal.log',
                maxLogSize: 1024,
                backups: 3,
                category: 'portal'
            },
            {
                type: 'file', //文件输出
                filename: 'log/http.log',
                maxLogSize: 1024,
                backups: 3,
                category: 'http'
            }
        ]
    },
    logLevel:'DEBUG'
}