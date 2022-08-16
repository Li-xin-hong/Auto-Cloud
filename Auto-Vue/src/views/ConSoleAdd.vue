<template>
  <div class="add">
    <div class="top">
      <fieldset class="top-left">
        <legend>参数设置</legend>
        <form action="javascript:;">
          <div>
            <i>播放间隔</i> <input type="number" /> <i>播放总数</i>
            <input type="number" />
          </div>
          <div>
            <i>双击点赞</i> <input type="number" /> <i>间隔</i>
            <input type="number" /> <i>秒</i>
          </div>
          <div>
            <i>指定分组</i>
            <select style="width: 20%; margin-left: 4px">
              <option value="我的好友">我的好友</option>
              <option value="我的家人">我的家人</option>
              <option value="我的死党">我的死党</option>
              <option value="我的仇人">我的仇人</option>
            </select>
            <i>连续添加</i> <input type="number" /> <i>换IP</i>
          </div>
          <div>
            <i>平凡等待</i> <input type="number" /> - <input type="number" /> 秒
          </div>
          <div>
            <i>一次导入通讯录</i> <input type="number" /> <i>条</i>
            <input type="checkbox" id="ztjzx" checked /><label for="ztjzx"><i>只添加在线</i></label>
          </div>
          <div style="display: flex">
            <div class="tjfsleft" style="flex: 6">
              <fieldset>
                <legend>添加方式</legend>
                <input type="radio" id="top1" name="tjfs" checked /><label for="top1"><i>QQ添加</i></label>
                <input type="radio" id="top2" name="tjfs" /><label for="top2"><i>通讯录</i></label>
                <input type="radio" id="top3" name="tjfs" /><label for="top3"><i>空间</i></label>
              </fieldset>
            </div>
            <div class="tjfsfight" style="flex: 3">
              <button style="height: 8vh; width: 7vw">保存设置</button>
            </div>
          </div>
        </form>
      </fieldset>
      <fieldset class="top-right">
        <legend>选择手机</legend>
        <div class="TopRighBox01">
          <div class="block">
            <div style="border-bottom: 1px solid gainsboro" class="demonstration">
              <span style="width: 10%">ID</span>
              <span>手机型号</span>
              <span>IP</span>
              <span>真实地址</span>
              <span>脚本运行状态</span>
              <span>选择脚本</span>
              <span style="width: 14.4%">连接时间</span>
              <span>当前任务状态</span>
            </div>
            <div v-for="item in list" :key="item.id" style="border-bottom: 1px solid gainsboro">
              <span style="width: 10%">{{ item.id }}</span>
              <span>{{ item.phonename }}</span>
              <span>{{ item.phoneip }}</span>
              <span>{{ item.phoneaddress }}</span>
              <span v-if="item.isrun === 0">
                <input type="checkbox" ref="operation" :id="item.id" onclick="return false" /></span>
              <span v-else-if="item.isrun === 1">
                <input type="checkbox" ref="operation" :id="item.id" checked onclick="return false" /></span>
              <span>
                <select>
                  <option :value="item.scriptid" v-for="item in ToLeadlist" :key="item.scriptid" :name="item.name">
                    {{ item.name }}
                  </option>
                </select>
              </span>
              <span style="width: 14.4%">{{ item.time }}</span>
              <span>{{ item.phonestatus }}</span>
            </div>
          </div>
        </div>

        <div class="TopRightBox02">
          <div>
            <el-row>
              <el-button type="success" round size="small" @click="ClickOperation()">全部运行</el-button>
              <el-button type="danger" round size="small" @click="ClickStop()">全部停止</el-button>
              <el-button round size="small" @click="ClickAsinglerun()">单个运行</el-button>
              <el-button type="primary" round size="small" @click="ClickAsinglestop()">单个停止</el-button>
              <el-button type="info" round size="small" disabled>唤醒设备</el-button>
              <el-button type="warning" round size="small" @click="PutForward()">踢出设备</el-button>
            </el-row>
          </div>
        </div>
      </fieldset>
    </div>
    <div class="bottom">
      <fieldset class="bottom-left">
        <legend>导入</legend>

        <div class="BottomLeftBox01">
          <div>
            <div>
              <span style="ju">脚本ID</span>
              <span>脚本名称</span>
            </div>
            <div v-for="item in ToLeadlist" :key="item.scriptid">
              <span>{{ item.scriptid }}</span>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="BottomLeftBox02">
          <button @click="ToLead()">导入</button>
          <button @click="Delete()">删除</button>
        </div>
      </fieldset>
      <fieldset class="bottom-right">
        <legend>运行日志</legend>
        <div class="BottomRightBox01">
          <div style="margin-top: 2px; margin-left: 5px;  overflow-y: scroll; height:200px">
            <ul v-for="(item, index) in LogData" :key="index">
              <li>{{ item.time }}</li>
              <li>{{ item.content }}</li>
            </ul>
          </div>
        </div>
        <van-button type="primary" block color="red">重置全部服务器链接</van-button>
      </fieldset>
    </div>
  </div>
</template>

<script>
import req from "@/utils/request.js";
export default {
  async created() {
    const { data: res } = await req.get("https://live.livelihoods.cn/main");
    this.list = res.data;
  },
  data() {
    return {
      list: [], //选择手机页面数据
      ToLeadlist: [], //脚本数据
      LogData: []//日志数据
    };
  },
  methods: {
    async ClickOperation() {
      //运行所有脚本
      if (this.ToLeadlist.length !== 0) {
        let obj = { isrun: 1, array: [] };
        this.$refs.operation.forEach(async (e, index) => {
          let objs = { ip: '', scriptid: '' }//创建一个obj对象,保存每个循环项的ip和id
          //a:当前元素
          e.checked = true;
          this.list[index].isrun = 1;
          this.list[index].scriptid = parseInt(
            //获取option的value(value存储的值与脚本的ID同步)值存储给scriptid(脚本ID)
            e.parentElement.nextElementSibling.firstElementChild.value
          );
          objs.ip = this.list[index].phoneip
          objs.scriptid = this.list[index].scriptid
          obj.array[obj.array.length] = objs

        });
        await req.post(
          `http://192.168.134.65:3000/main/evenrun`, { msg: obj }
        );
        this.AccesstotheLog();
      } else {
        alert("请先导入脚本数据再运行脚本!!!");
      }
    },
    async ClickStop() {
      //停止所有脚本

      if (this.ToLeadlist.length !== 0) {
        let obj = { isrun: 1, array: [] };
        this.$refs.operation.forEach((e, index) => {
          let objs = { ip: '', scriptid: '' }
          e.checked = false;
          this.list[index].isrun = 0;
          objs.ip = this.list[index].phoneip
          objs.scriptid = this.list[index].scriptid
          obj.array[obj.array.length] = objs

        });
        const { data: res } = await req.post(
          `http://192.168.134.65:3000/main/evenrun`, { msg: obj }
        );
        console.log(res);
        this.AccesstotheLog();
      } else {
        alert("请先导入脚本数据再运行脚本!!!");
      }
    },
    ClickAsinglerun() {
      //运行单个脚本
      if (this.ToLeadlist.length !== 0) {
        const ids = parseInt(prompt("请选择要单个运行的ID"));
        this.$refs.operation.forEach(async (e, index) => {
          //循环所有input框,修改input的checked值以及获取所需要的元素及其属性值
          if (parseInt(e.id) === ids) {
            //判断是否导入脚本,导入脚本后才可以进行脚本运行操作
            e.checked = true; //将所有的input状态都改为checked
            this.list[index].isrun = 1; //修改list里面的isrun数据
            this.list[index].scriptid = parseInt(
              //获取option的value(value存储的值与脚本的ID同步)值存储给scriptid(脚本ID)
              e.parentElement.nextElementSibling.firstElementChild.value
            );
            let name; //用于记录选择了哪个脚本
            //自己给scriptid赋值(不建议使用,应获取对应的item.name值
            if (this.list[index].scriptid === 1) {
              name = "抖音";
            } else if (this.list[index].scriptid === 2) {
              name = "快手";
            }
            //分配脚本给后端
            const { data: res } = await req.get(
              `http://192.168.134.65:3000/phone/distribution?ip=${this.list[index].phoneip}&scriptid=${this.list[index].scriptid}&name=${name}`
            );
            //分配完脚本并运行脚本给手机端,修改数据库的数据
            const { data: ress } = await req.get(
              `http://192.168.134.65:3000/main/oddrun?isrun=${this.list[index].isrun}&ip=${this.list[index].phoneip}`
            );
            this.AccesstotheLog();
          }
        });
      } else {
        alert("请先导入脚本数据再运行脚本!!!");
      }
    },
    ClickAsinglestop() {
      //停止单个脚本
      if (this.ToLeadlist.length !== 0) {
        const ids = parseInt(prompt("请选择要单个停止的ID"));
        this.$refs.operation.forEach(async (e, index) => {
          if (parseInt(e.id) === ids) {
            e.checked = false;
            this.list[index].isrun = 0;
            this.list[index].scriptid = null; //获取option的value值存储给scriptid
            const { data: res } = await req.get(
              `http://192.168.134.65:3000/main/oddrun?isrun=${this.list[index].isrun}&ip=${this.list[index].phoneip}`
            );
            console.log(res);
            this.AccesstotheLog();
          }
        });
      } else {
        alert("请先导入脚本数据再运行脚本!!!");
      }

    },
    PutForward() {
      const ids = parseInt(prompt("请选择要提出的设备ID"));
      this.$refs.operation.forEach(async (e, index) => {
        if (parseInt(e.id) === ids) {
          e.checked = false;
          const { data: res } = await req.get(
            `http://192.168.134.65:3000/main/deletephone?ip=${this.list[index].phoneip}`
          );
          console.log(res);
          const { data: ress } = await req.get(
            "http://192.168.134.65:3000/main"
          ); //踢出设备后,重新刷新页面
          this.list = ress.data;
          console.log(this.list);
        }
      });
    },
    // request(e){
    //    //运行单个脚本
    //   if (this.ToLeadlist.length !== 0) {
    //   if (e=='a') {

    //   }else if (e=="b") {

    //   }else if (e=="c") {

    //   }else if (e=="d") {

    //   }
    //   } else {
    //     alert("请先导入脚本数据再运行脚本!!!");
    //   }
    // },
    async ToLead() {
      const { data: res } = await req.get(
        "http://192.168.134.65:3000/main/script"
      );
      this.ToLeadlist = res.data;
    },
    Delete() {
      const ids = parseInt(prompt("请选择要删除的ID"));
      this.ToLeadlist = this.ToLeadlist.filter((e) => {
        if (parseInt(e.scriptid) !== ids) {
          return e;
        }
      });
    },
    async AccesstotheLog() {
      const { data: res } = await req.get('http://192.168.134.65:3000/main/log')
      for (let i = 0; i < res.data.length; i++) {
        this.LogData.push(JSON.parse(res.data[i]))
      }

    }
  },
};
</script>

<style lang="less" scoped>
.add {
  font-size: 12px;
  width: 100%;
  border: 1px solid black;
}

.top {
  width: 100%;
  display: inline-flex;
}

.top-left {
  flex: 3;

  div {
    margin: 5px 2px;
  }

  input[type="number"] {
    width: 20%;
    margin: 2px;
  }

  input[type="checkbox"] {
    position: relative;
    top: 2px;
  }
}

.top-right {
  flex: 6;
}

.bottom {
  width: 100%;
  display: inline-flex;
}

.bottom-left {
  flex: 3;
}

.bottom-right {
  flex: 6;
}

.tjfsleft {
  i {
    position: relative;
    bottom: 3px;
  }
}

.TopRighBox01 {
  position: relative;
  width: 99%;
  height: 80%;
  margin: auto;
  border: 3px solid gainsboro;

  span {
    display: inline-block;
    text-align: center;
    width: 12.2%;
    border-right: 2px solid gainsboro;
  }

  div>span:last-child {
    border: none;
  }

  /deep/.el-pagination {
    position: absolute;
    bottom: 0px;
    left: 15vw;
  }
}

.TopRightBox02 {
  margin-top: 5px;

  /deep/.el-row {
    display: flex;
    justify-content: space-between;
  }
}

.BottomLeftBox01 {
  display: inline-flex;
  width: 65%;
  height: 40vh;
  border: 3px solid gainsboro;
  align-items: flex-start;

  div {
    width: 100%;
    text-align: center;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      width: 49%;
      border-right: 2px solid gainsboro;
    }

    span:last-child {
      border: none;
    }
  }
}

.BottomLeftBox02 {
  float: right;
  margin-left: 5px;
  width: 30%;
  height: 40vh;
  align-items: center;

  button:first-child {
    margin-top: 1vh;
  }

  button {
    width: 100%;
    height: 9vh;
    margin-bottom: 1vh;
  }
}

.BottomRightBox01 {
  width: 99%;
  height: 80%;
  margin: auto;
  border: 3px solid gainsboro;
  overflow: hidden;

}

/deep/.van-button--block {
  margin-top: 5px;
}
</style>