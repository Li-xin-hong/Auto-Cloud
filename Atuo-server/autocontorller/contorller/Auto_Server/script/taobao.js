// 在运行脚本之前先打开auto.js app
let appName = "Auto.js"
app.launchApp(appName)
sleep(3000)

function nextVideo(){
    //获得手机分辨率
    var width = device.width;
    var height = device.height;
    //swipe(x1,y1,x2,y2,t) 滑动函数 从x1,y1,到x2,y2用时t ms
    //屏幕的像素是从左上角开始的，向下，向右增加
    swipe(width/2,height/2,width/2,height/3,10);
};
 
function randNum(minnum , maxnum){
    return Math.floor(minnum + Math.random() * (maxnum - minnum));
};
 

function runApp(appName,runTimes){
 
    sleep(1000);
    var launchResult=launchApp(appName);
    if(!launchResult){
        toast('你还没有安装'+appName);
        back();
    }
 
    sleep(3000);
    var sleepTime = 10;
    // 统计运行次数
    var flagTime=0;
    while(true){
        flagTime++;
        // 超过次数终止程序
        if(flagTime>runTimes){
            break;
        }
 
        sleepTime = randNum(5,15);
         console.show();//开启日志
 
        log("已经执行 "+flagTime.toString()+"次");
        sleep(sleepTime*1000);
        nextVideo();
    }
};
 
function run(){    
    runApp("淘宝",20);
};

run();