<template>
  <div class="ordersub-wrapper">
    <div class="orderSubBox">
      <sight-info :sight-info="orderInfo"></sight-info>
      <div class='receatInfo'>
        <div class='backUp'>
          <span>確認訂單</span>
        </div>
        <el-form label-width="150px" :model="formLabelAlign" :rules="rules" ref="ruleForm" size='small'>
          <el-form-item label-width='180px' label="以下信息均爲必填項" pop='infos' :rules="{ required: true, message: '請填寫活動形式', trigger: 'blur' }">
          </el-form-item>
          <el-form-item label="收貨人：" class='itemWidth400' prop="name">
            <el-input v-model="formLabelAlign.name" :placeholder="receiverPlaceholder" @focus="receiverPlaceholder=''" @blur="receiverPlaceholder='例：王小明'"></el-input>
          </el-form-item>
          <el-form-item label="手機號碼：" class='itemWidth400' prop="region">
            <el-input onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model="formLabelAlign.region" maxlength="10" :placeholder="telPlaceholder" @focus="telPlaceholder=''" @blur="handleBlur($event)"></el-input>
          </el-form-item>
          <el-form-item label="歷史收貨：" v-show="historyList.length>0" class='itemWidth400'>
            <el-select @change="setAddress" v-model="formLabelAlign.historyId" placeholder="請選擇">
              <el-option v-for="(item,idx) in historyList" :key="idx" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收貨方式：" class='itemWidth400' prop="type">
            <el-select v-model="formLabelAlign.type" placeholder="請選擇" class="receiver-type">
              <el-option v-for="item in receiveType" :key="item.label" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收貨地區：" class='itemWidth400' prop="selectedOptions">
            <el-cascader :options="options" v-model="formLabelAlign.selectedOptions" @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="詳細地址：" class='itemWidth400' prop="realyAdress">
            <el-input type="textarea" class="textarea-address" v-model='formLabelAlign.realyAdress' @input.native="handleAddressInput($event)" :placeholder="addressPlaceholder" @focus="addressPlaceholder=''" @blur="addressPlaceholder='請填寫詳細地址'"></el-input>
          </el-form-item>
          <el-form-item label="電子郵箱：" class='itemWidth400' prop="receiveEmail">
            <el-input maxlength="30" v-model='formLabelAlign.receiveEmail' :placeholder="mailPlaceholder" @focus="mailPlaceholder=''" @blur="mailPlaceholder='請填寫電子郵箱'"></el-input>
          </el-form-item>
          <el-form-item label="發票：" class='itemWidth400 posRelative' prop="invoice">
            <el-input v-model='formLabelAlign.invoice' @focus="showModal"></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span='8' :offset="7" class="product-sub-agreement">
            <el-checkbox size="small" v-model="agreeMent"></el-checkbox>
            <span>我同意<i @click="openAgreeMent">《個人資料使用同意事項》</i></span>
          </el-col>
        </el-row>
        <el-row class='proInfo'>
          <el-col :span='24'>
            <span>產品明細 </span>
            <!-- <span>（訂單將按照以下明細拆成多個包裹發貨） </span> -->
          </el-col>
        </el-row>
        <el-row class="product-tabel-head">
          <el-col :span='10'>
            產品
          </el-col>
          <el-col :span='6'>
            單價
          </el-col>
          <el-col :span='4'>
            數量
          </el-col>
          <el-col :span="4">
            小計
          </el-col>
        </el-row>
        <div class="proList">
          <el-row class='padL30'>
            <span>產品清單</span>
          </el-row>
          <el-row class="product-row" v-for='item in productList' :key='item.id'>
            <el-col :span='10'>
              <span class="product-img adaptive-img"><img class="img" :src=item.imgUrl></span>
              <div class="product-info">
                <p>{{item.cnName}}</p>
                <p>{{item.itemNo}}</p>
              </div>
            </el-col>
            <el-col :span='6'>
              單價：NT${{item.price | number-formater}}
            </el-col>
            <el-col :span='4'>
              X{{item.count}}
            </el-col>
            <el-col :span="4">
              小計：NT${{item.price * item.count | number-formater}}
            </el-col>
          </el-row>
        </div>
        <el-row class="product-settlement-box">
          <el-col :span='6' :offset="18" class='fotInfo'>
            <div class="infoContainer">
              <p>產品數量：
                <span>{{orderInfo.count}}</span>
              </p>
              <p>商品金額：
                <span> NT${{orderInfo.price | number-formater}}</span>
              </p>
              <p>運費+：
                <span>NT${{yunfei}}</span>
              </p>
              <p>優惠金額-：
                <span>NT${{disCountMoney}}</span>
              </p>
              <p>應付金額(含運費)：
                <span>NT$
                  <em>{{surePay | number-formater}}</em>
                </span>
              </p>
            </div>
          </el-col>
          <el-col :span='16' :offset="12" class="product-sub-btn">
            <el-button type="primary fr" :loading="isPaying" @click="goToPay">付款</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 發票信息设置框 -->
    <el-dialog title="發票設定" :visible.sync="invoiceInfo.show" width="35%" center :close-on-click-modal='false' @close="closeInvoiceModal">
      <div class="invoice-main">
        <div class="invoice-type">
          <p>發票類型</p>
          <div class="el-tag invoice-tag">紙本發票</div>
        </div>
        <div class="invoice-send">
          <p>發票寄送</p>
          <div class="el-tag invoice-tag" :class="{elInfo: invoiceInfo.sendWay == 1}" @click="invoiceSendWayChange(0)">同收貨地址</div>
          <div class="el-tag invoice-tag" :class="{elInfo: invoiceInfo.sendWay == 0}" @click="invoiceSendWayChange(1)">另寄發票</div>
        </div>
        <div class="invoice-send-info" v-if="invoiceInfo.sendWay == 1">
          <el-form :model="invoiceInfo" :rules="rules1" ref="invoiceRule" label-width="80px" size='small'>
            <el-form-item label="收貨人" prop="name">
              <el-input v-model="invoiceInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="收貨地址" prop="selectedOptions">
              <el-cascader :options="options" v-model="invoiceInfo.selectedOptions" @change="invoiceChange">
              </el-cascader>
            </el-form-item>
            <el-form-item label="詳細地址" prop="realyAdress">
              <el-input v-model="invoiceInfo.realyAdress" @input.native="handleAddressInput1($event)"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveInvoice">儲存</el-button>
        <el-button @click="closeInvoiceModal">關閉</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="重要提醒"
      :visible.sync="hasPhoneDialog"
      :custom-class="hasPhoneClass">
      <span>如果您是如新經銷商，為保護您的權益，建議前往如新購物車購物</span>
      <span slot="footer" class="dialog-footer">
        <a target="_blank" href="https://test.nuskin.com/content/nuskin/zh_TW/home.html">
          <el-button type="primary">前往如新購物車</el-button>
        </a>
      </span>
    </el-dialog>
    <el-dialog
      title="個人資料使用同意事項"
      :visible.sync="agreeMentDialog"
      :show-close="false"
      custom-class="buyAgreement"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center>
      <span class="text">本人同意美商如新華茂股份有限公司台灣分公司、NSI及其關係企業(合稱如新公司)於產品銷售或服務、其他利益發放之特定目的範圍內，得蒐集、處理或利用本人個人資料(包括但不限於本人姓名、聯絡方式或其他得以直接或間接方式識別該個人之資料)，並得在中華民國境內外傳輸本人資料。<i>本人亦得為前述目的範圍內而將本人之資料提供予銷售商品給本人之會員處理、利用及傳輸。</i>本人同意如新公司依法令規定或因執行業務所必需之期間保存本人資料，如本人資料有所變更願立即通知如新公司，否則，本人了解將可能無法獲得如新公司所提供之服務與相關權益保障。本人對所提供之個人資料，依法具有查詢或請求閱覽、製給複製本、補充或更正、請求停止蒐集、處理、利用或請求刪除之權。本人同意，請求這些權利事項可能須繳交合理之手續費用，且如因本人提出前述權利請求而導致可能對本人資料所造成之權益受損，如新公司不須負擔損害賠償責任。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAgreeMent">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import orderSubApi from '../../api/visitorSale/orderSubApi'
import sightInfo from '../../components/vistorUserHead'
import moment from 'moment'
export default {
  data () {
    var validateRecipients = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('例：王小明'))
      } else {
        /* eslint no-control-regex: off */
        if (value.replace(/[^\u0000-\u00ff]/g, 'aa').length > 20) {
          // 正则表达式最多支持20英文字母或10漢字
          callback(new Error('已超出限定字數'))
        } else {
          this.formLabelAlign.name = value.replace(/(^\s*)|(\s*$)/g, '')
          callback()
        }
      }
    }
    var validateRecipients1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('例：王小明'))
      } else {
        /* eslint no-control-regex: off */
        if (value.replace(/[^\u0000-\u00ff]/g, 'aa').length > 20) {
          // 正则表达式最多支持20英文字母或10漢字
          callback(new Error('已超出限定字數'))
        } else {
          this.invoiceInfo.name = value.replace(/(^\s*)|(\s*$)/g, '')
          callback()
        }
      }
    }
    var validateTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請填寫手機號碼'))
      } else {
        let regPhon = /^[0][9][0-9]{8}$/
        if (!regPhon.test(value)) {
          callback(new Error('請填入有效的電話號碼'))
        } else {
          callback()
        }
      }
    }
    var validateMail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請填寫電子郵箱'))
      } else {
        if (value.length > 30) {
          callback(new Error('已超出限定字數'))
        }
        let regMail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}/
        if (!regMail.test(value)) {
          callback(new Error('電子郵箱格式錯誤'))
        } else {
          this.formLabelAlign.receiveEmail = value.replace(/(^\s*)|(\s*$)/g, '')
          callback()
        }
      }
    }
    var validateAddress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請填寫詳細地址'))
      } else {
        /* eslint no-control-regex: off */
        if (value.replace(/[^\u0000-\u00ff]/g, 'aa').length > 32) {
          // 正则表达式最多支持20英文字母或10漢字
          callback(new Error('已超出限定字數'))
        } else {
          this.formLabelAlign.realyAdress = value.replace(/(^\s*)|(\s*$)|\n/g, '')
          callback()
        }
      }
    }
    var validateAddress1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('請填寫詳細地址'))
      } else {
        /* eslint no-control-regex: off */
        if (value.replace(/[^\u0000-\u00ff]/g, 'aa').length > 32) {
          // 正则表达式最多支持20英文字母或10漢字
          callback(new Error('已超出限定字數'))
        } else {
          this.invoiceInfo.realyAdress = value.replace(/(^\s*)|(\s*$)|\n/g, '')
          callback()
        }
      }
    }
    return {
      receiverPlaceholder: '例：王小明',
      telPlaceholder: '請填寫收貨人手機號碼',
      addressPlaceholder: '請填寫詳細地址',
      mailPlaceholder: '請填寫電子郵箱',
      surePay: 0, // 应付金额
      disCountMoney: 0, // 优惠金额
      yunfei: 100, // 运费金额
      productList: [],
      hasPhoneDialog: false,
      hasPhoneClass: 'has-phone-dialog',
      isPaying: false, // 正在提交表单信息
      historyList: [], // 歷史收貨地址
      historyResult: '', // 原始历史收货地址
      checkInput: false, // 是否有必填项未填寫
      checkInvoiceInput: false, // 發票信息是否有必填项未填寫
      orderId: '',
      agreeMent: false, // 协议
      confirmTime: '', // 同意购买协议时间
      agreeMentDialog: false,
      invoiceInfo: {
        // 發票相关参数
        show: false, // 模态框开关
        sendWay: 0, // 0: 同配货地址  1：另寄發票
        receiptInfoId: 0, // 提交發票信息成功后返回的ID 提交订单时需要 未设置时為0
        // 另寄發票收货信息
        name: '',
        selectedOptions: [],
        realyAdress: ''
      },
      orderInfo: {
        name: '',
        count: '',
        date: '',
        price: '',
        picUrl: ''
      },
      formLabelAlign: {
        name: '',
        region: '',
        type: '',
        selectedOptions: [],
        realyAdress: '',
        receiveEmail: '',
        invoice: '',
        historyId: ''
      },
      rules: {
        infos: [{
          required: true,
          message: '請填寫活動形式',
          trigger: 'blur'
        }],
        name: [
          { validator: validateRecipients, trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ],
        region: [
          { validator: validateTel, trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ],
        receiveEmail: [
          { validator: validateMail, trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ],
        type: [{
          required: true,
          message: '請選擇收貨方式',
          trigger: 'change'
        }],
        selectedOptions: [{
          required: true,
          message: '請選擇收貨地區',
          trigger: 'change'
        }],
        realyAdress: [
          { validator: validateAddress, trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ]
      },
      rules1: {
        name: [
          { validator: validateRecipients1, trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ],
        selectedOptions: [{
          required: true,
          message: '請選擇收貨地區',
          trigger: 'change'
        }],
        realyAdress: [
          { validator: validateAddress1, trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ]
      },
      options: [],
      receiveType: [{
        value: 0,
        label: '快遞包裹'
      }]
    }
  },
  components: {
    sightInfo
  },
  watch: {
    agreeMent (val, oldVal) {
      if (val) {
        this.agreeMentDialog = true
      }
    },
    'formLabelAlign.realyAdress' (val, oldVal) {
      this.$nextTick(() => {
        this.formLabelAlign.realyAdress = val.replace(/[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g, '')
      })
    },
    'formLabelAlign.name' (val, oldVal) {
      this.$nextTick(() => {
        this.formLabelAlign.name = val.replace(/[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g, '')
      })
    },
    'invoiceInfo.realyAdress' (val, oldVal) {
      this.$nextTick(() => {
        this.invoiceInfo.realyAdress = val.replace(/[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g, '')
      })
    },
    'invoiceInfo.name' (val, oldVal) {
      this.$nextTick(() => {
        this.invoiceInfo.name = val.replace(/[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g, '')
      })
    }
  },
  methods: {
    confirmAgreeMent () {
      this.agreeMent = true
      this.confirmTime = moment(new Date()).format('YYYYMMDDHHmmss')
      this.$nextTick(() => {
        this.agreeMentDialog = false
      })
    },
    openAgreeMent () {
      this.agreeMentDialog = true
    },
    handleBlur (e) {
      let value = e.target.value
      this.telPlaceholder = '請填寫收貨人手機號碼'
      let regPhon = /^[0][9][0-9]{8}$/
      if (regPhon.test(value)) {
        this.getHistoryList(value)
      }
    },
    limitTextLen (e, params) {
      this.$nextTick(() => {
        let val = e.target.value.replace(/~/g, '')
        if (val.replace(/[^\u0000-\u00ff]/g, 'aa').length > 32) {
          let i = 0
          let j = 0
          let x = 0
          for (;i < val.length; i++) {
            if (/[^\u0000-\u00ff]/.test(val[i])) {
              j += 2
            } else {
              j += 1
            }
            if (j === 32) {
              x = i
            }
          }
          this[params.split('.')[0]][params.split('.')[1]] = val.replace(/(^\s*)|(\s*$)/g, '').slice(0, x + 1)
        } else {
          this[params.split('.')[0]][params.split('.')[1]] = val.replace(/(^\s*)|(\s*$)/g, '')
        }
      })
    },
    handleAddressInput (e) {
      if (/\w?'/.test(e.target.value)) {
        return
      }
      this.limitTextLen(e, 'formLabelAlign.realyAdress')
    },
    handleAddressInput1 (e) {
      if (/\w?'/.test(e.target.value)) {
        return
      }
      this.limitTextLen(e, 'formLabelAlign.invoiceInfo')
    },
    showModal () {
      this.invoiceInfo.show = true
    },
    // 关闭發票弹窗时清空相关数据
    closeInvoiceModal () {
      this.invoiceInfo.show = false
      if (this.invoiceInfo.sendWay === 0) {
        this.invoiceInfo.sendWay = 0
        this.invoiceInfo.name = ''
        this.invoiceInfo.selectedOptions.splice(0, 2)
        this.invoiceInfo.realyAdress = ''
      }
    },
    // 切换發票寄送方式
    invoiceSendWayChange (code) {
      this.invoiceInfo.sendWay = code
    },
    /* 選擇接受發票地址 */
    invoiceChange (val) {
      this.invoiceInfo.selectedOptions = val
    },
    /* 獲取歷史地址 */
    async getHistoryList (phone) {
      const historyPhone = sessionStorage.getItem('historyPhone')
      const checkPhone = () => {
        orderSubApi.getOrclePhone({mobile: phone}).then((res) => {
          if (res.data.success) {
            if (res.data.body.isExist) {
              this.hasPhoneDialog = true
            }
          }
        })
      }
      // 判断手机号是否改变
      if (phone === historyPhone && this.historyList.length > 0) {
        checkPhone()
      } else {
        sessionStorage.setItem('historyPhone', phone)
        this.historyList = []
        await orderSubApi.getHistoryAddress({phone}).then((res) => {
          if (res.data.success) {
            if (res.data.body.receiveDatas.length > 0) {
              this.historyResult = res.data.body.receiveDatas
              this.historyResult.map((history, index) => {
                this.historyList.push({label: history.addressDetail, value: history.addressId})
              })
              this.formLabelAlign.historyId = ''
            }
          }
        })
        checkPhone()
      }
    },
    // 選中歷史地址，自動設置地址信息
    setAddress () {
      const orderId = this.formLabelAlign.historyId
      this.historyResult.map((history, index) => {
        if (history.addressId === orderId) {
          const data = history
          data.receiveRegion = (data.cityCode + ',' + data.areaCode).split(',')
          // 地址信息
          let formLabelAlign = {
            name: data.deliveryName,
            region: data.deliveryMobile, // 手机号码
            type: 0, // 收货方式
            selectedOptions: data.receiveRegion, // 收货地址
            realyAdress: data.address, // 详细地址
            receiveEmail: data.deliveryEmail,
            invoice: '',
            historyId: this.formLabelAlign.historyId
          }
          this.formLabelAlign = formLabelAlign
          this.$nextTick(() => {
            this.$refs['ruleForm'].validate((valid) => {})
          })
        }
      })
    },
    // 保存發票信息
    saveInvoice () {
      if (this.invoiceInfo.sendWay === 0) {
        this.formLabelAlign.invoice = '紙本發票 - 同出貨地址'
      } else {
        this.$refs['invoiceRule'].validate((valid) => {
          if (!valid) {
            this.checkInvoiceInput = true
            return false
          } else {
            this.checkInvoiceInput = false
          }
        })
        /* 有必填项未填寫时 禁止保存 */
        if (this.checkInvoiceInput) return false
        this.formLabelAlign.invoice = '紙本發票 - 另寄發票'
      }
      this.invoiceInfo.show = false
    },
    /* 選擇收货地址 */
    handleChange (val) {
      this.formLabelAlign.selectedOptions = val
    },
    goToPay () {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          this.$message({
            message: '請填寫相關信息再提交',
            type: 'warning'
          })
          this.checkInput = true
          return false
        } else {
          this.checkInput = false
        }
      })
      /* 有必填项未填寫时  精致提交 */
      if (this.checkInput) return false
      /* 購買協議 */
      if (!this.agreeMent) {
        this.agreeMentDialog = true
        return
      }
      // 按钮加载状态
      this.isPaying = true
      /** 首先提交發票信息 获取發票ID */
      const data = {}
      data.salesSlipId = this.$route.query.salesSlipId // 当前id

      // 發票信息
      data.address = this.invoiceInfo.realyAdress // 發票详细地址
      data.deliveryName = this.invoiceInfo.name // 發票收货人姓名
      if (this.invoiceInfo.selectedOptions[0] === undefined || this.invoiceInfo.selectedOptions[1] === undefined) {
        data.cityCode = '' // 發票市
        data.areaCode = '' // 發票区
      } else {
        data.cityCode = this.invoiceInfo.selectedOptions[0] // 發票市
        data.areaCode = this.invoiceInfo.selectedOptions[1] // 發票区
      }
      // 收货信息
      data.receiver = this.formLabelAlign.name // 收货人姓名
      data.phone = this.formLabelAlign.region // 收货人手机号码
      data.email = this.formLabelAlign.receiveEmail // 收货人邮箱
      data.receiveAddress = this.formLabelAlign.realyAdress // 收货详细地址
      data.receiveWay = this.formLabelAlign.type // 收货方式
      data.receiveRegion = this.formLabelAlign.selectedOptions.join(',') // 收货地区数组
      data.fare = this.yunfei // 運費
      data.fareDiscount = this.disCountMoney // 運費優惠
      data.sellingDistId = this.orderInfo.sellingDistId
      data.invoiceType = 1 // 發票类型
      this.orderInfo.orderProducts.map((product, index) => {
        product.productCount = product.count // 传给后台字段為productCount
      })
      data.products = JSON.stringify(this.orderInfo.orderProducts) // 产品信息
      data.empId = 'PC'
      data.orderAgreementTime = this.confirmTime
      orderSubApi.goToPay(data).then(res => {
        if (res.data.success === true) {
          this.orderId = res.data.body.newOrder.orderId
          /* 如果填寫了發票信息 暂存發票信息 */
          if (this.formLabelAlign.invoice && this.invoiceInfo.sendWay === 1) {
            sessionStorage.setItem('orderInfoSt.orageData', JSON.stringify({
              name: this.formLabelAlign.name, // 收货人姓名
              region: this.formLabelAlign.region, // 收货人手机号码
              receiveEmail: this.formLabelAlign.receiveEmail, // 收货人邮箱
              realyAdress: this.formLabelAlign.realyAdress, // 收货详细地址
              selectedOptions: this.formLabelAlign.selectedOptions, // 收货地区数组
              receiveWay: this.formLabelAlign.receiveWay, // 收货方式
              invoice: this.formLabelAlign.invoice, // 發票
              type: this.formLabelAlign.type,
              invoiceInfo: { // 發票详细信息
                sendWay: 1,
                name: this.invoiceInfo.name,
                selectedOptions: this.invoiceInfo.selectedOptions,
                realyAdress: this.invoiceInfo.realyAdress
              }
            }))
          }
          this.isPaying = false
          return this.$router.push({
            path: '/saleOrder' +
                  '?orderId=' +
                  this.orderId +
                  '&salesSlipId=' +
                  this.$route.query.salesSlipId
          })
        } else {
          this.isPaying = false
          this.$message({
            message: res.data.errMsg,
            type: 'error'
          })
        }
      }).catch((err) => {
        this.isPaying = false
        this.$message({
          message: '網絡錯誤',
          type: 'error'
        })
        console.log(err)
      })
    }
  },
  beforeRouteEnter: (to, from, next) => {
    if (from.path === '/saleOrder') {
      sessionStorage.setItem('fromOrder', '1')
    }
    next()
  },
  beforeMount () {
    // this.$message({
    //   showClose: true,
    //   duration: 5000,
    //   dangerouslyUseHTMLString: true,
    //   message: '如果您是如新經銷商，為保護您的權益，請前往如新購物車購物 <span> &nbsp;</span>',
    //   type: 'warning'
    // })
    /** 获取页面头部订单创建信息 在visitorSale.vue 中设置 */
    this.orderInfo = JSON.parse(localStorage.getItem('visitorSale'))
    if (sessionStorage.getItem('fromOrder') === '1') {
      if (sessionStorage.getItem('orderInfoStorageData')) {
        this.formLabelAlign.name = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).name
        this.formLabelAlign.region = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).region
        this.formLabelAlign.receiveEmail = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).receiveEmail
        this.formLabelAlign.selectedOptions = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).selectedOptions
        this.formLabelAlign.realyAdress = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).realyAdress
        this.formLabelAlign.receiveWay = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).receiveWay
        this.formLabelAlign.type = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).type
        this.formLabelAlign.invoice = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).invoice
      }
    }
    /* 如果選擇了發票信息 */
    if (this.formLabelAlign.invoice && JSON.parse(sessionStorage.getItem('orderInfoStorageData')).invoiceInfo.sendWay === 1) {
      this.invoiceInfo.sendWay = 1
      this.invoiceInfo.name = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).invoiceInfo.name
      this.invoiceInfo.selectedOptions = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).invoiceInfo.selectedOptions
      this.invoiceInfo.realyAdress = JSON.parse(sessionStorage.getItem('orderInfoStorageData')).invoiceInfo.realyAdress
    }
    this.productList = this.orderInfo.orderProducts // 游客所选产品信息
    this.disCountMoney = this.orderInfo.price >= 4000 ? 100 : 0
    this.surePay = this.orderInfo.price + this.yunfei - this.disCountMoney
    // orderSubApi.pakgeInfo({
    //   orderId: this.$route.query.id
    // }).then(res => {
    //   if (res.status === 200) {
    //     this.productList = res.data.body.productList
    //     this.disCountMoney = this.orderInfo.price >= 4000 ? 100 : 0
    //     this.surePay = this.orderInfo.price + this.yunfei - this.disCountMoney
    //   } else {
    //     this.$message({
    //       message: res.errMsg,
    //       type: 'error'
    //     })
    //   }
    // }) // 包裹信息
    orderSubApi.getProvice().then(res => {
      if (res.status === 200) {
        if (res.data.body.cityList && res.data.body.cityList.length > 0) {
          for (let provice of res.data.body.cityList) {
            for (let city of provice.children) {
              delete city.children
            }
          }
          this.options = res.data.body.cityList
        }
      } else {
        this.$message({
          message: res.errMsg,
          type: 'error'
        })
      }
    })
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/main.less';
.receatInfo {
  background: #fff;
}
.orderSubBox {
  .itemWidth400 {
    width: 400px;
  }
  .headerInfo {
    padding: 30px;
  }
  .proList {
    width: 870px;
    margin-left: 150px;
    .padL30 {
      padding: 10px 30px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      border-left: 1px solid #ddd;
      background: #ebeef5;
    }
    .product-row {
      height: 90px;
      padding: 15px;
      font-size: 12px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      border-left: 1px solid #ddd;
      overflow: hidden;
      .product-img {
        float: left;
        width: 60px;
        height: 60px;
      }
      .product-info {
        float: left;
        height: 60px;
        margin-left: 15px;
        p {
          line-height: 25px;
          color: #333;

          &:last-child {
            color: #808080;
          }
        }
      }
    }
  }
  .product-settlement-box {
    width: 870px;
    margin-left: 150px;
    margin-top: 20px;
  }
  .proInfo {
    margin: 20px 0 15px;
    padding: 10px 30px 10px 67px;
  }
  .product-tabel-head {
    width: 870px;
    height: 40px;
    margin-left: 150px;
    line-height: 40px;
    border: 1px solid #ddd;

    div {
      &:first-child {
        padding-left: 75px;
      }
    }
  }
  .memberLogo {
    img {
      margin-left: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .fotInfo {
    width:100%;
    text-align: right;
    font-size: 12px;
    .infoContainer {
      display: inline-block;
      width:250px;
      text-align: right;
    }
    p {
      line-height: 30px;
      color: #727272;
      text-align: right;

      span {
        display: inline-block;
        min-width: 82px;
        color: #333;
      }
      &:last-child {
        font-size: 15px;

        em {
          color: #f7ac32;
          font-style: normal;
        }
      }
    }
  }
  .product-sub-btn {
    margin: 20px 0 40px 290px;
    overflow: hidden;
  }
  .product-sub-agreement {
    margin-left: 150px;
    span {
      font-size: 12px;
      color: #2D2D2D;
      i {
        font-style: normal;
        color: #008AB0;
        cursor: pointer;
      }
    }
  }
  .backUp {
    padding: 10px 30px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    span {
      font-size: 20px;
      font-weight: 500;
    }
  }
}
.buyAgreement {
  .text {
    display: inline-block;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #444444;
    line-height: 22px;
    text-align: left;
    i {
      font-weight: 700;
      font-style: normal;
    }
  }
}
.invoice-main {
  text-align: left;
  .invoice-type,
  .invoice-send {
    margin-bottom: 15px;
    p {
      margin-bottom: 10px;
    }
  }
  .invoice-tag {
    padding: 0 10px;
    margin-right: 10px;
    cursor: pointer;
    &.elInfo {
      background-color: rgba(144, 147, 153, 0.1);
      color: #909399;
    }
  }
}
</style>
<style lang="less">
  .el-select-dropdown {
    .el-select-dropdown__item {
      padding: 0 20px;
    }
  }
  .textarea-address{
    .el-textarea__inner{
      font-family: 微软雅黑;
    }
  }
  .has-phone-dialog{
    width: 360px;
    border-radius: 8px;
    .el-dialog__footer{
      text-align: center;
    }
    .el-dialog__header{
      border-bottom: 1px solid #e5e5e5;
    }
  }
</style>
