<template>
  <div class="exception-page">
    <div class="img">
      <img :src="data.src" />
    </div>
    <div class="content">
      <h1>{{ data.title }}</h1>
      <div class="desc">{{ data.desc }}</div>
    </div>
  </div>
</template>
<script>

import { mapGetters } from "vuex";
import { removeToken } from "@/util/auth";

const loading = {
  desc:'正在登录中',
  title:'加载中',
  src: '/img/gif/loading.gif',
}

const error = {
  desc:'服务器发生了错误！',
  title:'服务器错误',
  src: '/img/gif/loading.gif',
}
export default {
  name: 'loading',
  data() {
    return {
      data:{...loading}

    };
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  created() {
    this.getSSOLogin();
  },
  mounted() {
    removeToken()
  },
  methods: {
    getSSOLogin() {
      let ticket = this.$route.query.ticket ? this.$route.query.ticket : undefined;
      let page=this.$route.query.page?this.$route.query.page:undefined
      if (ticket) {
        ticket = ticket.isArray ? ticket[0] : ticket;
        let ssoVo={
          ticket:ticket,
          service:encodeURIComponent(this.delParam('ticket'))
        }
        this.$store.dispatch("LoginBySso",ssoVo).then(() => {
          this.$store.commit("SET_ONLY_PAGE",!!page)
          if(page){
            this.$store.dispatch("GetMenu").then(data => {
              if (data.length !== 0) {
                this.$router.$avueRouter.formatRoutes(data, true);
                this.$router.push({ path: page});
              }
            });
          }else{
            if(this.isMobile()){
              this.$router.push({ path: 'phonePageIndex'  });
            }else{
              this.$router.push({ path: this.tagWel.value  });
            }
          }

        }).catch(()=>{
          this.data = {...error}}
          );
      } else {
        window.location = `http://sso.tul.cn:9080/sso/login?service=${encodeURIComponent(this.delParam('ticket'))}`;
      }
    },
    /**
     * 去除url中指定参数
     * @param paramKey
     * @returns {string}
     */
    delParam(paramKey) {
      let url = window.location.href;    //页面url
      const urlParam = window.location.search.substr(1);   //页面参数
      const beforeUrl = ( url.indexOf('?') > 0 ? url.substr(0, url.indexOf('?')) : url);   //页面主地址（参数之前地址）
      let nextUrl = '';

      const arr = [];
      if (urlParam !== '') {
        const urlParamArr = urlParam.split('&'); //将参数按照&符分成数组
        for (let i = 0; i < urlParamArr.length; i++) {
          const paramArr = urlParamArr[i].split('='); //将参数键，值拆开
          //如果键与要删除的不一致，则加入到参数中
          if (paramArr[0] !== paramKey) {
            arr.push(urlParamArr[i]);
          }
        }
      }
      if (arr.length > 0) {
        nextUrl = '?' + arr.join('&');
      }
      url = beforeUrl + nextUrl;
      return url;
    },
    isMobile(){
      let info = navigator.userAgent;
      let agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod", "iPad"];
      for(let i = 0; i < agents.length; i++){
        if(info.indexOf(agents[i]) >= 0) return true;
      }
    return false;
}
  },
};
</script>
<style >
.exception-page {
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

</style>
