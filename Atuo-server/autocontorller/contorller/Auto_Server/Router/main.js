let express = require("express")
let md5 = require("md5")
let axios = require("axios")
let path = require("path")
let fs = require("fs")

// 使用multiparty处理表单数据
const multer = require('multer');

let router = express.Router()

// 引入数据库api
let mysql = require("../Api/mysql")
// 引入时间api
let time = require("../Api/time")
// 引入写入日志
let log = require("../Api/log")

// 请求手机信息
router.get("/", function (req, res) {
    // 查询是否离线 写两个查询是为了解决运行顺序问题
    let sql = `SELECT * FROM autocontorller.autophone`
    mysql.selectMysql(sql).then((val) => {
        val.forEach(phone => {
            if (time.counttime(phone.time, 1) && phone.phonestatus != '离线') {
                let sql = `UPDATE autocontorller.autophone SET phonestatus = '离线',isrun=0 WHERE (id = '${phone.id}');`
                mysql.selectMysql(sql).catch((err) => {
                    console.log(err);
                })
            }
        });
    }).catch((err) => {
        console.log(err);
    })
    mysql.selectMysql(sql).then((val) => {
        if (val.length != 0) {
            res.send({ code: 200, msg: "数据库查询数据成功", data: val })
        } else {
            res.send({ code: 200, msg: "数据库查询数据成功", data: "" })
        }
    }).catch((err) => {
        console.log(err);
    })
})

// 请求脚本信息
router.get("/script", function (req, res) {
    let sql = "SELECT * FROM autocontorller.autoscript;"
    mysql.selectMysql(sql).then((val) => {
        if (val.length != 0) {
            res.send({ code: 200, msg: "数据库查询数据成功", data: val })
        } else {
            res.send({ code: 200, msg: "数据库查询数据成功", data: "" })
        }
    }).catch((err) => {
        console.log(err);
    })
})

// 是否运行单个脚本
router.get("/oddrun", function (req, res) {
    let query = req.query

    // 前端0为false 1为true
    let isrun = +query.isrun

    // 点击单个运行或停止时 根据ip
    let ip = query.ip

    // 根据前段点击传过来的设备ip查询数据
    let sql = `SELECT * FROM autocontorller.autophone where phoneip='${ip}'`
    mysql.selectMysql(sql).then((val) => {
        if (isrun) {
            // 写入日志
            let logtime = time.logtime()
            let obj = { time: time.gettime(), content: `设备${val[0].phoneip}开始运行脚本` }
            log(logtime, obj)
        } else {
            // 写入日志
            let logtime = time.logtime()
            let obj = { time: time.gettime(), content: `设备${val[0].phoneip}停止运行脚本` }
            log(logtime, obj)
        }

        // 更新isrun
        let sql = `UPDATE autocontorller.autophone SET isrun = '${isrun}' WHERE (phoneip = '${val[0].phoneip}');`
        mysql.selectMysql(sql).then(() => {
            res.send({ code: 200, msg: "执行成功" })
        }).catch((err) => {
            res.send({ code: 201, msg: "执行失败" })
            console.log(err);
        })
    }).catch((err) => {
        console.log(err);
    })
})
// 运行多个脚本
router.post("/evenrun", function(req, res){
        if (req.body.msg.isrun) {
            // 写入日志
            let logtime = time.logtime()
            let obj = { time: time.gettime(), content: `运行全部在线设备` }
            log(logtime, obj)
        } else {
            // 写入日志
            let logtime = time.logtime()
            let obj = { time: time.gettime(), content: `停止全部在线设备` }
            log(logtime, obj)
        }

        let sql = `SELECT * FROM autocontorller.autophone`
        let arr = req.body.msg.array

        console.log(arr);

        mysql.selectMysql(sql).then((val) => {
            val.forEach((v) => {
                arr.forEach((a) => {
                    if(v.phoneip == a.ip){
                        let sqle = `UPDATE autocontorller.autophone SET isrun = '${req.body.msg.isrun}', scriptid = '${a.scriptid}' WHERE (phoneip = '${v.phoneip}');`

                        mysql.selectMysql(sqle).then(() => {
                            res.send({code: 200, msg: "运行所有成功"})
                        }).catch((err) => {
                            res.send({code: 200, msg: "运行所有失败"})
                            console.log(err);
                        })
                    }
                })
            })
        }).catch((err) => {
            console.log(err);
        }) 
})


// 踢出设备
router.get("/deletephone", function (req, res) {
    let query = req.query

    let sql = `DELETE FROM autocontorller.autophone WHERE (phoneip = '${query.ip}');`
    mysql.selectMysql(sql).then(() => {
        // 写入日志
        let logtime = time.logtime()
        let obj = { time: time.gettime(), content: `踢出设备${query.ip}` }
        log(logtime, obj)

        res.send({ code: 200, msg: "踢出成功" })
    }).catch((err) => {
        console.log(err);
        res.send({ code: 201, msg: "踢出失败" })
    })
})

// 导入脚本的接口,  dest里面，存放着脚本写入的地方的路径. multer会自动获取上传的脚本， 并自动写入指定的目录
router.post("/addscript", multer({ dest: path.join(__dirname, "../script") }).any(), (req, res) => {
    console.log(req.files[0]);
    // fieldname, formData.append里面的键值对的键名
    // originalname, 文件的原本名字
    // filename, 文件第一次被插件自动写入的时候的文件名
    // path, 文件被写入的路径

    //前端输入框输入的name
    let name = req.body.name

    let { originalname } = req.files[0]

    // 文件重命名的地方， 以及名字。  path.parse(originalname).ext 上传的文件的原文件名中的后缀 .js
    const newName = path.join(__dirname, `../script/${name}${path.parse(originalname).ext}`)

    // 添加到数据库的路径
    let mysqlpath = `../script/${name}${path.parse(originalname).ext}`

    // 第一个参数， 文件的原路径
    // 第二个参数， 文件的新路径, 新路径中可以把文件名改掉
    // 把文件从第一个参数移动到第二个参数的那个路径
    fs.rename(req.files[0].path, newName, function (err) {
        if (err) {
            res.send({ code: 201, msg: "上传失败", data: [] });
        } else {
            // 成功就添加脚本到数据库
            let sql = `INSERT INTO autocontorller.autoscript (name, path) VALUES ('${name}', '${mysqlpath}');`
            mysql.selectMysql(sql).then(() => {
                // 写入日志
                let logtime = time.logtime()
                let obj = { time: time.gettime(), content: `导入新的脚本：${name}` }
                log(logtime, obj)

            }).catch((err) => {
                console.log(err);
            })
            res.send({ code: 200, msg: "上传成功" });
        }
    });
});


// 获取日志
router.get("/log", function (req, res) {
    let logtime = time.logtime()
    let readPath = path.join(__dirname, `../log/${logtime}.log`)

    fs.readFile(readPath, { encoding: "utf-8" }, function (err, data) {
        if (err) {
            res.send({ code: 201, msg: "日志读取失败" })
        } else {
            data = data.split("&")

            data.splice(data.length - 1)
            
            res.send({ code: 201, msg: "日志读取成功", data: data })
        }
    })
})


module.exports = router