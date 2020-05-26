var express = require('express');
var router = express.Router();
const Discusssion = require('../model/discuss');
let multer = require('multer');
let fs = require('fs');
const { OOS } = require('../conf/index');
let OSS = require('ali-oss');
const doDelete = require('../utils/delete');
const { getUserInfoById } = require('../controller/user');
const { Dcollect, Dstar } = require('../controller/discuss');

let client = new OSS(OOS);
let discussion = new Discusssion();
const loginCheck = require('../middleware/loginCheck');

const {
    getPostlist,
    getMVlistByKeyWord,
    getUserDrMvList,
    collectOrStar,
    deleteProMv,
    getProdCloudName,
    addpost,
    getMvListGroupByType,
    publishDaMvById,
} = require('../controller/post');

// const { getUserIdByName } = require('../controller/user');

// 上传视频文件  保存到uploads
router.post(
    '/upload',
    //upload文件如果不存在则会自己创建一个。 设置文件存储路径
    multer({
        dest: 'uploads/',
    }).single('file'),
    async (req, res) => {
        let file = req.file;
        let name = req.cookies.user;
        //这里修改文件名字，比较随意。
        fs.renameSync(`uploads/` + file.filename, `uploads/` + name + file.originalname);
        res.set({ 'content-type': 'application/json; charset=utf-8' });
        res.json({
            code: 6666,
            filename: name + file.originalname,
        });
    }
);

//删除临时储存视频文件

router.delete('/removeFile/:name', async (req, res) => {
    let { name } = req.params;
    doDelete(name);
    res.json({
        code: 6666,
        msg: '操作成功',
    });
});
// 发表帖子
router.post('/addPost', loginCheck, async (req, res, next) => {
    // title: this.formItem.title,
    // text: this.formItem.textarea,
    // filename: this.upfileName,
    // type: this.checkedCities[0],
    // isDraft: isDraft
    let cloudfilename, cloudfilepath;
    let userid = req.userid;
    let { title, text, filename, type, isDraft } = req.body;
    try {
        // 上传文件到OSS
        let result = await client.put(`/${filename}`, `./uploads/${filename}`);
        [cloudfilename, cloudfilepath] = [result.name, result.url];
        // 获取用户详细信息
        let userinfo = await getUserInfoById(userid);
        let username = userinfo.username;
        // 存入帖子信息到数据库
        let warningCount = await addpost(userid, username, title, cloudfilename, cloudfilepath, text, type, isDraft);
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
// 模糊查询 关键词 帖子
router.post('/homeSearch', async (req, res, next) => {
    let { keyWord } = req.body;
    let result = await getMVlistByKeyWord(keyWord);
    res.json(result);
});

// 查找所有mv帖子
router.post('/getMvList', async (req, res, next) => {
    let { page, type } = req.body;
    if (type == 'all') {
        let music = await getMvListGroupByType('音乐');
        let movie = await getMvListGroupByType('电影');
        let game = await getMvListGroupByType('游戏');
        let dance = await getMvListGroupByType('舞蹈');
        let result = await getPostlist(page);
        res.json({
            music,
            movie,
            game,
            dance,
            result,
        });
    }
});

// 草稿箱视频 发布
router.get('/publishDaMv/:id', loginCheck, async (req, res, next) => {
    let prodid = req.params.id;
    let result = await publishDaMvById(prodid);
    res.json({
        result,
        code: 6666,
        msg: '发布成功',
    });
});

// 查找自己的发表的 mv 帖子
router.get('/getMvList', loginCheck, async (req, res, next) => {
    let userid = req.userid;
    let result = await getPostlist(1000, userid);
    res.json(result);
});

// 查找自己草稿箱的 mv 帖子
router.get('/getDaList', loginCheck, async (req, res, next) => {
    let userid = req.userid;
    let result = await getUserDrMvList(1000, userid);
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
});

//  根据 productId  收藏 /  点赞   帖子
//  type
//   0  点赞
//   1 收藏
router.post('/collectAndStar', loginCheck, async (req, res) => {
    let userid = req.userid;
    let { isCollect, isMv, id } = req.body;
    let result;
    // 是针对视频操作
    if (isMv) {
        result = await collectOrStar(userid, id, isCollect);
        if (result.err && result.err == -1) {
            res.json({
                msg: isCollect ? '已经收藏了' : '已经点赞了',
                code: 4444,
            });
        } else if (result.warningCount == 0) {
            res.json({
                code: 6666,
                msg: isCollect ? '收藏成功' : '点赞成功',
            });
        } else {
            res.json({
                code: 4444,
                msg: '出错了',
            });
        }
    } else {
        if (isCollect) {
            result = await Dcollect(userid, id);
        } else {
            result = await Dstar(userid, id);
        }
        if (result.err && result.err == -1) {
            res.json({
                msg: isCollect ? '已经收藏了' : '已经点赞了',
                code: 4444,
            });
        } else if (result.warningCount == 0) {
            res.json({
                code: 6666,
                msg: isCollect ? '收藏成功' : '点赞成功',
            });
        } else {
            res.json({
                code: 4444,
                msg: '出错了',
            });
        }
        // 针对评论操作
    }
});

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
