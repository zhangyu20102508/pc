<template>
  <div class="contentTitle-wrapper">
    <div class="title">
      {{title}}
    </div>
    <div class="return"  @click="handleClick" v-if="isReturn">
      <i class="el-arrow-left"></i>
      <span>返回</span>
    </div>
    <div class="order-success" v-show="showMore">
      <span class="order-text">成功下單:
      <span> {{orderSuccess}}筆 </span>  </span>
      <el-button class="add-again" type="primary" size="small" @click="publishClick">再次分享</el-button>
    </div>
    <div class="order-success" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String, // 标题
    isReturn: {
      type: Boolean,
      default: true
    },
    rightBtnText: {
      type: [String, Number, Boolean]
    },
    showMore: {
      type: Boolean,
      default: false
    },
    orderSuccess: [String, Number],
    selfClick: { // 自定义点击事件返回
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick () {
      if (this.selfClick) {
        this.$emit('click')
      } else {
        this.$router.go(-1)
      }
    },
    publishClick () {
      this.$router.push({
        path: '/againAdd',
        query: {
          salesSlipId: this.$route.query.salesSlipId
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .contentTitle-wrapper {
    position: relative;
    padding: 19px 40px 19px 29px;
    border-bottom: 1px solid #eee;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      border-left: 4px solid #0089af;
      height: 16px;
      left: 15px;
      top: 27px;
    }
    div {
      line-height: 1;
    }
    .title {
      display: inline-block;
      padding-right: 40px;
      height: 32px;
      line-height: 34px;
    }
    .return {
      display: inline-block;
      font-size: 14px;
      color: #727272;
      cursor: pointer;
    }
    .el-arrow-left {
      width: 10px;
      height: 10px;
      color: #979797;
      line-height: 20px;
      display: inline-block;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      border: 2px solid #979797;
      border-right: 0px;
      border-top: 0px;
      margin-left: 10px;
    }
    .order-success{
      // display: inline-block;
      float: right;
      height: 32px;
      line-height: 32px;
    }
    .add-again{
      margin-left: 30px;
    }
    .order-text{
      display: inline-block;
      height: 32px;
      line-height: 37px;
      vertical-align: bottom;
    }
  }
</style>
