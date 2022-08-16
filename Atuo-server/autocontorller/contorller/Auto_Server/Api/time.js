// 获取时间, 精确到秒
function gettime() {
    let time = new Date()

    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()
    let hour = time.getHours()
    let minute = time.getMinutes()
    let seconds = time.getSeconds()

    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds
}

// 精确到日
function logtime() {
    let time = new Date()

    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()

    return year + "-" + month + "-" + day
}

// 判断是否超过十分钟
function counttime(time, num) {
    let oldtime = +new Date(time)
    let newtime = +new Date()

    let timer = newtime - oldtime
    timer = timer / 1000 / 60
    if (timer >= num) {
        return true
    } else {
        return false
    }
}


module.exports.gettime = gettime
module.exports.counttime = counttime
module.exports.logtime = logtime