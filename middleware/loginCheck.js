const { ErrorModel } = require('../model/');
const Cache = require('../db/redis');

module.exports = (req, res, next) => {
    new Promise((resolve, reject) => {
        if (req.cookies.user) {
            Cache.get(req.cookies.user, (err, data) => {
                req.userid = data;
                // res.json(new ErrorModel('未登录'));
                resolve(next());
            });
        } else {
            res.json(new ErrorModel('未登录'));
        }
    });
};
