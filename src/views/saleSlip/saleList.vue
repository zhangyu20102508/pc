<template>
  <div class="saleListBox" :class="backClass">
    <content-title class="content-title" :isReturn="false" title="分享列表">
      <el-button  size="medium" type="primary" @click="newSale" class="new-btn"><i class="el-icon-plus"></i> 新 增</el-button>
    </content-title>
    <el-form ref="form" :model="form" label-width="100px" class="search-form">
      <el-row>
        <el-col :span="14">
          <el-form-item label="關鍵詞搜索：" label-width="120px">
            <el-input class="key-search" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" @keyup.enter.native="onSubmit" :placeholder="numberPlaceholder" v-model.trim="form.salesSlipNo" size="small" :autofocus=true @focus="numberPlaceholder=''" @blur="numberPlaceholder='產品名稱/產品編號/備注/分享名稱'">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="分享类型：">
            <el-select class="form-select_input" v-model="form.target" placeholder="请選擇" size="mini">
              <el-option label="多人" value="0"></el-option>
              <el-option label="單人" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-top">
        <el-col :span="12">
          <el-form-item label="新增時間：" label-width="120px">
            <el-date-picker
              size="small"
              v-model="time"
              class="list-amouts-date"
              type="daterange"
              range-separator="-"
              format="yyyy-MM-dd"
              :editable = false
              :picker-options='pickerOptions1'
              start-placeholder="選擇開始日期"
              end-placeholder="選擇結束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成功下單：" label-width="100px">
            <input class="list-amout el-input__inner" @keyup.enter="onSubmit" v-model.trim="form.orderStart" :placeholder="orderPlaceholder " @input="form.orderStart=form.orderStart.replace(/[^\d]/g,'') " @focus="orderPlaceholder=''" @blur="orderPlaceholder='請填入'">
            <i class="icon icon-time">-</i>
            <input class="list-amout el-input__inner" @keyup.enter="onSubmit" v-model.trim="form.orderEnd" :placeholder="orderPlaceholder " @input="form.orderEnd=form.orderEnd.replace(/[^\d]/g,'') " @focus="orderPlaceholder=''" @blur="orderPlaceholder='請填入'">
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="align-btn left-20">
        <el-button @click="onSubmit" type="primary" class="list-query list-btn">查 詢</el-button>
        <el-button @click="resetForm" type="primary" class='list-btn reset-btn'>重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="latest-sale-wrap">
      <div class="latest-sale" v-for="items in finalLatestSale" :key='items.id'>
        <div :class="items.latestClass">
          <el-row class="list-row">
            <!--<el-col :span="7">分享編號：{{items.salesSlipNo}}</el-col>-->
            <!--<el-col :span="6">新增時間：{{items.createTime | time-formater-has-hour}}</el-col>-->
            <el-col v-if="items.target===0" :span="8">分享類型：多人</el-col>
            <el-col v-else :span="8">分享類型：單人</el-col>
            <el-col v-if="items.status === 0" :span="7">當前狀態：有效</el-col>
            <el-col v-else-if="items.status === 1" :span="7">當前狀態：已過期</el-col>
            <el-col v-else :span="7">當前狀態：已失效</el-col>
            <el-col :span="5">成功下單：{{items.orderCount}}</el-col>
          </el-row>
          <el-table  :data="items.tableData" :show-header=false width="100%" border :table-class="items.tableClass">
            <el-table-column width="827">
              <template slot-scope="scope">
                <div class="products-info" :class="scope.row.heightClass">
                  <el-row :gutter="20">
                    <el-col :span="20" class="pic-col">
                      <div class="adaptive-img margin"  v-if="scope.row.productLength > 0" v-for="(item, i) in scope.row.imgStatus" :key="i">
                        <img class="img"  v-if="!item.proImg || item.proImg === ''" src='../../assets/img/productDefault.png'>
                        <img class="img"  v-else :src=item.proImg>
                        <span class="product-status" v-if="item.proStatus === 0 || item.proStatus === 2">已失效</span>
                        <span class="product-status" v-else-if="item.proInventory <= 0">已售罄</span>
                      </div>
                      <span v-else><img src='../../assets/img/productDefault.png'></span>
                    </el-col>
                    <el-col :span="4">
                      <p>共{{scope.row.count}}件產品</p>
                      <p>NT$ {{scope.row.totalMoney | number-formater}}</p>
                      <p v-if="scope.row.productLength > 8" @click="showAllPic(scope)" class="showAllPic gery-font">全部產品展開 <i class="el-icon-arrow-down"></i></p>
                      <p @click="limitedPicNum(scope)" class="limitedPicNum gery-font">收起 <i class="el-icon-arrow-up"></i></p>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="151" align="center">
              <template slot-scope="scope">
                <p class="copy-cursor" @click="toDetail(scope)">查看詳情</p>
                <p class="copy-cursor" @click="release(scope)">再次分享</p>
              </template>
            </el-table-column>
            <el-table-column width="190">
              <template slot-scope="scope">
                <el-row class="share-row">
                  <el-col :span="24">
                    <div class="share-to">分享到</div>
                    <div v-if="scope.row.status === 1 || scope.row.status === 2" class="share-wrap share-not">
                      <i class="iconfont icon-facebook-grey icon-set"></i>
                      <i class="iconfont icon-line-grey icon-set"></i>
                      <i class="iconfont icon-link-grey icon-set"></i>
                      <!--<i class="iconfont icon-wechat-grey icon-set"></i>-->
                    </div>
                    <div v-else class="share-wrap">
                      <i class="iconfont icon-facebook icon-set" @click="shareFb(scope)"></i>
                      <i class="iconfont icon-line icon-set" @click="shareLine(scope)"></i>
                      <i class="iconfont icon-link icon-set" v-clipboard:copy="copyUrl+scope.row.id" v-clipboard:success="onCopy" v-clipboard:error="onError" :data-id="scope.row.id"></i>
                      <!--<i class="iconfont icon-wechat icon-set" @mouseout="resetShareWx(scope)" @click.stop="shareWx(scope)"></i>-->
                    </div>
                    <div class="code" :class="{active:scope.row.show}">
                      <div :id="'qrcode'+scope.row.id"></div>
                      <img :src="scope.row.imgSrc" />
                      <p>掃描二維碼分享</p>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="memo-row">
            <el-col :span="4">分享名稱：{{items.recipients}}</el-col>
            <el-col :span="20">備註：{{items.remark}}</el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="list-page">
      <el-pagination v-if= 'pageShowOrHide'
        @size-change="handleSizeChange"
        @current-change="sizeChange"
        :current-page.sync="currentPage1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="proTotal">
      </el-pagination>
    </div>
    <div v-if='noList' class="noDiv" >
      <i class="iconfont icon-no-data"></i>
      <p class="nodataP">沒有查詢到數據 </p>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import listSaleApi from '../../api/saleSlip/saleListApi'
import orderApi from '../../api/saleSlip/orderApi'
import contentTitle from '../../components/ContentTitle'
import { mapState } from 'vuex'
import imgHttp from '../../common/imghttp'

export default {
  data () {
    return {
      noList: false,
      pageShowOrHide: false,
      form: {
        salesSlipNo: '',
        orderCountStart: '',
        orderCountEnd: '',
        orderStart: '',
        orderEnd: '',
        target: ''
      },
      backClass: 'grey-back',
      time: [],
      copyUrl: '',
      currentPage1: 1,
      finalLatestSale: [],
      pageNum: 1,
      pageSize: 10,
      proTotal: 0,
      numberPlaceholder: '產品名稱/產品編號/備注/分享名稱',
      orderPlaceholder: '請填入',
      pickerOptions1: {
        /** 创建时间只能选择今天之前的 */
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  components: {
    contentTitle
  },
  beforeRouteEnter (to, from, next) {
    // console.log(from.path)
    // if (!/(checkSale|shareSale)/.test(from.path)) {
    //   window.localStorage.setItem('searchParams', '')
    // }
    next()
  },
  beforeMount () {
    this.copyUrl = window.location.origin + window.location.pathname + '/#/visitorSale?salesSlipId='
    let localParams = window.localStorage.getItem('searchParams')
    if (localParams) {
      localParams = JSON.parse(localParams)
      this.form.salesSlipNo = localParams.queryKey
      this.form.orderCountStart = localParams.orderCountStart
      this.form.orderCountEnd = localParams.orderCountEnd
      this.form.orderStart = localParams.orderStart
      this.form.orderEnd = localParams.orderEnd
      this.form.target = localParams.target
      this.time = []
      this.pageNum = localParams.pageNum
      this.currentPage1 = localParams.pageNum
      this.pageSize = localParams.pageSize
      if (localParams.createTimeStart) {
        this.time.push(moment(localParams.createTimeStart).format())
        this.time.push(moment(localParams.createTimeEnd).format())
      }
    } else {
      localParams = { pageNum: this.pageNum, pageSize: this.pageSize }
    }
    this.getlist(localParams)
  },
  computed: {
    ...mapState({
      user: 'user'
    })
  },
  methods: {
    /** 查询 */
    onSubmit () {
      this.pageNum = 1
      this.currentPage1 = 1
      const params = this.editParams()
      this.getlist(params)
    },
    editParams () {
      let params = this.form
      if (this.time && this.time.length > 0) {
        params.createTimeStart = moment(this.time[0]).format(
          'YYYY-MM-DD HH:MM:SS'
        )
        params.createTimeEnd = moment(this.time[1]).format(
          'YYYY-MM-DD HH:MM:SS'
        )
        params.createTimeStart = params.createTimeStart.substring(0, 10) + ' 00:00:00'
        params.createTimeEnd = params.createTimeEnd.substring(0, 10) + ' 23:59:59'
      } else {
        this.time = ''
        this.form.createTimeStart = ''
        this.form.createTimeEnd = ''
      }
      if (params.orderStart - params.orderEnd > 0 && params.orderEnd) {
        params.orderCountStart = params.orderEnd
        params.orderCountEnd = params.orderStart
        this.form.orderStart = params.orderCountStart
        this.form.orderEnd = params.orderCountEnd
      } else {
        params.orderCountStart = params.orderStart
        params.orderCountEnd = params.orderEnd
      }
      params.queryKey = this.form.salesSlipNo
      params = Object.assign({}, params, { pageNum: this.pageNum, pageSize: this.pageSize })
      window.localStorage.setItem('searchParams', JSON.stringify(params))
      return params
    },
    /** 重置 */
    resetForm () {
      this.form = {
        salesSlipNo: '',
        orderCountStart: '',
        orderCountEnd: '',
        createTimeStart: '',
        createTimeEnd: ''
      }
      this.time = ''
      this.currentPage1 = 1
      window.localStorage.setItem('searchParams', '')
      let formParam = this.form
      Object.assign(formParam, {
        pageNum: this.currentPage1,
        pageSize: this.pageSize
      })
      this.getlist(formParam)
    },
    /** 获取初始列表数据 */
    getlist (pra) {
      let pras = pra
      Object.assign(pras, { sortField: 'createTime', sortDirection: 'desc' })
      listSaleApi.list(pras).then(res => {
        if (res.data.success === true) {
          if (res.data.body.salesSlips.list && res.data.body.salesSlips.list.length > 0) {
            this.pageShowOrHide = true
            this.noList = false
            this.backClass = 'grey-back'
          } else {
            this.pageShowOrHide = false
            this.noList = true
            this.backClass = 'white-back'
          }
          let result = res.data.body.salesSlips.list
          this.proTotal = res.data.body.salesSlips.total
          for (let i = 0; i < result.length; i++) {
            result[i]['tableData'] = [
              {
                count: result[i].count,
                totalMoney: result[i].totalMoney,
                id: result[i].id,
                status: result[i].status,
                productInfos: result[i].productInfos,
                productLength: result[i].productImgUrls ? result[i].productImgUrls.length : 0,
                heightClass: 'limited-height'
              }
            ]
            if (result[i].status === 1 || result[i].status === 2) {
              result[i]['latestClass'] = 'invalid-sale'
            }
          }
          this.finalLatestSale = result.map((item, i) => {
            const tableData = item.tableData.map((ite, idx) => {
              ite['imgStatus'] = []
              ite.show = false
              const url = encodeURIComponent(`${window.location.origin}/nuskin-tw-personal-offer-h5/#/turistVistor?salesSlipId=${ite.id}`)
              ite.imgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`
              ite.productInfos.map((pro, inx) => {
                pro.products.map((prod, ind) => {
                  ite['imgStatus'].push({proStatus: prod.shelfStatus, proImg: imgHttp + prod.imgUrl, proInventory: prod.inventory})
                })
              })
              return ite
            })
            item.tableData = tableData
            return item
          })

          this.$nextTick(() => {
            document.getElementsByTagName('html')[0].scrollTo(0, pra.scrollTop)
            document.onclick = () => {
              this.resetShareWx()
            }
          })
        }
      })
    },
    /** 每页 */
    sizeChange (currentPage1) {
      if (currentPage1 === this.pageNum) {
        return
      }
      this.pageNum = currentPage1
      this.finalLatestSale = []
      const params = this.editParams()
      this.getlist(params)
    },
    /** 更改每页條數 */
    handleSizeChange (val) {
      this.pageSize = val
      this.finalLatestSale = []
      const params = this.editParams()
      this.getlist(params)
    },
    /** 新增销售单 */
    newSale () {
      if (this.user.user.name === '' || this.user.user.name === null) {
        this.$message({
          showClose: true,
          message: '請先設置暱稱',
          type: 'error'
        })
      } else {
        this.$router.push({ path: './addSale' })
      }
    },
    /** 展开全部产品 */
    showAllPic (scope) {
      scope.row.heightClass = 'auto-height'
    },
    /** 收起全部产品 */
    limitedPicNum (scope) {
      scope.row.heightClass = 'limited-height'
    },
    /** 查看详情 */
    toDetail (scope) {
      let scrollTop = document.getElementsByTagName('html')[0].scrollTop
      let params = window.localStorage.getItem('searchParams')
      let searchParams = JSON.parse(params || '{}')
      searchParams.scrollTop = scrollTop
      searchParams.pageNum = this.pageNum
      window.localStorage.setItem('searchParams', JSON.stringify(searchParams))
      this.$router.push({
        path: '/checkSale',
        query: { salesSlipId: scope.row.id }
      })
    },
    /** 再次发布 */
    release (scope) {
      this.$router.push({
        path: '/againAdd',
        query: { salesSlipId: scope.row.id }
      })
    },
    /** 复制成功 */
    onCopy: function (e) {
      let params = {salesSlipId: e.trigger.dataset.id, shareType: 4}
      orderApi.shareSale(params).then(res => {
        this.getInfo()
      })
      this.$message({
        message: '該分享購買地址已成功複製！',
        type: 'success',
        center: true
      })
    },
    /** 复制失败 */
    onError: function (e) {
      this.$message({
        message: '該分享購買地址複製失败！',
        type: 'error',
        center: true
      })
    },
    /** 分享到Facebook */
    shareFb (scope) {
      let params = {salesSlipId: scope.row.id, shareType: 0}
      orderApi.shareSale(params).then(res => {})
      let shareUrl =
        window.location.origin + window.location.pathname + '#/visitorSale?salesSlipId=' + scope.row.id
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u='.concat(
          encodeURIComponent(shareUrl)
        ), '', 'height=400,width=600,top=100,left=300,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no'
      )
    },
    /** 分享到line */
    shareLine (scope) {
      let params = {salesSlipId: scope.row.id, shareType: 1}
      orderApi.shareSale(params).then(res => {})
      let shareUrl =
        window.location.origin + window.location.pathname + '#/visitorSale?salesSlipId=' + scope.row.id
      window.open(
        'https://lineit.line.me/share/ui?url='.concat(
          encodeURIComponent(shareUrl)
        )
      )
    },
    /** 微信分享恢复初始状态 */
    resetShareWx () {
      const result = this.finalLatestSale
      this.finalLatestSale = result.map((item, i) => {
        const tableData = item.tableData.map((ite, idx) => {
          ite.show = false
          return ite
        })
        item.tableData = tableData
        return item
      })
    },
    /** 分享到微信 */
    shareWx (scope) {
      if (scope.row.show === false) {
        let params = { salesSlipId: scope.row.id, shareType: 2 }
        orderApi.shareSale(params).then(res => {
          scope.row.show = true
        })
      } else {
        scope.row.show = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.grey-back{
  background: #f1f1f1;
}
.white-back{
  background: #fff;
}
.saleListBox {
  min-height: 80vh;
  padding-bottom: 20px;
  .content-title {
    background: #fff;
  }
  .list-btn {
    width: 80px;
    height: 32px;
    font-size: 12px;
    line-height: 6px;
  }
  .new-btn-wrap{
    text-align: right;
    .new-btn{
      width: 96px;
      font-size: 12px;
      height: 32px;
      text-indent: -5px;
      margin-right: 15px;
    }
  }
  .reset-btn{
    background: none;
    color: #333333;
    border: 1px solid #E5E5E5;
  }
  .orderInput {
    width: 80px;
  }
  .noDiv {
    margin: 90px 40%;
    text-align: center;
    .nodata {
      width: 100px;
      height: 100px;
    }
    .nodataP {
      margin: 30px 0;
      font-size: 14px;
    }
  }
  .copy-cursor {
    cursor: pointer;
    font-size: 12px;
  }
  .copy-cursor:hover{
    color: #008AB0;
  }
  .list-page{
    text-align: center;
    margin-top: 20px;
  }
  .latest-sale-wrap {
    .adaptive-img{
      position: relative;
    }
    .product-status{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      color: white;
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      top: 1px;
      left: 0;
      text-align: center;
      line-height: 60px;
    }
    .invalid-sale{
      color: #a7a7a7;
      .products-info p{
        color: #a7a7a7;
      }
      .copy-cursor{
        color: #a7a7a7;
      }
      .share-to{
        color: #a7a7a7;
      }
    }
    .latest-title {
      font-size: 16px;
      background: white;
      height: 60px;
      padding-left: 15px;
      line-height: 60px;
      margin-top: 10px;
      margin-bottom: 10px;
      span{
        height: 16px;
        padding-left: 10px;
        border-left: 2px solid #0089AF;
      }
    }
    .latest-sale {
      border: 1px solid #E5E5E5;
      margin-bottom: 20px;
      .code {
        opacity: 0;
        position: absolute;
        left: 50%;
        transform: translateX(-50%) scale(0);
        transition: all .2s;
        z-index: 100;
        display: inline-block;
        background: #008AB0;
        box-shadow: 0 0 2px 0 rgba(0,0,0,0.20), 0 0 6px 0 rgba(0,0,0,0.10);
        padding:5px;
        &.active {
          opacity: 1;
          transform: translateX(-50%) scale(1);
        }
        img {
          width:100px;
          height:100px;
        }
        p {
          font-size: 12px;
          color: #FFFFFF;
          text-align: center;
          line-height: 1;
          margin-top:6px;
        }
      }
    }
    .list-row {
      font-size: 12px;
      padding: 10px 0 10px 20px;
      background: #f9f9f9;
    }
    .products-info {
      font-size: 12px;
      p{
        text-align: right;
        margin-right: 10px;
      }
      .showAllPic,
      .limitedPicNum {
        cursor: pointer;
      }
    }
    .auto-height {
      height: auto;
      .showAllPic {
        display: none;
      }
      .limitedPicNum {
        display: block;
      }
    }
    .limited-height {
      height: 69px;
      overflow: hidden;
      .showAllPic {
        display: block;
      }
      .limitedPicNum {
        display: none;
      }
    }
    .memo-row {
      font-size: 12px;
      background: white;
      .el-col {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        border-right: 1px solid #e5e5e5;
      }
    }
    .share-row{
      font-size: 12px;
      margin-left: 10px;
    }
    .share-wrap {
      margin-top: 5px;
      .icon-set {
        margin-right: 5px;
        cursor: pointer;
      }
    }
    .share-not{
      .icon-set{
        cursor: not-allowed;
      }
    }
  }
  .list-header {
    border-bottom: 1px solid #ddd;
    padding: 10px 0 10px 20px;
    background: white;
    span{
      height: 22px;
      display: inline-block;
      line-height: 22px;
      border-left: 2px solid #0089AF;
      padding-left: 10px;
      margin-top: 8px;
    }
  }
  .search-form{
    padding: 30px 30px 10px 30px;
    background: white;
    margin-bottom: 20px;
    .align-btn{
      margin-left: 10px;
    }
    .left-20 {
      margin-left: 20px;
    }
    .row-top{
      margin-top: 10px;
    }
    .key-search{
      width: 330px;
    }
  }
  .list-amout {
    float: left;
    width: 134px;
    height: 32px;
    margin-top: 3px;
    line-height: 32px;
  }
  .list-amouts {
    float: left;
    width: 150px;
  }
  .list-amouts-date {
    width: 330px;
  }
  .icon-time {
    float: left;
    margin: 0 5px;
  }
}
</style>
<style lang="less">
  .saleListBox{
    .el-table--group, .el-table--border{
      border: none;
    }
    .search-form{
      .el-form-item__label{
        font-size: 12px;
      }
      .el-form-item{
        margin-bottom: 10px;
      }
      .el-input__inner{
        font-size: 12px;
      }
      .form-select_input {
        .el-input__inner {
          line-height: 32px;
          height: 32px;
        }
      }
    }
    .el-table,
    .el-table__body-wrapper,
    .el-table .cell {
      overflow: inherit;
    }
    .el-table th, .el-table td{
      vertical-align: top;
    }
    .list-page{
      .el-pagination {
        .disabled {
          color: #c0c4cc;
          background-color: #fff;
          cursor: not-allowed;
        }
      }
    }
  }
</style>
