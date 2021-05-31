<template>
    <div class="headerWarp clearfix">
        <div class="headerBox" >
            <div class="h-info">
              <a @click="toOrder" class="logo-img">
                <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-nuskin-img"></use>
                </svg>
              </a>
                <span class='infoSpan'>如新分享管理</span>
            </div>
            <div class="h-right">
                <img :src="user.user.img" alt="">
                <span class='layout' @click='loginOut'>登出</span>
                <!-- <el-dropdown class="options"> -->
                    <span class="options" >
                        {{user.user.name}}
                    </span>
                    <!-- <el-dropdown-menu slot="dropdown">
                    </el-dropdown-menu> -->
                <!-- </el-dropdown> -->
            </div>
        </div>
    </div>
</template>
<script>
// import orderApi from '../api/saleSlip/orderApi'
import {mapState} from 'vuex'

export default {
  name: '',
  data () {
    return {
      userName: '',
      userImg: ''
    }
  },
  computed: {
    ...mapState({
      user: 'user'
    })
  },
  methods: {
    handleCpmmand (command) {
      if (command === 'exit') {
        window.localStorage.clear()
        this.$router.push({ path: '/' })
      }
    },
    loginOut () {
      localStorage.removeItem('token')
      window.sessionStorage.removeItem('loginToUrl')
      this.$router.push({ path: '/' })
    },
    toOrder () {
      this.$router.push({ path: '/order' })
    }
  }
}
</script>
<style lang="less">
@import "../assets/styles/main.less";
.headerWarp {
  width: 100%;
  height: 66px;
  background: #ffffff;
  color: #000;
  .headerBox {
    width: 1170px;
    margin: 0 auto;
  }
  .layout {
    float: right;
    margin: 10px 10px 0 0px;
    cursor: pointer;
  }
  .layout:hover{
    color: #008ab0
  }
  .h-info {
    width: 50%;
    height: 80px;
    float: left;
    .logo-img {
      display: block;
      float: left;
      margin-top: 13px;
      margin-right: 20px;
      cursor: pointer;
    }
    svg{
      width: 147px;
      height: 41px;
    }
    .infoSpan {
      float: left;
      margin: 28px 20px 0px 0px;
    }
  }
  .h-right {
    float: right;
    height: 34px;
    margin: 16px 0 0 0;
    font-size: 12px;
    img {
      width: 34px;
      height: 34px;
      float: left;
      border-radius: 50%;
    }
    .el-dropdown-link {
      font-weight: 400;
    }
    .options {
      float: left;
      text-align: center;
      margin: 10px 30px 0 10px;
    }
  }
}
</style>
