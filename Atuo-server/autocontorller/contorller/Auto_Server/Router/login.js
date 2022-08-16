// 登录
let express = require('express')
let axios = require("axios")
let md5 = require("md5")

let router = express.Router();

// 引入封装的数据库
let mysql = require("../Api/mysql")
// 引入生成的时间
let time = require("../Api/time")
// 引入token
let token = require("../Api/token");

// 登录
router.post("/", function (req, res) {
    // 通过用户名查询用户表
    console.log(req.body);
    // 请求的用户名和密码
    let username = req.body.name
    let password = req.body.password
    // 获取用户的ip
    let ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)

    // 签名算法
    let sign = md5(`ip=${ip}&token=e4e5b095308234375813781ce7f33f1f`)

    mysql.countIP(ip).then((val) => {
        
        // 判断用户登录错误的次数是否大于10
        if (val.isCT) {
            // 判断时间是否大于10分钟 如果大于 就将登录错误的次数清零
            let isTen = time.counttime(val.result[0].time,10)
            if (isTen) {
                mysql.selectMysql(`UPDATE autocontorller.loginerror SET count = '0' WHERE id = '${val.result[0].id}';`)
            } else {
                // 到这不用再往下走
                res.send({ code: 202, msg: "账号或密码错误次数过多，请一分钟后再试" })
                return
            }
        }
        let sql = `select * from user where name='${username}'`;
        mysql.selectMysql(sql).then((val) => {
            console.log(val[0]);
            if (val.length == 0) {
                res.send({ code: 201, msg: "账号或密码不正确" })
                // 登录失败时调用mysql.js里面的登录错误ip 修改登录错误次数和时间
                mysql.selectIP(ip, time.gettime())
            } else if (username == val[0].name && password == val[0].password) {
                // 用户名和密码匹配正确登录成功 通过ip138网站 获取ip地址
                axios.get(`https://api.ip138.com/ip/?ip=${ip}&callback=find&oid=60703&mid=119481&sign=${sign}`).then((result) => {
                    var regex1 = /\{.+}/; 
                    let { ret, ip, data } = JSON.parse(result.data.match(regex1)[0])
                    if (ret == "err") {
                        // 说明ip查询失败
                        let sql = `UPDATE autocontorller.user SET IP = '未知', address = '未知' WHERE (id = '${val[0].id}');`
                        mysql.selectMysql(sql)
                    }else{
                        let address = data[0] + "-" + data[1] + "-" + data[2]
                        let sql = `UPDATE autocontorller.user SET IP = '${ip}', address = '${address}' WHERE (id = '${val[0].id}');`
                        mysql.selectMysql(sql)
                    }
                })
                // 生成token
                let mytoken = token.createToken(username)
                // 把token响应回去
                res.send({ code: 200, msg: "登录成功", token: mytoken })
            } else {
                res.send({ code: 201, msg: "账号或密码不正确" })
                mysql.selectIP(ip, time.gettime())
            }
        }).catch((error)=>{
            console.log(error);
        })

    }).catch((error)=>{
        console.log(error);
    })

})


module.exports = router
