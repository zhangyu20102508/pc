<template>
    <div class="headerWarp">
        <div class="headerBox" >
            <div class="h-info">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-nuskin-img"></use>
              </svg>
            </div>
            <!-- <div class="h-right">
                <span>如新商城免費</span>
                <span><el-button type="text" calss='toLogin'>登錄</el-button></span>
                <span><el-button type="text">註冊</el-button></span>
            </div> -->
        </div>
    </div>
</template>
<script>

export default {
  name: '',
  data () {
    return {
      username: '',
      userImg: ''
    }
  },
  methods: {},
  mounted () {}
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
    .clearfix;
    width: 1127px;
    margin: 0 auto;
  }
  .h-info {
    width: 50%;
    height: 80px;
    float: left;
    .toLogin{
      margin-right: 15px;
    }
    svg {
      display: block;
      width: 147px;
      height: 41px;
      float: left;
      margin-top: 13px;
      margin-right: 20px;
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
  }
}
</style>
