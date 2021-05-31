<template>
  <div class="light-grey">
    <vistor-user-head v-if="!sightInfo" :sightInfo="sightInfoData"></vistor-user-head>
    <vistor-user-head v-else :sightInfo="sightInfo"></vistor-user-head>
    <div class="product-list-wrap" ref="wrap">
      <div class="list-title">
        <div>產品名稱</div>
        <div>產品單價</div>
        <div>產品數量</div>
        <div>產品總價</div>
      </div>
      <div v-for="item in productInfos" class="product-list" :key="item.id">
        <div class="series-name">{{item.name}}</div>
        <el-table :data="item.products" width="100%" :show-header=false>
          <el-table-column prop="date" width="80">
            <template slot-scope="scope">
              <div style="position: relative">
                <span class="adaptive-img">
                  <img :src="scope.row.imgUrl" class="img"/>
                </span>
                <span class="product-status" v-if="scope.row.shelfStatus === 0 || scope.row.shelfStatus === 2">已失效</span>
                <span class="product-status" v-else-if="scope.row.inventory <= 0">已售罄</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="340">
            <template slot-scope="scope">
              <p>{{scope.row.cnName}}</p>
              <p>PSV{{scope.row.pv}}</p>
              <p>{{scope.row.itemNo}}</p>
            </template>
          </el-table-column>
          <el-table-column width="160">
            <template slot-scope="scope">
              單價：NT${{scope.row.price | number-formater}}
            </template>
          </el-table-column>
          <el-table-column align="center" width="295">
            <template slot-scope="scope">
              <div v-if="scope.row.shelfStatus === 0 || scope.row.shelfStatus === 2">已失效</div>
              <div v-else-if="scope.row.inventory <= 0">已售罄</div>
              <div v-else class="input-number">
                <span @click='reduceNum(scope)' v-if='scope.row.count > 0'>-</span>
                <span class="not-allowed" v-if='scope.row.count <= 0 '>-</span>
                <input v-model="scope.row.count" onkeyup="value=value.replace(/[^\d]/g,'')" @input="changeScopeNum(scope, $event)" @blur="spaceToOne(scope)">
                <span @click='addNum(scope)' v-if="scope.row.count < scope.row.inventory">+</span>
                <span @click='addNum(scope)' v-else class="not-allowed">+</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="295">
            <template slot-scope="scope">
              <div class="total-price-left">總價 ：NT${{productTotalPrice(scope.row) | number-formater}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="balance-wrap" :class="balanceStyle">
      <el-row class="balance-row">
        <el-col :span="21" class="right" v-if="isInvalid === 1">
          很抱歉，該分享已過期
        </el-col>
        <el-col :span="21" class="right" v-else-if="isInvalid === 2">
          該單人分享已有人下單佔用
        </el-col>
        <el-col :span="21" class="right" v-else-if="totalInventory <= 0 || invaildLength < 1">
          分享中全部產品已售罄或失效
        </el-col>
        <el-col :span="21" class="right" v-else>
          <span class="total-num">總計：<span class="blue-font">{{totalCount}}</span> 件</span>
          <span style="margin-left: 20px;">NT$ <span class="orange-font">{{totalPrice | number-formater}}</span></span>
        </el-col>
        <el-col :span="3" class="right">
          <el-button type="primary" size="small" v-if="isInvalid === 1 || isInvalid === 2 || totalInventory === 0 || invaildLength < 1"  class="purchase-btn" @click="saleOutVisible=true">聯繫賣方</el-button>
          <el-button type="primary" size="small" v-else :loading="isBuying" @click="purchaseProducts"  class="purchase-btn">購買</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="" :visible.sync="saleOutVisible" :show-close=false :custom-class="saleoutDialogClass">
      <div class="dialog-wrap">
        <div class="sale-out-img">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sale-out"></use>
          </svg>
        </div>
        <div class="black-tip" v-if="isInvalid === 1">很抱歉，您看到的這份分享已過期</div>
        <div class="black-tip" v-else-if="isInvalid === 2">很抱歉，該分享只能支持一個人下單，目前已有人下單</div>
        <div class="black-tip" v-else>很抱歉，您看到的這份分享中的產品已全部售罄或失效</div>
        <!--<div class="margin-top1 grey-tip">如果您有購買需要，請在下方留下您的聯係方式，銷售人員會及時與您聯係</div>-->
        <div v-if="!sightInfo" class="margin-top1 grey-tip">如有需要購買請聯繫 <span class="blue-font">{{sightInfoData.sightName}}</span>
        </div>
        <div v-else class="margin-top1 grey-tip">如有需要購買請聯繫 <span class="blue-font">{{sightInfo.name}}</span>
        </div>
        <el-form :model="saleOutForm" :rules="rules" ref="saleOutForm" class="form-style">
          <el-form-item label="您的稱呼" label-width="80" class="margin-top2" prop="name">
            <el-input v-model="saleOutForm.name" auto-complete="off" :placeholder="nicknamePlaceholder" @focus="nicknamePlaceholder=''" @blur="nicknamePlaceholder='如何稱呼您'"></el-input>
          </el-form-item>
          <el-form-item label="聯繫方式" class="margin-top2" prop="tel">
            <el-input
              v-model.trim="saleOutForm.tel"
              onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
              auto-complete="off"
              :placeholder="mailPlaceholder" @focus="mailPlaceholder=''" @blur="mailPlaceholder='手機號碼或郵箱'"></el-input>
          </el-form-item>
          <el-form-item label="附加留言" class="margin-top2" prop="message">
            <el-input type="textarea" :row="3" @input.native="cutMessage($event,50)" v-model="saleOutForm.message" auto-complete="off" :placeholder="messagePlaceholder" @focus="messagePlaceholder=''" @blur="messagePlaceholder='您有什麼需求請留言'"></el-input>
          </el-form-item>
          <el-form-item align="center" class="margin-top3">
            <el-button type="primary" size="small" class="dialogSubmit gradient-btn" @click="submitForm('saleOutForm')">
              確認提交
            </el-button>
            <el-button size="small" class="closeDialog" @click="closeSaleOut">取消</el-button>
          </el-form-item>
          <div class="margin-top3 center">
            <el-form-item align="center">
              <el-button size="small" class="backToIndex">進入會員店鋪首頁</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="commentVisible" :show-close=false center :modal=false width="20%">
      <div class="contacts-tip">您的聯係方式已成功提交</div>
      <div class="center">
        <el-button size="small" type="info" disabled class="gradient-btn contacts-sure-btn">確認提交</el-button>
        <el-button
          type="primary"
          size="small"
          class="closeCommentSuccess contacts-btn-width gradient-btn"
          @click="closeCommentSuccess">關閉
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import orderApi from '../../api/saleSlip/orderApi'
import commentApi from '../../api/visitorSale/commentApi'
import vistorUserHead from '../../components/vistorUserHead'
import imgHttp from '../../common/imghttp'

export default {
  data () {
    var validateTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('聯繫方式不能為空'))
      } else {
        let regPhon = /^[0][9][0-9]{8}$/
        let regMail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}/
        let isTrue = false
        if (regPhon.test(value)) {
          isTrue = true
        } else if (regMail.test(value)) {
          isTrue = true
        }
        if (!isTrue) {
          callback(new Error('請輸入正確的手機號碼或電子郵箱格式'))
        } else {
          callback()
        }
      }
    }
    var validateN = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('稱謂信息不能為空'))
      } else {
        /* eslint no-control-regex: off */
        if (value.replace(/[^\u0000-\u00ff]/g, 'aa').length > 20) {
          // 正則表達式最多支持20英文字母或10漢字
          callback(new Error('已超出限定字數'))
        } else {
          callback()
        }
      }
    }
    var validateMessage = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請輸入您的留言'))
      } else {
        if (value.replace(/[^\u0000-\u00ff]/g, 'aa').length > 50) {
          // 正則表達式最多支持50英文字母或25漢字
          callback(new Error('已超出限定字數,最多五十個漢字或一百個字符'))
        } else {
          callback()
        }
      }
    }
    return {
      saleOutVisible: false,
      commentVisible: false,
      isInvalid: 0,
      originCount: 0,
      totalCount: 0,
      totalPrice: 0,
      totalPv: 0,
      isBuying: false, // 正在購買
      productInfos: [],
      products: [],
      orderProducts: [],
      saleTarget: 0, // 銷售單對象
      saleStatusCn: '', // 銷售單是否失效
      totalInventory: 0,
      balanceStyle: '',
      sellingDistId: '',
      invaildLength: 0,
      productsLength: 0,
      saleoutDialogClass: 'saleout-dialog',
      sightInfoData: { picUrl: '', sightName: '會員暱稱', date: '' },
      saleOutForm: {
        name: '',
        tel: '',
        message: ''
      },
      nicknamePlaceholder: '如何稱呼您',
      mailPlaceholder: '手機號碼或郵箱',
      messagePlaceholder: '您有什麼需求請留言',
      rules: {
        name: [
          { validator: validateN, trigger: 'blur' },
          { required: true, message: '稱謂信息不能為空', trigger: 'blur' }
        ],
        tel: [
          { validator: validateTel, trigger: 'blur' },
          { required: true, message: '聯繫方式不能為空', trigger: 'blur' }
        ],
        message: [
          { validator: validateMessage, trigger: 'blur' },
          { required: true, message: '請輸入活動名称', trigger: 'blur' }
        ]
      }
    }
  },
  beforeMount () {
    // 判斷用戶的訪問設備 在内容未加載的时候改变路径
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      window.location.href = window.location.origin + '/nuskin-tw-personal-offer-h5/#/turistVistor?salesSlipId=' + this.$route.query.salesSlipId
    }
    this.getListData()
    this.getShareOpenTime()
  },
  components: {
    vistorUserHead
  },
  computed: mapGetters({
    sightInfo: 'sightInfo'
  }),
  // created () {
  // },
  methods: {
    cutMessage (str, len) {
      str = str.target.value
      this.$nextTick(() => {
        if (str.replace(/[^\u0000-\u00ff]/g, 'aa').length > len) {
          str = str + ''
          console.log(str)
          let word = /[\u4e00-\u9fa5]/ // 中文
          let nowLen = 0
          for (let i = 0; i < len; i++) {
            if (word.test(str.charAt(i))) {
              nowLen += 2
            } else {
              nowLen += 1
            }
            if (nowLen > len) {
              this.saleOutForm.message = str.substring(0, i)
              return
            } else {
              this.saleOutForm.message = str.substring(0, len)
            }
          }
        }
      })
    },
    getShareOpenTime () {
      let params = { salesSlipId: this.$route.query.salesSlipId }
      orderApi.getShareOpenTime(params)
    },
    productTotalPrice (scope) {
      let count = parseInt(scope.count) || 0
      let { price, inventory } = scope
      if (inventory !== 0) {
        return parseInt(count) * price
      } else {
        return 0
      }
    },
    // 輸入數量為空，默認為1
    spaceToOne (scope) {
      if (scope.row.count === '') {
        scope.row.count = 0
      }
    },
    /** 获取初始数据 */
    getListData () {
      // let params = { salesSlipId: this.$route.query.salesSlipId }
      // orderApi.getDetailList(params).then(res => {
      const res = {
        data: {
          body: {
            salesSlip: {
              user: {
                headImgUrl: 'https://www.baidu.com/img/flexible/logo/pc/result.png'
              },
              productInfos: []
            }
          }
        }
      }
      let result = res.data.body
      this.$store.dispatch('getOrderDetail', result.salesSlip)
      if (result.salesSlip.productInfos || result.salesSlip.productInfos.length > 0) {
        result.salesSlip.productInfos.map((productListChoose, index1) => {
          productListChoose.products.map((productList, index) => {
            this.productsLength++
            productList.imgUrl = imgHttp + productList.imgUrl
            this.originCount++
            this.totalInventory += productList.inventory
            if (productList.count > productList.inventory) {
              productList.count = productList.inventory
            }
            if (productList.shelfStatus === 1 && productList.inventory > 0) {
              this.invaildLength++
            }
          })
        })
        if (result.salesSlip.status === 1) {
          this.isInvalid = 1
          this.saleOutVisible = true
        } else if (result.salesSlip.status === 2) {
          this.isInvalid = 2
          this.saleOutVisible = true
        } else if (this.invaildLength < 1) {
          this.saleOutVisible = true
        } else {
          this.saleOutVisible = false
        }
        // this.totalPrice = result.salesSlip.totalMoney
        this.productInfos = result.salesSlip.productInfos
        this.saleTarget = result.salesSlip.target
        this.saleStatusCn = result.salesSlip
        this.status = result.salesSlip.status
        this.sellingDistId = result.salesSlip.userId // 传的userId
        this.computedNumCountPrice()
        // 數據列表超過最小高度，底部購買固定
        this.$nextTick(() => {
          let height = this.$refs.wrap.offsetHeight
          if (height > 500) {
            this.balanceStyle = 'balance-style'
          }
        })
      }
      // })
    },
    /** 计算产品总数量及总价 */
    computedNumCountPrice () {
      let Num = 0
      let Price = 0
      let Pv = 0
      for (let value of this.productInfos) {
        for (let product of value.products) {
          let count = product.count || 0
          let { price, pv, inventory, shelfStatus } = product
          if (inventory !== 0 && shelfStatus !== 0 && shelfStatus !== 2) {
            Num += parseInt(count)
            Price += parseInt(count) * price
            Pv += pv
          }
        }
      }
      this.totalCount = Num
      this.totalPrice = Price
      this.totalPv = Pv
    },
    /** 輸入框更改購買产品数量 */
    changeScopeNum (scope, e) {
      /** 如果有值 转换為数字 */
      let val = e.target.value.replace(/^0/g, '').replace(/\./g, '').replace(/\D/g, '').replace(/^-/, '')
      if (val) {
        scope.row.count = val
      } else {
        scope.row.count = 0
      }
      if (parseInt(scope.row.count) > 99) {
        if (scope.row.inventory <= 99) {
          scope.row.count = scope.row.inventory
        } else {
          scope.row.count = 99
        }
      }
      if (parseInt(scope.row.count) > scope.row.inventory) {
        scope.row.count = scope.row.inventory
      }
      this.computedNumCountPrice()
    },
    /** 增加購買产品数量 */
    addNum (scope) {
      scope.row.count = parseInt(scope.row.count) + 1
      if (scope.row.inventory > 99) {
        scope.row.inventory = 99
      }
      if (scope.row.count > scope.row.inventory) {
        scope.row.count = scope.row.inventory
      }
      this.computedNumCountPrice()
    },
    /** 减少購買产品数量 */
    reduceNum (scope) {
      scope.row.count = parseInt(scope.row.count) - 1
      this.computedNumCountPrice()
    },
    /** 产品售罄，提交客戶填写信息 */
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            message: this.saleOutForm.message,
            name: this.saleOutForm.name,
            phone: this.saleOutForm.tel,
            salesSlipId: this.$route.query.salesSlipId,
            userId: this.sightInfo.userId,
            salesSlipNo: this.sightInfo.salesSlipNo,
            status: 0
          }
          commentApi.submitComment(params).then(res => {
            if (res.data.success === true) {
              this.saleOutVisible = false
              this.saleOutForm = {
                name: '',
                tel: '',
                message: ''
              }
              this.$message({
                message: '您的聯繫方式已成功提交',
                type: 'success',
                center: true
              })
            } else {
              this.$message({
                showClose: false,
                message: res.data.errMsg,
                type: 'error',
                center: true
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /** 关闭售罄弹框 */
    closeSaleOut () {
      this.saleOutVisible = false
    },
    /** 关闭留言成功弹框 */
    closeCommentSuccess () {
      this.commentVisible = false
    },
    /**
     * @author
     * @param
     * @namespace
     * 購買产品
     */
    purchaseProducts () {
      if (this.status === 1 || this.status === 2) {
        this.$message({
          showClose: true,
          message: '該分享已失效，無法購買',
          type: 'error'
        })
      } else {
        let finalItems = JSON.parse(JSON.stringify(this.productInfos))
        this.products = [] // 已选的数量不為零产品
        this.orderProducts = []
        for (let i = 0; i < finalItems.length; i++) {
          for (let n = 0; n < finalItems[i].products.length; n++) {
            if (finalItems[i].products[n].count > 0 && finalItems[i].products[n].inventory !== 0 && finalItems[i].products[n].shelfStatus !== 0 && finalItems[i].products[n].shelfStatus !== 2) {
              this.products.push({
                id: finalItems[i].products[n].id,
                productCount: finalItems[i].products[n].count
              })
              this.orderProducts.push(finalItems[i].products[n])
            }
          }
        }
        if (this.products.length === 0) {
          this.$message({
            showClose: true,
            message: '購買件數不能為0',
            type: 'error'
          })
        } else {
          let id = this.$route.query.salesSlipId
          let params = {
            salesSlipId: id,
            products: JSON.stringify(this.products),
            count: this.totalCount,
            totalMoney: this.totalPrice
          }
          this.isBuying = true
          orderApi.purchaseProducts(params).then(res => {
            if (res.data.success === true) {
              let visitorSale = {
                name: this.sightInfo.name,
                count: this.totalCount,
                price: this.totalPrice,
                date: this.sightInfo.date,
                picUrl: this.sightInfo.picUrl,
                orderProducts: this.orderProducts,
                selfIntroduction: this.sightInfo.selfIntroduction ? this.sightInfo.selfIntroduction : '',
                sellingDistId: this.sellingDistId
              }
              /** 相关数据存入storage，供确认订單页面使用 */
              localStorage.setItem('visitorSale', JSON.stringify(visitorSale))
              this.$router.push({
                path: '/orderSub',
                query: {salesSlipId: id}
                // query: { salesSlipId: id, id: res.data.body.newOrder.id }
              })
            } else if (res.data.success === true) {
              /** 库存不足提示 */
              this.noInventory()
            } else {
              this.$message({
                showClose: false,
                message: res.data.errMsg,
                type: 'error'
              })
            }
            this.isBuying = false
          }).catch((err) => {
            this.isBuying = false
            this.$message({
              showClose: false,
              message: '網絡錯誤',
              type: 'error'
            })
            console.log(err)
          })
        }
      }
    },
    /** 产品库存不足 */
    noInventory () {
      this.$confirm('您所購買的產品中有部分產品庫存不足，請重新提交', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false
      }).then(() => {
        let params = { salesSlipId: this.$route.query.salesSlipId }
        orderApi.getDetailList(params).then(res => {
          this.productInfos = res.data.body.salesSlip.productInfos // 獲取最新庫存
          this.productInfos.map((productListChoose, index1) => {
            productListChoose.products.map((productList, index) => {
              this.products.map((pro, index2) => {
                if (productList.id === pro.id) {
                  if (pro.productCount > productList.inventory) { // 大於庫存時，將當前最新庫存賦值給count
                    productList.count = productList.inventory
                    let aa = this.productInfos[index1]
                    aa.productList = productList
                    Vue.set(this.productInfos, index, aa)
                    this.totalCount = 0
                    if (productList.inventory !== 0) {
                      this.totalCount += productList.count
                    }
                  }
                }
              })
            })
          })
          this.computedNumCountPrice()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/styles/main.less";

.list-title {
  & > div {
    position: relative;
    float: left;
    &:nth-child(1) {
      left: 91px;
    }
    &:nth-child(2) {
      left: 384px;
    }
    &:nth-child(3) {
      left: 605px;
    }
    &:nth-child(4) {
      left: 827px;
    }
  }
}

.light-grey {
  background: #f9f9f9;
  position: relative;
  .blue-font {
    color: #008AB0;
  }
  .orange-font {
    color: orange;
  }
}

.center {
  text-align: center;
}

.right {
  text-align: right;
}
.product-list-wrap {
  min-height: 500px;
  overflow: auto;
  font-size: 12px;
  background: white;
  .list-title {
    height: 40px;
    line-height: 40px;
    background: white;
    border-top: 1px solid #e5e5e5;
    .list-title-row {
      .el-col {
        text-align: left;
      }
      .center-col {
        text-align: center;
      }
      .left-col {
        text-indent: 10px;
      }
    }
  }
  .total-price-left {
    margin-left: 85px;
  }
  .product-status{
    width: 48px;
    height: 48px;
    border-radius: 50%;
    color: white;
    background: rgba(0,0,0,0.2);
    position: absolute;
    top: 5px;
    left: 10px;
    text-align: center;
    line-height: 48px;
  }
  .series-name {
    height: 40px;
    line-height: 40px;
    text-indent: 15px;
    background: #f9f9f9;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }
  .input-number {
      font-size:0;
      display: inline-block;
      height:32px;
      width:108px;
      border-radius: 5px;
      border: 1px solid #d1d1d1;
      overflow: hidden;
      &:hover {
        border:1px solid #bbb;
      }
      span {
        position: relative;
        display: inline-block;
        line-height: 32px;
        padding:0 12px;
        font-size:14px;
        border-right:1px solid #d1d1d1;
        background: #fff;
        cursor: pointer;
        color:#fff;
        -webkit-user-select: none;
        -moz-user-select: none;
        &:first-child::after {
          content: '';
          border-bottom: 1px solid #666;
          position: absolute;
          left: 10px;
          top: 16px;
          width: 8px;
        }
      }
      input+span {
        color:#333;
        border-left:1px solid #d1d1d1;
        border-right:none;
      }
      input {
        border: none;
        line-height: 32px;
        height:32px;
        width:40px;
        font-size:14px;
        padding: 0;
        outline:none;
        text-align: center;
      }
      .not-allowed {
        &:after {
          border-color:#ddd !important;
        }
        cursor: not-allowed;
        color: #ddd;
      }
    }
  .series-info {
    height: 80px;
    margin-bottom: 20px;
    overflow: hidden;
    .series-pro-img {
      width: 80px;
      height: 80px;
      float: left;
      margin-left: 40px;
      background: #e5e5e5;
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
}
.balance-style{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -4px 8px 0 rgba(0, 0, 0, 0.10);
}
.balance-wrap {
  z-index: 999;
  height: 80px;
  background: white;
  line-height: 80px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  .balance-row {
    width: 1170px;
    margin: 0 auto;
  }
  .total-num {
    margin-left: 40px;
  }
  .total-price {
    text-align: center;
  }
  .purchase-btn {
    margin-right: 20px;
  }
}

.dialog-wrap {
  margin: 0 auto;
  margin-top: -20px;
  padding-bottom: 20px;
  .sale-out-img {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    svg {
      width: 80px;
      height: 80px;
    }
  }
  .margin-top1 {
    margin-top: 10px;
  }
  .margin-top2 {
    margin-top: 15px;
  }
  .margin-top3 {
    margin-top: 25px;
  }
  .form-style {
    width: 324px;
    margin: 0 auto;
  }
  .black-tip {
    width: 420px;
    margin: 0 auto;
    color: #333333;
    text-align: center;
  }
  .grey-tip {
    font-size: 12px;
    width: 400px;
    margin: 0 auto;
    margin-top: 10px;
    color: #808080;
    text-align: center;
  }
  .dialogSubmit {
    width: 138px;
    height: 40px;
  }
  .closeDialog {
    width: 138px;
    height: 40px;
    margin-left: 40px;
  }
  .backToIndex {
    width: 160px;
    border: none;
  }
}

.contacts-tip {
  margin-top: -10px;
  text-align: center;
  margin-bottom: 40px;
}

.contacts-btn-width {
  width: 80px;
}

.contacts-sure-btn {
  background: #ccc;
}

.el-input-number {
  width: 110px;
  /deep/ .el-input-number__decrease {
    left: 2px
  }
}
</style>
<style lang="less">
.light-grey {
  .saleout-dialog {
    width: 540px;
    .el-dialog__body {
      padding: 10px 20px;
    }
  }
  .dialog-wrap {
    .el-input__inner {
      width: 324px;
      height: 32px;
      font-size: 12px;
    }
    .el-form-item__label {
      color: #333333;
      line-height: 25px;
    }
  }
  .product-list {
    table {
      font-size: 12px;
    }
  }
}
</style>
