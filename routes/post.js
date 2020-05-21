var express = require('express');
var router = express.Router();
const Discusssion = require('../model/discuss');
let multer = require('multer');
let fs = require('fs');
const { OOS } = require('../conf/index');
let OSS = require('ali-oss');
const doDelete = require('../utils/delete');

let client = new OSS(OOS);
let discussion = new Discusssion();
const loginCheck = require('../middleware/loginCheck');

const { getPostlist, deleteProMv, getProdCloudName, addpost } = require('../controller/post');

// const { getUserIdByName } = require('../controller/user');

// 上传视频文件  保存到uploads
router.post(
    '/upload',
    multer({
        dest: 'uploads/', //upload文件如果不存在则会自己创建一个。 设置文件存储路径
    }).single('file'),
    async (req, res) => {
        let file = req.file;
        let name = req.cookies.user;
        fs.renameSync(`uploads/` + file.filename, `uploads/` + name + file.originalname); //这里修改文件名字，比较随意。
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.json({
            code: 6666,
            filename: name + file.originalname,
        });
    }
);
// 发表帖子
router.post('/addPost', loginCheck, async (req, res, next) => {
    let cloudfilename, cloudfilepath;
    let userid = req.userid;
    let { title, text, filename } = req.body;
    try {
        // 上传文件到OSS
        let result = await client.put(`/${filename}`, `./uploads/${filename}`);
        [cloudfilename, cloudfilepath] = [result.name, result.url];
        // 存入帖子信息到数据库
        let warningCount = await addpost(userid, title, cloudfilename, cloudfilepath, text);
        if (!warningCount) {
            doDelete(filename);
            res.json({
                code: 6666,
                msg: '发布成功',
            });
        }
    } catch (err) {
        console.log(err);
    }
});

// 查找所有mv帖子
router.post('/getMvList', async (req, res, next) => {
    let { page, type } = req.body;
    let result = await getPostlist(page);
    res.json(result);
});

// 查找自己的发表的 mv 帖子
router.get('/getMvList', loginCheck, async (req, res, next) => {
    let userid = req.userid;
    let result = await getPostlist(6, userid);
    res.json(result);
});

// 删除自己某个视频
router.delete('/getMvList/:id', loginCheck, async (req, res, next) => {
    let userid = req.userid;
    let prodid = req.params.id;
    let fileName = await getProdCloudName(prodid);
    let result = await client.delete(fileName);
    result = await deleteProMv(userid, prodid);
    if (!result.warningCount) {
        res.json({
            code: 6666,
            msg: '删除成功',
        });
    }
});

// 根据用户id查询 mv
router.get('/getMvList/:id', async (req, res, next) => {
    var id = req.params.id;
    res.end(id);
    let result = await getlist(page);
    console.log('result', result);
});
// 发布帖子

// 收藏他人的帖子
// 查找指定用户的帖子

router.delete('/:id', async (req, res, next) => {
    var id = req.params.id;
    res.end(id);
    // // let user = '';
    // let { page, type } = req.body;
    // // if (type != 'all' && req.cookies.user) {
    // //     user = req.cookies.user; //
    // // }
    // let result = await getlist(page);
    // console.log('result', result)
});

// 模糊查找视频帖子

// router.get('/:id', async (req, res) => {
//     var id = req.params.id;

//     let result = await discussion.getDiscuss(id);
//     // console.log('result', result)
//     res.json(result);
// });

// router.delete('/api/discuss/:id', async (req, res) => {
//     var id = req.params.id;
//     console.log('id', id);
//     res.json({
//         code: 6666,
//     });
// });

// router.post('/addDisscuss', async (req, res) => {
//     let { text, targertuserid, productId } = req.body;
//     let { user } = req.cookies;
//     let userid = await getUserIdByName(user);
//     userid = userid[0].id;
//     let model = new Discusssion(userid, targertuserid, productId);
//     console.log('userid, targertuserid, productId, text', userid, targertuserid, productId, text);
//     let result = await model.addToDb(text);
//     console.log('result', result);
//     // if (!result.warningCount) {
//     //     res.json({
//     //         code: 6666,
//     //     });
//     // } else {
//     //     res.json({
//     //         code: 4444,
//     //     });
//     // }
// });

module.exports = router;
