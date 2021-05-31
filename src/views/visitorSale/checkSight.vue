<template>
   <div class="sight-wrapper" v-if="checkSight.orderMain">
    <content-title class="content-title" v-if="isSalesEnd" title="查看訂單詳情"></content-title>
      <div class="sight-head">
        <div class="head-left">
          <h3>{{checkSight.orderMain.status}}</h3>
        </div>
        <div class="head-right">
          <p class="order">訂單&nbsp;&nbsp;{{checkSight.orderMain.orderNo}}</p>
          <div class="time">
            <span>下單時間</span>
            <span class="date" v-if="checkSight.orderMain.orderTime">{{checkSight.orderMain.orderTime}}</span>
          </div>
        </div>
      </div>
      <div class="sight-delivery">
        <p class="title">
          收貨人：
          <span>{{checkSight.delivery.deliveryName}}</span>
          <span>{{checkSight.delivery.deliveryMobile}}</span>
          <span>快遞包裹</span>
        </p>
        <p class="address">
          收貨地址：
          <span>{{checkSight.delivery.addressDetail}}</span>
        </p>
      </div>
      <el-table :data="checkSight.orderItems"   class="sight-table">
        <el-table-column prop="mgUrl"  label="產品" width="420">
          <template slot-scope="scope">
            <span class="sight-image adaptive-img"><img :src="scope.row.imgUrl" class="img"/></span>
            <div class="sight-word">{{scope.row.itemName}}</div>
            <!--<p>{{scope.row.standardName}}</p>-->
            <p>{{scope.row.itemCode}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="cnName" label="價格" width="240">
          <template slot-scope="scope">
            <span>NT${{scope.row.itemPrice | number-formater}}</span><br/>
          </template>
        </el-table-column>
        <el-table-column  prop="count" label="數量" width="195" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.itemNum}}</span><br/>
          </template>
        </el-table-column>
        <el-table-column  prop="totalMoney" label="小計" width="315">
          <template slot-scope="scope">
            <span>{{scope.row.itemNum*scope.row.itemPrice | number-formater}}</span><br/>
          </template>
        </el-table-column>
          <!-- <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="buyAgain(scope.$index)">
              再次購買
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="sight-detail">
        <p>付款方式：<span>信用卡付款</span></p>
        <p>產品金額：NT$<span>{{checkSight.orderMain.itemAmount | number-formater}}</span></p>
        <p>付款時間：<span>{{checkSight.orderMain.payTime}}</span></p>
        <p>運費：NT$<span>100</span></p>
        <p v-if="checkSight.orderMain.payAmount >= 4000 ">優惠：NT$<span>100</span></p>
        <p v-else>優惠：NT$<span>0</span></p>
        <p>付款金額：NT$<span>{{checkSight.orderMain.payAmount | number-formater}}</span></p>
        <p v-if="checkSight.invoice.mailGuiYn === 'N'">發票信息：<span>紙本發票-同收貨地址</span></p>
        <p v-else>發票資訊：<span>紙本發票-另寄</span></p>
        <p>發票地址：<span>{{checkSight.invoice.addressDetail}}</span></p>
      </div>
 </div>
</template>
<script>
import {mapGetters} from 'vuex'
import contentTitle from '../../components/ContentTitle'

export default {
  data () {
    return {
      orderId: this.$route.query.orderId,
      salesSlipNo: '',
      phone: '',
      orderNo: '',
      receiveRegionInfo: '',
      periodOfValidity: '',
      totalMoney: '',
      fare: '',
      receiver: '',
      receiveAddress: '',
      ctTime: '',
      // status: '',
      isSalesEnd: false,
      productList: [],
      orderProgress: {
        applyTime: '',
        payTime: '',
        sucessTime: ''
      }
    }
  },
  components: {
    contentTitle
  },
  computed: mapGetters({
    checkSight: 'checkSight'
  }),
  beforeMount () {
    // 判斷用户的访问设备 在内容未加载的时候改变路径
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      if (/checkSight/.test(this.$route.path)) {
        window.location.href = window.location.origin + '/nuskin-tw-personal-offer-h5/#/checkSight?orderId=' + this.$route.query.orderId
      }
    }
  },
  mounted () {
    if (/saleCheckSight/g.test(this.$route.path)) {
      this.isSalesEnd = true
    }
  },
  created () {
    this.orderId = this.$route.query.orderId
    let params = {orderId: this.orderId}
    this.$store.dispatch('getPurchaseProducts', params)
  },
  methods: {
    buyAgain () {
      this.$router.push(`visitorSale?salesSlipId=${this.checkSight.orderMain.salesSlipId}`)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/styles/main.less";
.sight-wrapper {
  background-color:#f1f1f1;
  .content-title {
    background: #fff;
  }
}
.sight-head {
  .clearfix;
  margin-top: 20px;
  background-image: -webkit-linear-gradient(left,#008AB0 ,#0089Af,#0089AF,#007298);
  background:#008ab0\0;
  height: 100px;
  .head-left {
    float: left;
    position:relative;
    h3 {
     line-height: 100px;
     margin: 0 30px;
     font-size: 16px;
     color: #B9E1EA;
     font-weight: normal;
    }

  }
  .head-right {
    float: left;
    font-size: 16px;
    color: #fff;
    height: 100px;
    padding: 26px 0 0;
    box-sizing: border-box;
    .order {
      margin-bottom: 11px;
      font-family: PingFangSC-Regular;
    }
    .time {
      font-size: 13px;
      span{
        font-family: PingFangSC-Regular;
      }
      .date {
        padding-left:20px;
      }
    }
  }
}
.sight-delivery {
  margin: 20px 0;
  padding: 20px 29px;
  background: #fff;
  .title {
    font-size: 14px;
    color: #2D2D2D;
    letter-spacing: 0;
    line-height: 22px;
    margin-bottom: 9px;
    span:nth-child(3) {
      color: #727272;
      padding-left: 65px;
      line-height: 22px;
    }
  }
  .address {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #727272;
    letter-spacing: 0;
    line-height: 22px;
  }
}
.sight-detail {
  background: #fff;
  padding: 30px;
  p {
    font-size: 12px;
    color: #2D2D2D;
    letter-spacing: 0;
    line-height: 22px;
  }
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  &:last-child {
    .grid-content {
      border-right:none;
    }
  }
}
.bg-purple {
  border-right: 0px;
}
.bg-purple-light {
  border-right: 0px;
}
.grid-content {
  height: 260px;
  text-align: left;
  padding:0 20px;
  border-right: 1px solid #e5e5e5;
  h3 {
    font-weight: 700;
    margin:0;
    margin-bottom:11px;
    font-size: 14px;
    color: #333333;
    line-height: 22px;
  }
  p {
    font-size: 12px;
    color: #808080;
    letter-spacing: 0;
    line-height: 22px;
  }
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.sight-ul {
  height: 100%;
  margin-left: 20px;
  h3 {
    font-weight: 100;
  }
  p {
    font-size: 12px;
    color: #bbb;
  }
  .sight-message {
    float: left;
    border-right: 1px solid #ccc;
    padding-right: 50px;
    height: 100%;
  }
  .sight-step {
    height: 200px;
    float: left;
    margin-left: 50px;
  }
}
.sight-tab {
  // height:230px;
  border-bottom: 1px solid #ccc;
}

.sight-message p {
  height: 30px;

  line-height: 20px;
}
.sight-table {
  background:#fff;
  .sight-image {
    width: 90px;
    height: 90px;
    float: left;
  }
  .sight-image {
    height:60px;
    width:60px;
    margin-right:15px;
  }
  .sight-word {
    font-size: 12px;
      color: #333333;
      font-weight:700;
    }
  }

</style>
<style  lang="less">
  .sight-wrapper {
   .el-table {
     thead {
       tr:first-child {
         th {
           background:#f9f9f9;
         }
      }
     }
     .sight-word~p {
       font-size: 12px;
        color: #808080;
     }
     thead.is-group th {
      background: #fff;
    }
   }
  }
</style>
