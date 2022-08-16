let express = require("express")
let md5 = require("md5")
let axios = require("axios")
let fs = require("fs")
let path = require("path")

let router = express.Router()

// 引入数据库api
let mysql = require("../Api/mysql")
// 引入时间api
let time = require("../Api/time")
let log = require("../Api/log")

// 获取用户信息并添加到数据库
function add(ip, msg, unique, timem) {
    console.log(msg);
    // 签名算法
    let sign = md5(`ip=${ip}&token=e4e5b095308234375813781ce7f33f1f`)
    axios.get(`https://api.ip138.com/ip/?ip=${ip}&callback=find&oid=60703&mid=119481&sign=${sign}`).then((result) => {
        // 获取ip地址
        var regex1 = /\{.+}/;
        // 解构赋值
        let { ret, ip, data } = JSON.parse(result.data.match(regex1)[0])
        if (ret == "err") {
            // 说明ip查询失败
            console.log(ret);
        } else {
            // 拼接ip地址
            let address = data[0] + "-" + data[1] + "-" + data[2]
            // 根据手机唯一标识查询数据
            console.log(unique);
            let sql = `SELECT * FROM autocontorller.autophone where phoneunique='${unique}';`
            mysql.selectMysql(sql).then((val) => {
                if (val.length == 0) {
                    // 如果查询不到这个标识 就添加数据
                    let sql = `INSERT INTO autocontorller.autophone (phonename, phoneip, phoneaddress, phonescript, phonestatus, time,phoneunique,isrun) VALUES ('${msg}', '${ip}', '${address}', '无', '在线', '${timem}','${unique}','0');`
                    mysql.selectMysql(sql).then(()=>{
                        console.log("添加了设备");

                        let logtime = time.logtime()
                        let obj = { time:time.gettime(),content:`设备${val[0].phoneip}连接`}
                        log(logtime,obj)
                    }).catch((err)=>{
                        console.log(err);
                    })
                } else {
                    let phonescript = ""
                    console.log(val[0].phonescript);
                    if(val[0].phonescript !="无"){
                        phonescript = val[0].phonescript
                    }else{
                        phonescript = "无"
                    }
                    // 如果找到这个标识 就更新时间
                    let sql = `UPDATE autocontorller.autophone SET phonename = '${msg}', phoneip = '${ip}', phoneaddress = '${address}', phonescript = '无', phonestatus = '在线', time = '${timem}',phoneunique='${unique}' WHERE (id = '${val[0].id}');`
                    mysql.selectMysql(sql).then(()=>{

                        let logtime = time.logtime()
                        let obj = { time:time.gettime(),content:`设备${val[0].phoneip}重新连接`} 
                        log(logtime,obj)
                    }).catch((err)=>{
                        console.log(err);
                    })
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    })
}



// 获取auto.js 请求的手机参数
router.post("/", function (req, res) {
    // 请求带的参数
    let body = req.body
    // req.ip自带的  .match把ip过滤出来6
    let ip = body.ipjk

    // 每接收到一次请求 开始查询手机表里的所有数据 
    let sql = `SELECT * FROM autocontorller.autophone`
    mysql.selectMysql(sql).then((val) => {
        // 遍历所有数据 
        val.forEach(phone => {
            // 判断上一次的连接时间 距离现在是否超过一分钟 超过就改为离线
            if (time.counttime(phone.time, 1) && phone.phonestatus != '离线') {
                let sql = `UPDATE autocontorller.autophone SET phonestatus = '离线',isrun=0 WHERE (id = '${phone.id}');`
                mysql.selectMysql(sql).then(() => {
                    // 写入日志
                    let logtime = time.logtime()
                    let obj = { time: time.gettime(), content: `设备${val[0].phoneip}离线` }
                    log(logtime,obj)
                }).catch((err) => {
                    console.log(err);
                })
            }
        });
    }).catch((err) => {
        console.log(err);
    })

    let timer = time.gettime()
    // 调用方法，如果唯一标识存在 就修改 不存在就添加
    add(ip, body.phonemsg, body.phoneunique, timer)

    res.send({ code: 200, msg: "请求成功" })
})

// 后台管理系统传过来的脚本id
let scriptid = ""

// 这个是后台管理系统， 传过来的分配的手机ip
let ip = ""

// 处理后台管理系统的分配请求
router.get("/distribution", function (req, res) {
    console.log('-------start----------');
    scriptid = req.query.scriptid
    ip = req.query.ip
    let scriptname = req.query.name
    console.log("收到请求修改脚本分配ip", scriptid, ip);

    // 修改手机信息表的脚本名称和脚本id
    let sql = `UPDATE autocontorller.autophone SET phonescript = '${req.query.name}' , scriptid = '${scriptid}' WHERE (phoneip = '${ip}');`
    mysql.selectMysql(sql).then(() => {
        // 写入日志
        let logtime = time.logtime()
        let obj = { time: time.gettime(), content: `给设备${ip}分配脚本${scriptname}` }
        log(logtime, obj)
    }).catch((err) => {
        console.log(err);
    })
    // 一定要记得响应， 每一个请求都要响应
    res.send({ code: 200, msg: "分配成功" })

})


// 手机定时请求指定的脚本
router.get("/choosescript", function (req, res) {
    // autojs请求的ip
    let reqip = req.query.phoneip
    console.log(reqip);
    // 利用请求ip 更新手机的链接时间
    let newtime = time.gettime()
    mysql.selectMysql(`UPDATE autocontorller.autophone SET time = '${newtime}' WHERE (phoneip = '${reqip}');`)

    // 查询手机所有数据 用请求的ip对应 如果相同 通过表里的scriptid去分配对应的脚本
    let sql = `SELECT * FROM autocontorller.autophone`;
    mysql.selectMysql(sql).then((val) => {
        // 遍历所有数据
        val.forEach((phone) => {
            // 通过请求ip找到数据
            if (reqip == phone.phoneip) {
                // 查看脚本id是否存在
                if (phone.scriptid == null || phone.scriptid == "") {
                    res.send({ code: 201, msg: "未分配脚本" })
                } else {
                    // 如果脚本存在 判断是否执行运行
                    if (phone.isrun) {
                        // 通过脚本id 找到脚本数据
                        let sql = `SELECT * FROM autocontorller.autoscript where scriptid='${phone.scriptid}'`
                        mysql.selectMysql(sql).then((val) => {
                            // 通过查询到的脚本路径 读取脚本信息 并响应
                            let result = fs.readFileSync(path.join(__dirname, val[0].path))
                            res.send({ code: 200, msg: "发送脚本成功", data: result.toString(), name: val[0].name })
                        }).catch((err) => {
                            console.log(err);
                        })
                    } else {
                        res.send({ code: 202, msg: "该脚本已被停止" })
                    }

                }
            }
        })
    }).catch((err) => {
        console.log(err);
    })
})

// 接受手机传过来带的日志内容
router.post("/log", function (req, res) {
    // 手机请求的ip
    let reqip = req.body.ip
    let logtime = time.logtime()
    let content = "设备" + " "  + reqip + req.body.content

    let obj = { time: time.gettime(), content: content }
    
    log(logtime, obj)

    res.send({ code: 200, msg: "日志写入成功" })
})

module.exports = router