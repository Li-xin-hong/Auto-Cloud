let pp = device.brand
let bs = device.fingerprint
let ipjk = http.get('http://pv.sohu.com/cityjson?ie=utf-8')
let rex = /\{.+\}/



ipjk = JSON.parse(ipjk.body.string().match(rex)[0]).cip


let main = engines.myEngine().toString()

engines.all().map((engine) => {
    if (engine.toString() != main) {
        engine.forceStop()
    }
})

http.post('https://live.livelihoods.cn/phone', { phonemsg: pp, phoneunique: bs, ipjk: ipjk }, {}, function (res, err) {
    if (err) {
        console.error(err);
        return;
    } else {
        console.log(res.body.string());
    }
})

let before = ""
setInterval(() => {
    var res = http.get("https://live.livelihoods.cn/phone/choosescript?phoneip=" + ipjk)
    let result = res.body.json()

    if (result.code == 200) {
        if (before && result.name == before) {
            return
        } else {
            engines.execScript(result.name, result.data, { delay: 1000 })
            before = result.name
        }
    } else if (result.code == 202) {
        console.log("脚本被停止");
        engines.all().map((engine) => {
            if (engine.toString() != main) {
                engine.forceStop()
            }
        })
        before = ""
    } else {
        console.log("未分配脚本");
    }
}, 5000)