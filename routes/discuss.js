var express = require('express');
var router = express.Router();

router.get('/api/discuss/:id', function (req, res) {
    var id = req.params.id;
    console.log('id', id);
    res.json({
        code: 6666,
    });
});

router.delete('/api/discuss/:id', function (req, res) {
    var id = req.params.id;
    console.log('id', id);
    res.json({
        code: 6666,
    });
});

router.post('/api/addDisscuss', function (req, res) {
    let { dicussid } = req.body;

    console.log('id', dicussid);
    res.json({
        code: 6666,
    });
});

module.exports = router;
