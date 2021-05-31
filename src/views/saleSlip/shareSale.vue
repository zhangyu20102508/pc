<template>
  <div>
    <div class="share-conent">
      <div class="icon">
        <i class="iconfont share-img icon-add-success"></i>
        <span class="icon-message">
          已新增
        </span>
        <div class="message">
          <p>
            <span>分享編號：</span>
            <span>{{periodOfValidity}}</span>
          </p>
          <p><span>分享類型：</span><span>{{target}}</span></p>
          <p>
            <span>截止日期：</span>
            <span>{{dataTime | time-formater-no-hour}}</span>
          </p>
          <P>
            <span>品項：</span>
            <span>{{count}}件</span>
          </P>
          <P>
            <span>總金額：</span>
            <span>NT$ {{totalMoney | number-formater}}</span>
          </P>
          <P>
            <span>PSV小計：</span>
            <span>{{totalPv}}</span>
          </P>
          <P>
            <span>分享名稱：</span>
            <span>{{recipients}}</span>
          </P>
          <P>
            <span>備註：</span>
            <span>{{remark}}</span>
          </P>
          <div class="share">
            <div class="share-wrap">
              <span>分享到:  </span>
              <i class="iconfont icon-facebook icon-set pointer-cursor" @click="shareFb"></i>
              <i class="iconfont icon-line icon-set pointer-cursor" @click="shareLine"></i>
              <i class="iconfont icon-link icon-set pointer-cursor" v-clipboard:copy="copyUrl+orderId" v-clipboard:success="onCopy" v-clipboard:error="onError"></i>
              <!--<i class="iconfont icon-wechat icon-set pointer-cursor" @click.stop="shareWx()"></i>-->
            </div>
            <div class="code" :class="{active:wxCode}">
              <img :src="wxCodeUrl" />
              <p>掃描二維碼分享</p>
            </div>
          </div>
          <div class="share-btn">
            <el-button  :class="{active:keeplist}" @click="addClick" class="share-list">返回列表</el-button>
            <el-button  :class="{active:keepnew}"  @click="saveClick()">新增</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import orderApi from '../../api/saleSlip/orderApi'
import shareSaleApi from '../../api/saleSlip/shareSaleApi'
export default {
  data () {
    return {
      salesSlipId: this.$route.query.salesSlipId,
      salesSlipNo: '',
      periodOfValidity: '',
      count: '',
      totalMoney: '',
      totalPv: '',
      dataTime: '',
      price: '',
      remark: '',
      total: '',
      recipients: '',
      objname: '',
      message: '',
      icon: false,
      msg: false,
      orderId: this.$route.query.salesSlipId,
      target: '單對象',
      keeplist: true,
      keepnew: false,
      copyUrl: '',
      wxCode: false,
      wxCodeUrl: '',
      saleId: ''
    }
  },
  beforeMount () {
    this.copyUrl = window.location.origin + window.location.pathname + '#/visitorSale?salesSlipId='
  },
  methods: {
    saveClick () {
      // this.$router.go(-1)
      this.$router.push({
        path: '/addSale'
      })
      if (!this.keepnew) {
        this.keepnew = true
        this.keeplist = false
      }
    },
    onCopy: function (e) {
      this.shareNum(this.orderId, 4)
      this.$message({
        message: '該分享購買地址已成功複製！',
        type: 'success',
        center: true
      })
    },
    onError: function (e) {
      this.$message({
        message: '該分享購買地址複製失敗！',
        type: 'error',
        center: true
      })
    },
    shareFb () {
      this.shareNum(this.orderId, 0)
      let shareUrl =
        window.location.origin + window.location.pathname + '#/visitorSale?salesSlipId=' + this.orderId
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u='.concat(
          encodeURIComponent(shareUrl)
        )
      )
    },
    shareLine () {
      this.shareNum(this.orderId, 1)
      let shareUrl =
        window.location.origin + window.location.pathname + '#/visitorSale?salesSlipId=' + this.orderId
      window.open(
        'https://lineit.line.me/share/ui?url='.concat(
          encodeURIComponent(shareUrl)
        )
      )
    },
    /** 分享到微信 */
    shareWx () {
      if (!this.wxCode) {
        this.shareNum(this.orderId, 2)
      }
      this.wxCode = !this.wxCode
    },
    shareNum (id, num) {
      let params = { salesSlipId: id, shareType: num }
      orderApi.shareSale(params).then(res => {})
    },
    addClick () {
      window.localStorage.setItem('searchParams', '')
      this.$router.push({ path: '/saleList' })
      if (!this.keeplist) {
        this.keeplist = true
        this.keepnew = false
      }
    }
  },
  created () {
    shareSaleApi
      .share({ salesSlipId: this.$route.query.salesSlipId })
      .then(res => {
        this.periodOfValidity = res.data.body.salesSlip.salesSlipNo
        this.count = res.data.body.salesSlip.count
        this.dataTime = res.data.body.salesSlip.periodOfValidity
        this.totalMoney = res.data.body.salesSlip.totalMoney
        this.totalPv = res.data.body.salesSlip.totalPv
        this.recipients = res.data.body.salesSlip.recipients
        this.remark = res.data.body.salesSlip.remark
        const id = res.data.body.salesSlip.id
        this.saleId = id
        const url = encodeURIComponent(`${window.location.origin}/nuskin-tw-personal-offer-h5/#/turistVistor?salesSlipId=${id}`)
        this.wxCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`
        if (res.data.body.salesSlip.target === 0) {
          this.target = '多人'
        } else {
          this.target = '單人'
        }
      })
  }
}
</script>
<style  lang="less" scoped>
@import "../../assets/styles/main.less";
.message {
  p {
    line-height: 30px;
    font-size: 12px;
  }
}
.pointer-cursor{
  cursor: pointer;
}
.share-img {
  float: left;
  width: 60px;
}
.share-to {
  color: #808080;
}
.el-icon-check {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #00ff33;
  color: #fff;
  font-size: 60px;
}
.share-line {
  margin-top: 20px;
}
.share-sale {
  font-size: 24px;
  color: #333;
  display: inline-block;
}
.share-message {
  margin-top: 60px;
}
p {
  font-size: 12px;
  color: #333333;
  line-height: 22px;
}
.active {
  background: -webkit-linear-gradient(left, #5cc2cc, #0573b2);
  color: #fff;
}
.icon {
  // position: absolute;
  // left: 150px;
  // top: 100px;
  padding: 80px 0 30px 150px;
}
.el-icon-share {
  margin: 0px 5px 0px 15px;
  cursor: pointer;
  font-size: 20px;
}
.icon-message {
  height: 33px;
  line-height: 60px;
  font-size: 24px;
  color: #333333;
  margin-left: 10px;
}
.message {
  margin-top: 40px;
}
.share {
  .code {
    opacity: 0;
    position: absolute;
    transform: translateX(-50%) scale(0);
    transition: all 0.2s;
    z-index: 100;
    display: inline-block;
    background: #008ab0;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2), 0 0 6px 0 rgba(0, 0, 0, 0.1);
    padding: 5px;
    margin-left: 169px;
    text-align: center;
    width: 103px;
    &.active {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
    img {
      width: 100px;
      height: 100px;
      margin:0;
    }
    p {
      font-size: 12px;
      color: #ffffff;
      text-align: center;
      line-height: 1;
      margin-top: 6px;
    }
  }
}
.share-btn {
  margin-top: 30px;
  .share-list{
    background: #008AB0;
    border: none;
  }
}
.share-list {
  margin-right: 22px;
}
.share-conent {
  background: #fff;
  font-size: 14px;
}
.share {
  font-size: 12px;
  .share-wrap {
    span {
      vertical-align: top;
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
    .iconfont {
      vertical-align: top;
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
  }
  span{
    padding-right: 5px;
  }
}
</style>
