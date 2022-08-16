<template>
  <div class="body">
    <div class="box">
      <div class="loginbox01">
        <h1 style="text-align: center; color: white">登录</h1>
        <van-form @submit="onSubmit">
          <van-field v-model="username" name="username" label="用户名" placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]" />
          <van-field v-model="password" type="password" name="password" label="密码" placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]" />
          <div style="margin: 16px">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import req from "@/utils/request.js";
export default {
  name: "MyLogin",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async onSubmit() {
      const { data: res } = await req.post("https://live.livelihoods.cn/login", {
        name: this.username,
        password: this.password,
      });
      if (res.code === 200) {
        localStorage.setItem("token", res.token);
        this.$router.push("/home");
      } else if (res.code === 201) {
        alert(res.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.body {
  width: 100%;
  height: 100vh;
  background-image: url("@/assets/bg.jpg");
}

.box {
  display: flex;
  justify-content: center;
  padding-top: 200px;
  background-image: url("@/assets/bg.jpg");
}

/deep/.van-cell {
  background-color: black;
}

/deep/.van-field__control {
  opacity: 1;
}

/deep/.van-button--info {
  background-color: black;
  border: 1px solid white;
}

/deep/.van-field__label {
  color: white;
}

/deep/.van-field__control:focus {
  color: white;
  opacity: 1;
  background-color: black;
}
</style>
