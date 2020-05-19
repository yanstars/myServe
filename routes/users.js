var express = require('express');
var router = express.Router();
let multer = require('multer');
const { OOS } = require('../conf/index');
const doDelete = require('../utils/delete');
const Cache = require('../db/redis');
const loginCheck = require('../middleware/loginCheck');
let _ = require('lodash');
const {
    login,
    addFans,
    addpost,
    getUserIdByName,
    getUserInfoById,
    signin,
    isCheckin,
    getlist,
    updateUserInfo,
    getUserInfo,
} = require('../controller/user');
const { getUserPostListById, getCollectedList, collectProductById } = require('../controller/post');
const { getFanslist, getMyFoucslist } = require('../controller/fans');

const { SuccessModel, ErrorModel } = require('../model');

let OSS = require('ali-oss');
let fs = require('fs');

let client = new OSS(OOS);

router.post(
    '/upload',
    multer({
        dest: 'uploads/', //upload文件如果不存在则会自己创建一个。 设置文件存储路径
    }).single('file'),
    async (req, res, next) => {
        if (req.file.length === 0) {
            //判断一下文件是否存在，也可以在前端代码中进行判断。
            res.render('error', { message: '上传文件不能为空！' });
            return;
        } else {
            let file = req.file;
            // let fileInfo = {};
            let name = req.cookies.user;
            fs.renameSync(`uploads/` + file.filename, `uploads/` + name + file.originalname); //这里修改文件名字，比较随意。
            // 获取文件信息
            // fileInfo.mimetype = file.mimetype;
            // fileInfo.originalname = file.originalname;
            // fileInfo.size = file.size;
            // fileInfo.path = file.path;
            // console.log('file', file);
            // 设置响应类型及编码
            res.set({
                'content-type': 'application/json; charset=utf-8',
            });
            res.json({
                code: 6666,
                filename: name + file.originalname,
            });
        }
    }
);

router.post('/login', function (req, res, next) {
    // TODO 配合前台更换 username 类型
    const { username, password } = req.body;
    const result = login(username, password);
    result.then(async (data) => {
        if (data.username) {
            // TODO 完善使用缓存校验身份
            Cache.set(username, username + 'pass');
            Cache.expire(username, 60 * 60);
            res.cookie('user', username, {});
            res.json({
                code: 5000,
            });
            // // 设置 session
            // req.session.username = data.username;
            // req.session.realname = data.realname;

            // res.json(new SuccessModel());
            // return;
        } else {
            res.json(new ErrorModel('登录失败'));
        }
    });
});

router.post('/addPost', loginCheck, async (req, res, next) => {
    let user, cloudfilename, cloudfilepath;
    // suer 是手机号
    // TODO 根据  user 找到真实用户
    if (req.cookies.user) {
        user = req.cookies.user;
    }
    let { title, text, filename } = req.body;
    try {
        // 上传文件到OSS
        let result = await client.put(`/${filename}`, `./uploads/${filename}`);
        [cloudfilename, cloudfilepath] = [result.name, result.url];
        // 存入帖子信息到数据库
        result = addpost(user, cloudfilename, cloudfilepath, title, text);
        result.then((e) => {
            // 删除本地 uploads 下的缓存文件
            doDelete(filename);
        });
        res.json({
            code: 6666,
            msg: '发布成功',
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/getList', loginCheck, async (req, res, next) => {
    let user = '';
    let { page, type } = req.body;
    if (type != 'all' && req.cookies.user) {
        user = req.cookies.user; //
    }
    let result = await getlist(page, user);

    if (user) {
        result = result.map((item) => {
            return {
                path: item.prodpath,
                mvname: item.prodname,
                // username: item.username,
                updatedate: item.date,
                title: item.title,
                text: item.text,
            };
        });
    } else {
        result = result.map((item) => {
            return {
                path: item.prodpath,
                mvname: item.prodname,
                username: item.username,
                updatedate: item.date,
                title: item.title,
                text: item.text,
                productId: item.prodid,
                userid: item.id,
            };
        });
    }

    res.json(JSON.stringify(result));
});

router.post('/signin', async (req, res, next) => {
    const { username, password, tele } = req.body;
    const isSigned = await isCheckin(username, tele);
    if (isSigned) {
        res.json({
            code: 4000,
            message: '该手机号已被注册',
        });
    } else {
        // TODO 改写 async 函数
        const result = signin(username, password, tele);
        result
            .then((e) => {
                res.json({
                    code: 6000,
                    message: '注册成功',
                });
            })
            .catch((e) => {
                res.json({
                    code: 4000,
                    message: '注册失败',
                });
            });
    }
});

router.post('/exit', loginCheck, async (req, res, next) => {
    if (req.cookies.user) {
        res.clearCookie('user');
        res.json({
            msg: '退出成功',
            code: 6666,
        });
    } else {
        res.json({
            msg: '出错了',
            code: 4444,
        });
    }
});

//  个人设置界面  修改并保存用户的个人信息
router.post('/saveUserInfo', loginCheck, async (req, res) => {
    let user = req.cookies.user;
    let { birth, info, sex, username } = req.body;
    let result = await updateUserInfo(user, birth, info, sex, username);
    res.json({
        code: 6666,
        msg: '操作成功',
    });
    console.log('result', result);
});

//  用户  id  查询用户的详细信息 和 作品列表

router.post('/getUserInfoById', loginCheck, async (req, res) => {
    let { userid } = req.body;
    let result = await getUserInfoById(userid);
    console.log('result :>> ', result);
    let list = await getUserPostListById(userid);
    res.json({
        code: 6666,
        msg: '操作成功',
        data: result[0],
        list: list,
    });
});

//  根据 productId  收藏 帖子
router.post('/collectPost', loginCheck, async (req, res) => {
    let user;
    if (req.cookies.user) {
        user = req.cookies.user;
    }
    let { productId } = req.body;
    let userid = await getUserIdByName(user);
    userid = userid[0].id;
    let aa = await collectProductById(userid, productId);
    if (aa.err && aa.err == -1) {
        res.json({
            msg: '已经收藏了',
            code: 4444,
        });
    }
    if (aa.warningCount == 0) {
        res.json({
            code: 6666,
            mdg: '收藏成功',
        });
    } else {
        res.json({
            code: 4444,
            msg: '出错了',
        });
    }
});

// getUserInfoByName

router.get('/getUserInfo', async (req, res, next) => {
    let tele = req.cookies.user;
    let result = await getUserInfo(tele);
    res.json(result[0]);
});

//  获取收藏列表
router.get('/getCollectionList', async (req, res, next) => {
    let name = req.cookies.user;
    let userid = await getUserIdByName(name);
    userid = userid[0].id;
    let result = await getCollectedList(userid);
    res.json(result);
});

//获取 fans 列表
router.get('/fetFansList', async (req, res, next) => {
    let name = req.cookies.user;
    let userid = await getUserIdByName(name);
    userid = userid[0].id;
    let myfans = await getFanslist(userid);
    let myfoucs = await getMyFoucslist(userid);
    let result = {
        myfans,
        myfoucs,
    };

    res.json(result);
});

// 关注
router.post('/follow', async (req, res, next) => {
    let name = req.cookies.user;
    let id = await getUserIdByName(name);
    id = id[0].id;
    let { targetid } = req.body;
    let result = await addFans(id, targetid);
    if (!result.warningCount) {
        res.json({
            code: 6666,
            msg: '关注成功',
        });
    } else {
        res.json({
            code: 4444,
            msg: '出错了',
        });
    }
});

router.get('/mv.mp4', async (req, res, next) => {
    let result = await client.get('/mv/mv.mp4');
    res.end(result.content);
});

router.post('/music.mp4', async (req, res, next) => {
    res.end({ a: 'a' });
});

router.get('/music.mp4', async (req, res, next) => {
    let result = await client.get('/mv/music.mp4');
    res.end(result.content);
});

// router.get('/login-test', (req, res, next) => {
//     if (req.session.username) {
//         res.json({
//             errno: 0,
//             msg: '已登录'
//         })
//         return
//     }
//     res.json({
//         errno: -1,
//         msg: '未登录'
//     })
// })

// router.get('/session-test', (req, res, next) => {
//     const session = req.session
//     if (session.viewNum == null) {
//         session.viewNum = 0
//     }
//     session.viewNum++

//     res.json({
//         viewNum: session.viewNum
//     })
// })

module.exports = router;

//  5000   登录成功
//  6000   注册成功
//  4000   失败
