let mysql = require("mysql");

// 连接数据库
let connect = mysql.createConnection({
    host: "114.116.100.119",
    user: "autocontorller",
    password: "mSB8PekheYTLAcyL",
    port: "3306",
    database: "autocontorller"
})

// 连接数据库、
connect.connect()

// 获取数据库信息
function selectMysql(sql) {
    return new Promise(function (resolve, reject) {
        // 执行语句 获取信息
        connect.query(sql, function (err, result) {
            try {
                if (err) {
                    reject(err);
                    throw err
                } else {
                    resolve(result)
                }
            } catch (error) {
                console.log(error);
            }
        })
    })
}

// 登录错误的ip
function selectIP(IP, time) {
    // 根据ip查询
    let sql = `SELECT * FROM autocontorller.loginerror where ip='${IP}'`
    selectMysql(sql).then((val) => {
        // 返回的val数组长度如果不为0 说明ip存在 将登录错误次数加1
        if (val.length != 0) {
            let count = +val[0].count + 1
            let sql = `UPDATE autocontorller.loginerror SET count = '${count}',time='${time}' WHERE id = '${val[0].id}';`
            selectMysql(sql)
        } else {
            // 返回数组长度为0 说明ip不存在 登录错误次数为1
            selectMysql(`INSERT INTO autocontorller.loginerror (ip, count, time) VALUES ('${IP}', '1', '${time}');`)
        }
    }).catch((error)=>{
        console.log(error);
    })
}

// 登录错误次数
function countIP(ip) {
    let sql = `SELECT * FROM autocontorller.loginerror where ip='${ip}'`
    return selectMysql(sql).then((val) => {
        if (val.length == 0) {
            return { isCT: false, result: val }
        } else if (val[0].count >= 10) {
            // 如果查询到的数据登录错误 
            return { isCT: true, result: val }
        }
        return { isCT: false, result: val }
    }).catch((error)=>{
        console.log(error);
    })
}


module.exports.selectMysql = selectMysql
module.exports.selectIP = selectIP
module.exports.countIP = countIP