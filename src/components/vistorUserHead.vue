<template>
  <div class="sight-dec">
      <div class="sight-pic"><img :src="sightInfo.picUrl"></div>
      <div class="sight-info">
        <div class="sight-user-name">
          <span>{{sightInfo.name}}</span> &nbsp;&nbsp;與您的產品分享</div>
        <div>
          <!--<span>内含{{sightInfo.count}}件產品</span>-->
          <span class="available-date">有效期限 {{sightInfo.date | time-formater-no-hour}}</span>
        </div>
      </div>
      <div class="sight-user-desc">{{sightInfo.selfIntroduction}}</div>
    </div>
</template>
<script>
export default {
  props: ['sightInfo']
}
</script>

<style lang="less" scoped>
.sight-dec {
  box-sizing: border-box;
  height: 100px;
  font-size: 14px;
  padding: 23px 0 22px 30px;
  margin-bottom: 20px;
  background-image: linear-gradient(
    45deg,
    #008ab0 16%,
    #0089af 21%,
    #0089af 21%,
    #007298 100%
  );
  background:#008ab0\0;
  color: #fff;
  overflow: hidden;
  .sight-pic {
    float: left;
    height: 55px;
    width: 55px;
    img {
      width: 55px;
      height: 55px;
      border-radius: 50%;
    }
  }
  .sight-info {
    float: left;
    margin-left: 20px;
    div {
      font-size: 13px;
      margin-top: 7px;
      &.sight-user-name {
        font-size: 16px;
        span {
          color: #b9e1ea;
        }
      }
    }
  }
  .sight-user-desc {
    float: right;
    width: 540px;
    margin-right: 30px;
    margin-top: 7px;
    word-break: break-all;
  }
}
</style>
