const conf = require('../oos/conf.js');
let OSS = require('ali-oss');
let client = new OSS(conf);

module.exports = class mv {
    constructor(data, user, date) {
        // data 视频源
        // user 创建用户
        // date 创建时间

        this.data = data;
        this.user = user;
        this.date = date;
    }

    async up(remote, data) {
        try {
            let result = await client.put(remote, data);
            // let result = await client.put('object-name', 'local file');
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }
};
