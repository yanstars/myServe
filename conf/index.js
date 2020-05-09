const env = process.env.NODE_ENV; // 环境参数

let MYSQL, REDIS, OOS;

if (env == 'dev') {
    MYSQL = {
        host: '59.110.238.56',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'webapp',
    };
    REDIS = {
        host: '59.110.238.56',
        port: 6379,
    };
    OOS = {
        region: 'oss-cn-beijing',
        //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
        accessKeyId: 'LTAI4GHJMGXHiF4ohSW2a3fb',
        accessKeySecret: 'Y90GIMW6XTxH1xN0DqUAalfUgBSn1W',
        bucket: 'yanstartshare',
    };
} else {
    MYSQL = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'webapp',
    };
    REDIS = {
        host: '59.110.238.56',
        port: 6379,
    };
    OOS = {
        region: 'oss-cn-beijing',
        //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
        accessKeyId: 'LTAI4GHJMGXHiF4ohSW2a3fb',
        accessKeySecret: 'Y90GIMW6XTxH1xN0DqUAalfUgBSn1W',
        bucket: 'yanstartshare',
    };
}

module.exports = {
    MYSQL,
    REDIS,
    OOS
};
