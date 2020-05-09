async function put() {
    try {
        let result = await client.put( 'mv/music.mp4','music.mp4');
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}



let OSS = require('ali-oss');

let client = new OSS({
    region: 'oss-cn-beijing',
    //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
    accessKeyId: 'LTAI4GHJMGXHiF4ohSW2a3fb',
    accessKeySecret: 'Y90GIMW6XTxH1xN0DqUAalfUgBSn1W',
    bucket: 'yanstartshare',
});

put()