let fs = require("fs")
let path = require('path')

// 写入日志
async function write(time, content) {
    let writePath = path.join(__dirname, `../log/${time}.log`)
    content = JSON.stringify(content)
    // 通过fs模块里的stat判断要写入的文件是否存在, 如果文件不存在就报错, 那么就可以直接
    try {
        let isHave = await new Promise((resolve, reject) => {
            // 查询文件信息， 文件存在就返回结果， 文件不存在那么就抛出错误
            fs.stat(writePath, (err, stat) => {
                if (err) {
                    console.log("查询文件信息失败" + err);
                    // 如果不存在， 会报错err.code ENOENT
                    reject(err)
                } else {
                    // 如果存在， 那么就返回true
                    resolve(true)
                }
            })
        })
        // 如果为true，直接用append往后面增加
        if (isHave) {
            let result = await new Promise(function (resolve, reject) {
                // 往文件后面增加数据
                fs.appendFile(writePath, content + "&", function (error) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve("写入成功")
                    }
                })
            })
            console.log(result);
        }
    } catch (err) {
        // 如果是stat的报错， 报错的内容是ENOENT. 这个时候说明文件不存在, 说明这个时候可以创建文件
        if (err.code == "ENOENT") {
            try {
                let result = await new Promise((resolve, reject) => {
                    fs.writeFile(writePath, content + "&", { encoding: "utf-8" }, function (err) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve("文件创建成功")
                        }
                    })
                })

                console.log(result);
            } catch (err) {
                console.log(err);
            }
        }

        // 如果是其他内容的报错， 那么直接打印
        console.log(err);
    }
}

module.exports = write