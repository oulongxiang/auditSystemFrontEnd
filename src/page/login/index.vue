<!--
 * @Author: your name
 * @Date: 2021-08-17 11:38:19
 * @LastEditTime: 2021-09-30 11:21:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \auditSystemFrontEnd\src\page\login\index.vue
-->
<template>

    <div
        class="container"
        @keyup.enter.native="handleLogin">
        <top-color v-show="false"/>
        <div class="left">
            <img class="divp" src="/img/bg/loginbg.jpg" alt="">
        </div>
        <div class="right">
            <div />

            <div class="loginmodel">
                <img class="logoclass" src="/img/bg/tullogo2.jpg" alt="">
                <h4 class="login-title">
                    集团{{ website.title }}
                </h4>
                <div class="bottonclass"><p class="bottontitle">客观 · 公正 · 保密 · 胜任</p></div>
                <div class="loginclass">
                    <userLogin/>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import userLogin from "./userlogin";
import { mapGetters } from "vuex";
import { dateFormat } from "@/util/date";
import topColor from "@/page/index/top/top-color";

export default {
  components: {
    userLogin,
    topColor
  },
  data() {
    return {
      time: ""
    };
  },
  created() {
    document.title = "审计系统-登录";
    this.getTime();
    setInterval(() => {
      this.getTime();
    }, 1000);
  },
  mounted() { },
  computed: {
    ...mapGetters(["website"])
  },
  props: [],
  methods: {
    getTime() {
      this.time = dateFormat(new Date());
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/login.scss";

.loginclass{
  width:80%;
  margin-left: 10%;
}

.logoclass{
  margin-left: 32%;
}

.bottonclass{
  margin-top: 0px;
}

.login-title {
    color: #333;
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 22px;
    text-align: center;
    letter-spacing: 4px;
}

.bottontitle{
  margin-top:0%;
  color: #333;
  font-weight: 500;
  margin-left:33%;
  border:none;
  font-size: 15px;
}

.container{
display:flex;/*设为伸缩容器*/
height: 100%;
}

.left{
  width:75%;
  height: 100%;
  border: none;
  background:#fff;
}

.right{
width:25%;
height: 100%;
border: none;
flex:1;/*这里设置为占比1，填充满剩余空间*/
background:#fff;
}

.loginmodel{
  margin-top: 50%;
}

.login-left {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    background-color: #409EFF; //#409EFF 蓝色 #fff白色
    color: #fff;
    float: left;
    width: 50%;
    position: relative;
}

.login-left .second{
  font-size: 15px;
}

.login-left .title {
    margin-top: 60px;
    text-align: center;
    color: #fff;
    font-weight: 300;
    letter-spacing: 2px;
    font-size: 25px;
}

.divp{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width:75%;
  height:100%;
}

</style>

