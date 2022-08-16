<template>
  <div>
<van-tabs type="card">
  <van-tab title="添加QQ" to='/home/console/consoleadd'> <router-view></router-view></van-tab>
  <van-tab title="修改资料" to='/home/console/consoleupdate'> <router-view></router-view></van-tab>
</van-tabs>
  </div>
</template>

<script>
export default {
  data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
}
</script>

<style>

</style>