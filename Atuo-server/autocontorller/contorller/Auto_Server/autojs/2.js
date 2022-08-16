let pp = device.brand
let xh = device.model
let shuju = pp + xh
console.log(shuju);
http.post('https://live.livelihoods.cn/phone', { msg: shuju }, {}, function(res, err) {
    if (err) {
        console.error(err);
        return;
    } else {
        console.log(res.body.string());
    }
})