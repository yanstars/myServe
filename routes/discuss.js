var express = require('express');
var router = express.Router();
const Discusssion = require('../model/discuss');
let discussion = new Discusssion();
const loginCheck = require('../middleware/loginCheck');
let moment = require('moment');

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let result = await discussion.getDiscuss(id);
    res.json({
        code: 6666,
        list: result,
        msg:'查询成功'
    });
});

// router.delete('/api/discuss/:id', async (req, res) => {
//     var id = req.params.id;
//     console.log('id', id);
//     res.json({
//         code: 6666,
//     });
// });



router.post('/addDisscuss', loginCheck, async (req, res) => {
    let { text, pid, pname, username, prodid } = req.body;
    let userid = req.userid;
    // 获取当前时间
    let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    // 添加记录到数据库
    let result = await discussion.addToDb(userid, username, pid, pname, prodid, text, date);
    if (!result.warningCount) {
        res.json({
            code: 6666,
            msg: '评论成功',
        });
    } else {
        res.json({
            code: 4444,
            msg: '评论失败',
        });
    }
});

module.exports = router;
