const content = String('抖音');
app.launchApp(content)
var cnt = 0; //滑动次数
var x1 = 360 + Math.random(0, 1) * 10;
var y1 = 1000 + Math.random(0, 1) * 10;
var x2 = 380 + Math.random(0, 1) * 10;
var y2 = Math.random(0, 1) * 10;
var duration = Math.floor(Math.random() * (600 - 300 + 1) + 300);
const time = setInterval(function() {
    let dz = Math.floor(Math.random() * 2);
    cnt++;
    "auto"; //设置无障碍
    swipe(x1, y1, x2, y2, duration); //上滑操作
    sleep(1000); //等待1秒
    toast("第" + cnt + "次切换");
    if (dz) //随机点赞
    {
        setScreenMetrics(1080, 2400); //屏幕分辨率 
        click(1000, 1350); //点赞
        toast("点赞成功");
    }
    sleep(1000);
    if (cnt % 5 == 0) {
        setScreenMetrics(1080, 2400);
        click(1010, 1550); //点击评论
        toast("进去评论");
        sleep(1000);
        setScreenMetrics(1080, 2400);
        click(400, 2290); //打开评论区
        sleep(1000);
        click(1018, 1253); //打开表情包
        sleep(500);
        click(375, 1575); //打开第三个表情
        sleep(1500);
        click(1011, 1281); //发送评论
        sleep(1000);
        click(1022, 807) //关闭评论
        sleep(1000)
        toast("评论结束");
    }
    if (cnt === 10) {
        clearInterval(time)
    }
}, 9000);