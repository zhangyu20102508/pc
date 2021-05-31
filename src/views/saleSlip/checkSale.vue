<template>
  <div class="checkSale">
    <content-title title="分享詳情" :showMore=true :orderSuccess="orderCount"></content-title>
    <el-form :label-position="labelPosition" label-width="150px" :model="formLabelAlign" class="check-form">
      <el-form-item class="order-number" label="分享編號:">
        <span>{{checkDetail.salesSlipNo}}</span>
      </el-form-item>
      <el-form-item label="分享類型:" class="check-object input-container">
        <span v-if="radio === 0">多人</span>
        <span v-else-if="radio === 1">单人</span>
      </el-form-item>
      <el-form-item label="截止日期:" class="check-pick input-container">
        <span>{{checkDetail.periodOfValidity | time-formater-no-hour}}</span>
      </el-form-item>
      <el-form-item label="分享狀態:" class="check-pick input-container">
        <span v-if="checkDetail.status === 0">有效</span>
        <span v-else-if="checkDetail.status === 1">已過期</span>
        <!-- <span>{{checkDetail.statusCn}}</span> -->
      </el-form-item>
      <el-form-item label="分享名稱:" class="check-obj input-container">
        <span>{{recipients}}</span>
      </el-form-item>
      <el-form-item label="備註:" class="check-msg textareas-container">
        <span>{{checkDetail.remark}}</span>
      </el-form-item>
      <el-form-item label="成功下單:" class="check-msg textareas-container">
        <div>{{orderCount}}筆</div>
        <div class="visitor-list" v-for="(panel, idx) in visitorList" :key="idx">
          <div class="visitor-list_item">
            <div class="visitor-list_head">
              <div class="list-head_left">
                <span class="count">共 {{panel.orderMain.totalItemNum}} 件商品</span>
                <span class="number">{{panel.orderMain.orderNo}}</span>
                <span class="date">{{panel.orderMain.payTime}}</span>
              </div>
              <div class="list-head_right">
                <span class="amount">NT${{panel.orderMain.payAmount}}</span>
                <span class="status">{{panel.orderMain.status}}</span>
              </div>
            </div>
            <div class="visitor-list_list" :style="{'height': panel.open ? panel.orderItems.length * 90 +'px': '90px'}" :class="{'active': panel.open}">
              <div class="visitor-list_content" v-for="(item, i) in panel.orderItems" :key="i">
                <div class="list-content_img">
                  <img :src="item.imgUrl" alt="產品圖片" />
                </div>
                <div class="list-content_product">
                  <p class="name">{{item.itemName}}</p>
                  <p class="num">產品編號{{item.itemCode}}</p>
                </div>
                <div class="list-content_desc">
                  <p>單價：NT${{item.itemPrice}}</p>
                  <p>數量：x {{item.itemNum}}</p>
                  <p>合計：NT${{item.itemNum * item.itemPrice}}</p>
                </div>
                <div class="list-content_operation" v-if="i === 0">
                  <span @click="openMore(idx)" v-if="panel.orderItems.length > 1" v-show="!panel.open" class="more">更多<i class="el-icon-arrow-down"></i></span>
                  <span @click="closeMore(idx)" v-if="panel.orderItems.length > 1" v-show="panel.open" class="more">收起<i class="el-icon-arrow-up"></i></span>
                  <el-button @click="toDetail(idx)" size="small" type="primary" plain>查看詳情</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="visitorList-more" v-if="visitorListHasMore">
          <span v-if="!isLoading" @click="loadMore" class="visitorList-more_text">點擊加載更多</span>
          <span v-else class="visitorList-more_text"><i class="el-icon-loading"></i></span>
        </div>
      </el-form-item>
      <el-form-item label="產品:">
        <el-table :data="productListInfo" class="check-table">
          <el-table-column align="center" prop="mgUrl" label="產品圖片" width="180">
            <template slot-scope="scope">
              <div class="adaptive-img list-content_img">
                <img :src="scope.row.imgUrl" class="img" />
                <div class="inValid" v-if="scope.row.shelfStatus === 0 || scope.row.shelfStatus === 2">已失效</div>
                <div class="inValid" v-else-if="scope.row.inventory <= 0">已售罄</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cnName" label="產品名称">
            <template slot-scope="scope">
              <span>{{scope.row.cnName}}</span><br/>
              <span class="check-name">PSV{{scope.row.pv}}</span>
            </template>
          </el-table-column>
          <el-table-column  align="center" prop="itemNo" label="產品編號"></el-table-column>
          <el-table-column align="center" label="產品價格">
            <template slot-scope="scope">
              <span>NT${{scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="count" label="產品數量"></el-table-column>
        </el-table>
      </el-form-item>
      <p class="project">已選產品
        <span class="num"> {{count}}</span> 件, 總金額 NT$
        <span class="price">{{totalMoney | number-formater}}</span>,
        <span>PSV{{totalPv}}</span>
      </p>
      <p class="project accumulated-price">累計銷售總額 NT$ <span class="price">{{cumulativeMoney | number-formater}}</span>
      </p>
      <div class="check-btn">
        <div :class="{active:publish}" class="block" @click="publishClick()">再次分享</div>
        <div :class="{active:rtlist}" class="block return" @click="rtClick()">返回列表</div>
      </div>
    </el-form>
  </div>
</template>
<script>
import HeadNav from '@/components/HeadNav'
import checkAPI from '../../api/saleSlip/checkApi'
import contentTitle from '../../components/ContentTitle'
import imgHttp from '../../common/imghttp'

export default {
  data () {
    return {
      publish: true,
      rtlist: false,
      salesSlipId: this.$route.query.salesSlipId,
      periodOfValidity: '',
      nickName: '',
      checkDetail: '',
      salesSlipNo: '',
      target: '',
      recipients: '',
      price: '',
      totalMoney: '',
      cumulativeMoney: '',
      totalPv: '',
      count: '',
      total: '',
      message: '',
      imgUrl: '',
      orderCount: 0,
      pageNum: 1,
      visitorListHasMore: false,
      isLoading: false,
      productListInfo: [],
      visitorList: [],
      radio: '0',
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      }
    }
  },
  methods: {
    returnButton () {
      window.history.go(-1)
    },
    publishClick () {
      this.$router.push({
        path: '/againAdd',
        query: {
          salesSlipId: this.$route.query.salesSlipId
        }
      })
      if (!this.publish) {
        this.rtlist = false
        this.publish = true
      }
    },
    rtClick () {
      window.localStorage.setItem('searchParams', '')
      this.$router.push({ path: '/saleList' })
      if (!this.rtlist) {
        this.rtlist = true
        this.publish = false
      }
    },
    openMore (idx) {
      this.visitorList[idx].open = true
    },
    closeMore (idx) {
      this.visitorList[idx].open = false
    },
    toDetail (idx) {
      this.$router.push(`saleCheckSight?orderId=${this.visitorList[idx].orderMain.id}`)
    },
    loadMore () {
      this.pageNum = this.pageNum + 1
      let params = {
        salesSlipId: this.$route.query.salesSlipId,
        pageNum: this.pageNum,
        pageSize: 10
      }
      this.isLoading = true
      this.getTransformOrder(params)
    },
    getTransformOrder (params) {
      checkAPI.transformOrder(params).then(res => {
        if (res.data.success) {
          let data = res.data.body.orderPage
          if (data.list && data.list.length > 0) {
            data.list = [...this.visitorList, ...data.list]
            this.visitorList = data.list.map((item, idx) => {
              item.orderItems = item.orderItems.map((ite, i) => {
                if (!/www/.test(ite.imgUrl)) {
                  ite.imgUrl = imgHttp + ite.imgUrl
                }
                return ite
              })
              item.open = false
              // 判断订单所处状态
              if (item.orderMain.status === 0) {
                item.orderMain.status = '預處理'
              } else if (item.orderMain.status === 1) {
                item.orderMain.status = '代付款'
              } else if (item.orderMain.status === 2) {
                item.orderMain.status = '已付款'
              } else if (item.orderMain.status === 3) {
                item.orderMain.status = '已客審'
              } else if (item.orderMain.status === 31) {
                item.orderMain.status = '已財審'
              } else if (item.orderMain.status === 4) {
                item.orderMain.status = '發貨中'
              } else if (item.orderMain.status === 41) {
                item.orderMain.status = '已發貨'
              } else if (item.orderMain.status === 5) {
                item.orderMain.status = '已收貨'
              } else if (item.orderMain.status === 6) {
                item.orderMain.status = '完成'
              } else if (item.orderMain.status === 9) {
                item.orderMain.status = '取消'
              } else if (item.orderMain.status === 91) {
                item.orderMain.status = '終止'
              }
              return item
            })
            if (data.list.length === (this.orderCount - 0)) {
              this.visitorListHasMore = false
            } else {
              this.visitorListHasMore = true
            }
            this.isLoading = false
          }
        }
      })
    },
    _formatNumber (value) {
      if (!value || value === '') {
        return ''
      }
      let newVal = ''
      let val = value + ''
      if (val.length >= 4) {
        val = val.split('').reverse().join('')
        const arr = val.match(/\d{3}/g)
        const len = arr.length
        let i = 0
        if (val.length % 3 !== 0) {
          const banlance = val.slice(len * 3)
          for (; i < len; i++) {
            newVal += arr[i] + ','
          }
          newVal += banlance
        } else {
          for (; i < len; i++) {
            newVal += arr[i] + ','
          }
          newVal = newVal.substr(0, newVal.length - 1)
        }
        newVal = newVal.split('').reverse().join('')
      } else {
        newVal = val
      }
      return newVal
    }
  },
  created () {
    checkAPI.check({ salesSlipId: this.$route.query.salesSlipId }).then(res => {
      let result = res.data.body
      this.checkDetail = result
      let detailList = []
      result.salesSlip.productInfos.map(function (pro, index) {
        pro.products.map(function (item, i) {
          item.choosenum = item.count // 初始产品数量字段与配置产品字段统一
          detailList.push(item)
        })
      })
      detailList = detailList.map((item, idx) => {
        item.price = this._formatNumber(item.price)
        item.imgUrl = imgHttp + `${item.imgUrl}`
        return item
      })
      this.productListInfo = detailList
      this.recipients = result.salesSlip.recipients
      this.checkDetail.salesSlipNo = result.salesSlip.salesSlipNo
      this.checkDetail.statusCn = result.salesSlip.statusCn
      this.checkDetail.status = result.salesSlip.status
      this.checkDetail.remark = result.salesSlip.remark
      this.count = result.salesSlip.count
      this.totalMoney = result.salesSlip.totalMoney
      this.cumulativeMoney = result.salesSlip.cumulativeMoney
      this.totalPv = result.salesSlip.totalPv
      this.radio = result.salesSlip.target
      this.orderCount = result.salesSlip.orderCount
      /* 时间转换 */
      this.checkDetail.periodOfValidity = new Date(result.salesSlip.periodOfValidity.replace(/-/g, '/'))
      let params = {
        salesSlipId: this.$route.query.salesSlipId,
        pageNum: 1,
        pageSize: 10
      }
      this.getTransformOrder(params)
    })
  },
  components: { HeadNav, contentTitle }
}
</script>
<style lang="less" scoped>
.checkSale {
  // .visitor-list {
  //   //
  // }
  .visitor-list_item {
    border: 1px solid #e5e5e5;
    background-color: #fff;
    width: 910px;
    margin-bottom: 11px;
    .visitor-list_head {
      background: #F9F9F9;
      padding: 9px 22px 9px 19px;
      font-size: 12px;
      color: #2D2D2D;
      line-height: 22px;
      &:after {
        content: '';
        display: table;
        clear: both;
        *zoom: 1;
      }
      .list-head_left {
        float: left;
        span {
          padding-right: 20px;
        }
      }
      .list-head_right {
        float: right;
        span {
          padding-left: 20px;
        }
      }
    }
    .visitor-list_list {
      height: 90px;
      overflow: hidden;
      box-sizing: border-box;
      transition: all .3s;
      &.active {
        height: auto;
      }
    }
    .visitor-list_content {
      padding: 15px;
      background-color: #fff;
      height: 90px;
      box-sizing: border-box;
      .list-content_product {
        display: inline-block;
        width: 280px;
        margin-left: 15px;
        p {
          line-height: 20px;
        }
        .num {
          font-size: 12px;
          color: #727272;
        }
      }
      .list-content_desc {
        display: inline-block;
        p {
          display: inline-block;
          font-size: 12px;
          color: #2D2D2D;
          line-height: 22px;
          margin-right: 40px;
          &:first-child {
            width: 94px;
          }
          &:nth-child(2) {
            width: 72px;
          }
          &:last-child {
            margin-right: 10px;
          }
        }
      }
      .list-content_operation {
        float: right;
        margin-top: 8px;
        width: 136px;
        text-align: right;
        span {
          display: inline-block;
          margin-right: 10px;
        }
        .more {
          font-size: 12px;
          color: #2D2D2D;
          cursor: pointer;
          i {
            padding-left: 5px;
          }
        }
      }
    }
  }
  .list-content_img {
    position: relative;
    display: inline-block;
    height: 60px;
    width: 60px;
    line-height: 60px;
    vertical-align: middle;
    text-align: center;
    background-image: url(../../assets/img/img-loading.gif);
    background-size: cover;
    background-position: -9px 0;
    .inValid {
      position: absolute;
      left: 0;
      top: 5px;
      width: 50px;
      height: 50px;
      line-height: 50px;
      border-radius: 50%;
      font-size: 14px;
      background: rgba(0,0,0,.3);
      color: #fff;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
    }
  }
  .visitorList-more {
    text-align: center;
    .visitorList-more_text {
      cursor: pointer;
    }
  }
}
</style>

<style lang="less">
.checkSale{
  background: #fff;
}
.check-form {
  margin: 20px;
  font-size: 12px;
  color: #333333;
  .itemWidth400 {
    .el-textarea__inner {
      width:420px;
      height:80px;
      padding:6px;
      resize:none;
      border-radius:0;
    }
  }
  .el-table {
    thead {
      tr {
        th {
          padding:5px 0;
          background: #F7F7F7;
          font-size: 12px;
          color: #333333;
        }
      }
    }
  }
  .order-number {
    .el-form-item__label,.el-form-item__content {
      line-height: 30px;
    }
  }
  .input-container {
    .el-date-editor.el-input {
      width: 240px;
      margin-right:10px;
    }
    .el-input__inner {
      border-radius:0;
    }
    .el-input {
      width:240px;
      margin-right:10px;
    }
  }
  .textareas-container {
    .el-textarea {
      width: 350px;
      display: inline-block;
    }
    .el-textarea__inner {
      width: 340px;
      height: 80px;
      padding: 6px 15px;
      resize: none;
      border-radius: 0;
    }
  }
  .check-objInput {
    width: 240px;
  }
   .el-form-item {
    margin-bottom:10px;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .el-radio__input.is-checked + .el-radio__label {
    font-size: 12px;
    color: #333;
  }
  .check-select {
    margin: 20px 0px 10px 0px;
  }
  .el-table th.is-leaf,
  .el-table td {
    font-size: 12px;
    color: #333;
  }
}
.check-btn {
  margin-left:150px;
  padding:40px 0 60px;
  .block {
      cursor:pointer;
      background: #008AB0;
      border-radius: 3px;
      width: 116px;
      padding:0;
      text-align: center;
      line-height: 40px;
      height: 40px;
      color:#fff;
      font-size:14px;
      box-sizing: border-box;
      margin-right:30px;
      display: inline-block;
    }
    .return {
      background: #FFFFFF;
      border: 1px solid #E5E5E5;
      border-radius: 6px;
      color:#2d2d2d;
    }
}
.check-name {
  font-size: 12px;
  color: #808080;
}
.check-image {
  width: 60px;
  height: 60px;
}
.check-header-but {
  border-bottom: 1px solid #ccc;
  line-height: 60px;
  color: #333;
  .check-icon {
    display: inline-block;
    margin-left: 12px;
    width: 4px;
    height: 14px;
    color: #0089af;
    span {
      display: inline-block;
      margin: -2px;
      width: 6px;
      height: 16px;
      background: #0089af;
    }
  }
  .check-retbtn {
    cursor: pointer;
  }
  .check-return {
    font-size: 14px;
    color: #808080;
  }
  .check-detail {
    width: 112px;
    display: inline-block;
    line-height: 33px;
    margin-left: 12px;
    font-size: 16px;
    color: #333333;
  }
}
.sale-name {
  margin-left: 30px;
  font-size: 12px;
  color: #333333;
  text-align: right;
  margin-top: 36px;
}
.button {
  background: -webkit-linear-gradient(left, #5cc2cc, #0573b2);
  color: #fff;
  float: right;
  margin: 9px;
}
.check-message {
  font-size: 12px;
  width: 420px;
  height: 80px;
}
.check-table {
  width: 780px;
  border: 1px solid #ccc;
  font-size: 12px;
  color: #333;
}
.el-arrow-left {
  width: 10px;
  height: 10px;
  color: #979797;
  line-height: 20px;
  display: inline-block;
  transform: rotate(45deg);
  border: 2px solid #979797;
  border-right: 0px;
  border-top: 0px;
  margin-left: 10px;
}
.project {
  margin-left: 160px;
  margin-top: 10px;
  font-size: 12px;
  color: #333333;
  .num {
    font-size: 12px;
    color: #00bed8;
    line-height: 17px;
  }
  .price {
    font-size: 12px;
    color: #ff8000;
    line-height: 17px;
  }
}
.accumulated-price{
  font-size: 14px;
  margin-top: 20px;
  .price{
    font-size: 14px;
  }
}
</style>
