const { ErrorModel } = require('../model/');

module.exports = (req, res, next) => {
    if (req.cookies.user) {
        next();
        return;
    }
    res.json(new ErrorModel('未登录'));
};
