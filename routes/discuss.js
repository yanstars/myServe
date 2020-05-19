var express = require('express');
var router = express.Router();
const Discusssion = require('../model/discuss');
let discussion = new Discusssion();

const { getUserIdByName } = require('../controller/user');

router.get('/:id', async (req, res) => {
    var id = req.params.id;

    let result = await discussion.getDiscuss(id);
    res.json(result);
});

router.delete('/api/discuss/:id', async (req, res) => {
    var id = req.params.id;
    console.log('id', id);
    res.json({
        code: 6666,
    });
});

router.post('/addDisscuss', async (req, res) => {
    let { text, targertuserid, productId } = req.body;
    let { user } = req.cookies;
    let userid = await getUserIdByName(user);
    userid = userid[0].id;
    let model = new Discusssion(userid, targertuserid, productId);
    console.log('userid, targertuserid, productId, text', userid, targertuserid, productId, text);
    let result = await model.addToDb(text);
    console.log('result', result);
    // if (!result.warningCount) {
    //     res.json({
    //         code: 6666,
    //     });
    // } else {
    //     res.json({
    //         code: 4444,
    //     });
    // }
});

module.exports = router;
