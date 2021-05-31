<template>
   <div>
     <vistor-user-head v-if="!sightInfo" :sightInfo="sightInfoData"></vistor-user-head>
     <vistor-user-head v-else :sightInfo="sightInfo"></vistor-user-head>
       <div class="order-head">
           <h3>支付成功</h3>
       </div>
       <div class="order-hedtop">
          <div class="img"><i class="iconfont icon-add-success"></i></div>
          <h3>已成功付款</h3>
          </div>
       <div class="order-content" v-if="sucessInfo.orderMain">
          <p><span>訂單編號：</span><span class="num">{{sucessInfo.orderMain.orderNo}}</span></p>

          <p><span>訂購日期：</span><span class="data">{{sucessInfo.orderMain.orderTime}}</span></p>

          <p><span class="to-address">收貨地址：</span><span class="address">{{sucessInfo.delivery.addressDetail}}</span></p>

          <p><span class="consignee">收貨人：</span><span class="surname">{{sucessInfo.delivery.deliveryName}}&nbsp;</span><span class="tel">{{sucessInfo.delivery.deliveryMobile}}</span></p>

          <p><span>訂單資訊： </span><span class="numbe">共<i>1</i>個包裹</span><span class="project"><i>{{sucessInfo.orderMain.totalItemNum}}</i>件產品</span></p>

          <p><span>付款金額：</span><span class="amount">NT$<i>{{sucessInfo.constMoney | number-formater}}</i></span></p>

          <p><el-button type="primary" @click="toOrderDetail()" class="btn">去查看我的訂單詳情</el-button></p>
       </div>
       <div class="order-footer">
          <div class="footer-box">
            <p class="footer-top">
              <i class="iconfont icon-important important-icon-set"></i>提醒：
              </p>
           <p class="footer-bottom">您的訂單編號非常重要，我們會發送訂單編號至您的手機和郵箱，也建議您對此頁面進行截屏以便後期進行訂單查詢</p>
          </div>
       </div>
 </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import orderApi from '../../api/saleSlip/orderApi'
import vistorUserHead from '../../components/vistorUserHead'
export default {
  data () {
    return {
      orderId: this.$route.query.orderId,
      orderMain: '',
      sightInfoData: { picUrl: '', name: '會員暱稱', date: '' } // 用户信息
    }
  },
  methods: {
    toOrderDetail () {
      this.$router.push(`checkSight?orderId=${this.orderId}`)
    }
  },
  computed: {
    ...mapGetters({
      sucessInfo: 'sucessInfo',
      sightInfo: 'sightInfo'
    })
  },
  components: {
    vistorUserHead
  },
  created () {
    this.$store.dispatch('sucessInfo', {orderId: this.orderId})
    this.$store.dispatch('getOrderDetails', {salesSlipId: this.$route.query.salesSlipId})
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/styles/main.less";
.order-head {
  height: 60px;
  padding: 18px 30px 17px;
  border-bottom: 1px solid #E5E5E5;
  background: #fff;
  box-sizing:border-box;
  h3 {
    float: left;
    margin:0;
    font-size:18px;
    color:#2D2D2D;
    font-weight:normal;
  }
  h6 {
    float: right;
    line-height: 20px;
    margin-right: 20px;
  }
}
.border-lft-rgt {
  border-left:1px solid #e5e5e5;
  border-right:1px solid #e5e5e5;
}
.order-hedtop {
  .clearfix;
  .border-lft-rgt;
  background: #fff;
  padding: 30px 150px;
  .img {
    width: 60px;
    height: 60px;
    float: left;

  }
  h3 {
    float: left;
    margin:0 0 0 14px;
    line-height:60px;
    font-weight: 400;
    font-size:24px;
    color:#333;
  }
}
.order-content {
  .border-lft-rgt;
  background:#fff;
  padding:0 0 30px 150px;
  p {
    font-size: 12px;
    line-height: 22px;
    color:#333;
    .num {
      margin-left: 3px;
    }
    .data {
      margin-left: 3px;
    }
    .address {
      margin-left: 3px;
    }
    .surname {
      margin-left: 3px;
    }
    .numbe {
      margin-left: 3px;
      i {
        font-style:normal;
        color:#008AB0;
      }
    }
    .project {
      i {
        font-style:normal;
        color:#008AB0;
      }
    }
    .amount {
      margin-left: 3px;
      i {
        font-style:normal;
        color:#ff4500;
      }
    }
  }
  .btn {
    margin-top: 50px;
  }
}
.order-footer {
  .border-lft-rgt;
  padding-left:150px;
  padding-bottom:50px;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
  .footer-box {
    width:720px;
    padding:19px 30px 20px 19px;
    background: #F7F7F7;
    border: 1px solid #D1D1D1;
    box-sizing:border-box;
  }
  .footer-top {
    margin-bottom:7px;
    .important-icon-set {
      width:26px;
      height:26px;
      margin-right:19px;
    }
  }
  p {
    line-height: 26px;
    font-size: 16px;
    color: #008ab0;
    text-align: left;
    font-weight:700;
    .icon {
      color: red;
    }
  }
  .footer-bottom {
    font-size: 14px;
    color: #008ab0;
    text-align: left;
    font-weight:normal;
    padding-left:45px;
    line-height: 24px;
  }
}
</style>
