<template>
  <div class="error-page">
    <div v-if="!isMobile()" class="img"
         style=" background-image: url('/img/bg/404.svg');"></div>
    <div class="content">
      <h1>404</h1>
      <div class="desc">抱歉，你访问的页面不存在</div>
      <div class="actions">
        <router-link v-if="!isMobile()" :to="{path:'/'}">
          <el-button type="primary">返回首页</el-button>
        </router-link>
        <router-link v-else :to="{path:'/phonePageIndex'}">
          <el-button type="primary">返回首页</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "error-404",
  methods:{
    isMobile(){
      let info = navigator.userAgent;
      let agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod", "iPad"];
      for(let i = 0; i < agents.length; i++){
        if(info.indexOf(agents[i]) >= 0) return true;
      }
      return false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
