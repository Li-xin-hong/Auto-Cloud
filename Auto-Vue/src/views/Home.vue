<template>
  <el-container>
  <el-aside width="auto">
      <com-aside></com-aside>
  </el-aside>
  <el-container>
    <el-header style="font-size:24px">后台管理系统</el-header>
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
//引入需要用到的组件
import ComAside from '../components/ComAside.vue'
export default {
  components: { ComAside },
componends:{
    ComAside
}
}
</script>

<style lang='less' scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: rgb(179,192,209);
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>