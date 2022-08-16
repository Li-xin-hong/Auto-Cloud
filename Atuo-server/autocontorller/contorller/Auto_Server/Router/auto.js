let express = require("express")

// 发请求
let axios = require("axios")

// 引入数据库接口
let mysql = require("../Api/mysql")

// 引入生成时间
let time = require("../Api/time")

let router = express.Router()

const fs = require('fs')

let path = require("path")

let autopath =  path.resolve('../autojs/tolead.js')


// fs.readFile('../autojs/tolead.js', 'utf-8', (err, data) => {
//     if (err) {
//         console.log(err.message);
//     } else {
//         console.log(data);
//     }
// })