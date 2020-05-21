const { ErrorModel } = require('../model/');
const Cache = require('../db/redis');

module.exports = (req, res, next) => {
    new Promise((resolve, reject) => {
        if (req.cookies.user) {
            Cache.get(req.cookies.user, (err, data) => {
                req.userid = data;
                resolve(next());
            });
        } else {
            // return res.redirect('/sign/in');
            res.json(new ErrorModel('未登录'));
        }
    });
};
