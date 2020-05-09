// const { ErrorModel } = require('../model/resModel')

module.exports = (req, res, next) => {
    if (req.session.username) {
        next();
        return;
    }
    res.json(
        // new ErrorModel('未登录')
        {
            code: '-1',
            meg: '未登录',
        }
    );
};
