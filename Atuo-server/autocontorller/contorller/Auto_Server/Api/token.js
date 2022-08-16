let jwt = require("jsonwebtoken");

let key = "dsfsadfhkjasdhfkjdshfkhiuthetnvnkn"

// 生成token
function createToken(username) {
    return jwt.sign({ username }, key, {expiresIn: 60 * 60 * 24})
}

// 校验token
function checkToken(token) {
    try {
        // 解析
        let ct = jwt.verify(token, key)
        return { code: 204, msg: "校验成功", ct: ct }
    } catch (error) {
        return { code: 100, msg: "校验失败" }
    }
}

module.exports.createToken = createToken
module.exports.checkToken = checkToken