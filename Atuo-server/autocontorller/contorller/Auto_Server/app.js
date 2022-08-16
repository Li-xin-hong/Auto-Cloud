let express = require('express');
let bodyParser = require("body-parser")

let app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 解决跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');//可设置多个跨域
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,Token');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true)//允许客户端携带验证信息
    next();
});


// 引入token
let token = require("./Api/token")

// 引入路由
let login = require("./Router/login")
let phone = require("./Router/phone")
let main = require("./Router/main")

app.use(function (req, res, next) {
    if (req.url != "/login" &&  req.url.indexOf("/phone") == -1) {
        // 获取请求头携带的token
        let headerToken = req.headers.token
        // 解析token
        let {code} = token.checkToken(headerToken)
        if(code == 100){
            res.send({code:403, mdg:"登录过期，请重新登录"})
        }else{
            next()
        }
    } else {
        next()
    }
})

// 打开页面时 用来判断token是否过期
app.get("/token",function(req,res){
    let headerToken = req.headers.token
    // 解构出用户名
    let {username} = token.checkToken(headerToken).ct
    // 验证成功时 把用户名响应回去 到时候显示在页面上
    res.send({code:200,msg:"token验证成功" ,username:username})
})

app.use("/login", login)

app.use("/phone",phone)

app.use("/main",main)

app.listen(3000)