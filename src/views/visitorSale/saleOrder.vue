<template>
    <div class="vistorOrder-wrapper">
      <vistor-user-head v-if="!sightInfo" :sightInfo="sightInfoData"></vistor-user-head>
      <vistor-user-head v-else :sightInfo="sightInfo"></vistor-user-head>
      <div class="sale-pay" >
        <h3>付款</h3>
      </div>
      <div class="sale-msg">
        <p class="order-number">正在為您編號<span style="font-weight:bold"> {{carNo}} </span>的訂單付款</p>
        <p>應付金額為NT$<span> {{priceNum | number-formater}} </span>，請您選擇支付方式</p>
      </div>
      <div class="sale-select">
         <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="信用卡卡號：" prop="creditCard" class="sale-form card">
              <div  class="sale-input">
                <input v-model="ruleForm.creditCard" @input="cardNumberChange" maxlength="19" :placeholder="cardPlaceholder" @focus="cardPlaceholder=''" @blur="cardPlaceholder='請輸入信用卡卡號'"/>
              </div>
            </el-form-item>
            <el-form-item label="有效期限：" prop="expireDate" class="sale-form expire">
              <el-date-picker
                :picker-options="pickerOptions"
                class="sale-input"
                v-model="ruleForm.expireDate"
                type="month"
                :editable = false
                placeholder="選擇有效期限">
              </el-date-picker>
            </el-form-item>
         </el-form>
      </div>
   <div class="sale-footer">
     <el-checkbox :checked="isChecked" @change="noClick=!noClick"  class="sale-checked">已事先取得持卡人書面同意授權文件並妥善保存</el-checkbox>
     <div class="sale-message">
       NU SKIN提醒您，切勿未經授權使用他人信用卡刷卡消費，以免損害他人權益，並避免後續相關法律責任。
       若您係受委託以他人信用卡付款，請您確認您已事先取得持卡人書面同意授權文件並妥善保存，始足以保障您自身權益，否則日後相關法律風險與責任，須由您自行承擔。
     </div>
      <el-form>
       <el-form-item>
         <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="noClick" :loading="isPaySucess"  class="sale-submit">前往付款</el-button>
         </el-form-item>
       </el-form-item>
     </el-form>
    </div>
 </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PaymentApi from '../../api/visitorSale/saleOrderApi'
import ckSightApi from '../../api/visitorSale/ckSightApi'
import vistorUserHead from '../../components/vistorUserHead'
import moment from 'moment'
export default {
  data () {
    // 卡号验证
    var checkCard = (rule, value, callback) => {
      if (!value) {
        callback(new Error('請填寫'))
      } else if (isNaN(value.replace(/\D/g, ''))) {
        callback(new Error('請输入數字值'))
      } else if (value.replace(/\D/g, '').length < 16) {
        callback(new Error('請確認卡號'))
      } else {
        callback()
      }
    }
    var expireDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('請確認/選擇有效日期'))
      } else {
        callback()
      }
    }
    return {
      cardPlaceholder: '請輸入信用卡卡號',
      saleButton: true,
      noClick: true,
      saleBtn: false,
      checkSale: false,
      isChecked: false, // 是否勾选协议
      isPaySucess: false, // 是否結算成功
      carNo: '', // 订单编号
      priceNum: '', // 订单价格
      originCount: '',
      sellingDistId: '',
      groupId: '',
      deliveryMobile: '',
      deliveryEmail: '',
      sightInfoData: { picUrl: '', name: '會員暱稱', date: '' }, // 用户信息
      ruleForm: {
        creditCard: '', // 信用卡号
        expireDate: '', // 信用卡有效期
        orderPrice: '', // 订单金额
        showKeyboard: false // 判斷鍵盤是否已彈出
      },
      rules: {
        creditCard: [{ required: true, validator: checkCard, tigger: 'blur' }],
        expireDate: [{ required: true, validator: expireDate, tigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  created () {
    this.$store.dispatch('getOrderDetails', {salesSlipId: this.$route.query.salesSlipId})
  },
  mounted () {
    this.getOrderDetail()
  },
  components: {
    vistorUserHead
  },
  methods: {
    backToPre () {
      history.back(-1)
    },
    submitForm (formName) {
      let newExpireDate = moment(this.ruleForm.expireDate).format('YYMM')
      let parame = {
        creditCard: this.ruleForm.creditCard.replace(/\D/g, ''),
        expireDate: newExpireDate,
        paymentType: 'CC',
        orderId: this.$route.query.orderId,
        salesSlipId: this.$route.query.salesSlipId,
        sellingDistId: this.sellingDistId,
        groupId: this.groupId,
        payAmount: (this.priceNum).toString(),
        mobile: this.deliveryMobile,
        orderNo: this.carNo,
        email: this.deliveryEmail,
        url: `${window.location.origin}${window.location.pathname}#/checkSight?orderId=${this.$route.query.orderId}`
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isPaySucess = true
          this.noClick = false
          PaymentApi.payment(JSON.stringify(parame)).then(res => {
            if (res.data.success === true) {
              const message = this.$message.success('付款成功')
              setTimeout(() => {
                message.close()
                this.$router.push({
                  path: '/orderSucess',
                  query: {
                    orderId: this.$route.query.orderId,
                    salesSlipId: this.$route.query.salesSlipId
                  }
                })
              }, 1500)
            } else {
              this.isPaySucess = false
              this.$message.error(res.data.errMsg)
            }
          })
        }
      })
    },
    /**
     * 獲取訂單詳情
     */
    getOrderDetail () {
      let params = {
        orderId: this.$route.query.orderId
      }
      ckSightApi
        .sightCheck(params)
        .then(res => {
          if (res.data.success) {
            if (res.data.body.order.orderMain.status === 2 || res.data.body.order.orderMain.status === 41) {
              this.$router.push({
                path: '/orderSucess',
                query: {
                  orderId: this.$route.query.orderId,
                  salesSlipId: this.$route.query.salesSlipId
                }
              })
            } else {
              this.carNo = res.data.body.order.orderMain.orderNo
              this.priceNum = res.data.body.order.orderMain.payAmount
              this.sellingDistId = res.data.body.order.orderMain.userId
              this.groupId = res.data.body.order.orderMain.groupId
              this.deliveryMobile = res.data.body.order.delivery.deliveryMobile
              this.deliveryEmail = res.data.body.order.delivery.deliveryEmail
            }
          } else {
            this.$message.error(res.data.errMsg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    cardNumberChange ($event) {
      let val = $event.target.value
      val = val.replace(/-/g, '')
        .replace(/\s/g, '')
        .replace(/[^\d-]/g, '')
      let cardNum = val
        .replace(/(\d{4})(?=\d)/g, '$1-')
      this.ruleForm.creditCard = cardNum
    }
  },
  computed: mapGetters({
    sightInfo: 'sightInfo'
  })
}
</script>
<style lang="less">
.vistorOrder-wrapper {
  background:#f1f1f1;
  .el-form-item.is-success {
    .el-input__inner {
      border-color: #008AB0;
    }
    .el-input__validateIcon {
      color: #008AB0;
    }
  }
  .tip-container {
    position: relative;
    top: -20px;
    padding:13px 0 15px;
    text-align: center;
    background: #FFF1F0;
    border: 1px solid #FFA39E;
    font-size:18px;
    a {
      color:#008AB0;
    }
  }
}
.sight-dec {
  height: 60px;
  font-size: 14px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  padding: 15px 40px;
  overflow: hidden;
  color: #fff;
  background-image: linear-gradient(45deg, #008AB0 16%, #0089AF 21%, #0089AF 21%, #007298 100%);
  .sight-pic {
    float: left;
    height: 60px;
    width: 60px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
  .sight-info {
    float: left;
    margin-left: 20px;
    div {
      margin-top: 7px;
    }
  }
}
.sale-form {
  padding: 0 0px 25px 50px;
  &.el-form-item {
    margin-bottom:0;
  }
  .el-form-item__error {
    margin-left: 30px;
  }
   &.card {
    input {
      width: 420px;
      height:32px;
      line-height:32px;
      font-size:12px;
    }
    .el-input__validateIcon {
      line-height:32px;
    }
  }
  &.expire {
    input {
      width: 240px;
      height:32px;
      line-height:32px;
      font-size:12px;
    }
    .el-date-editor.el-input {
      width: 240px;
    }
    i {
      line-height: 32px;
    }
  }
  &+.sale-form {
    margin-bottom: 0;
    input {
      padding-left:35px;
    }
  }
  .el-icon-circle-close {
    line-height:32px;
  }
}
.sale-select {
  background: #fff;
  .el-form-item__content {
    line-height: 32px;
  }
  .el-form-item__label {
    font-size:12px;
    line-height: 32px;
    padding-right:0;
  }
}
.sale-pay {
  background: #fff;
  border-bottom:1px solid #eee;
  h3 {
    display: inline-block;
    padding-left: 30px;
    font-weight: 400;
    font-size: 16px;
  }
}
.sale-msg {
  font-size: 14px;
  background:#fff;
  p {
    padding: 25px 0px 30px 50px;
    line-height: 24px;
    span {
      color: #f5a624;
    }
  }
  .order-number{
    padding-bottom: 0px;
  }
}
.sale-from {
  margin-left: 30px;
}
.sale-input {
  width: 420px;
  margin-left: 7px;
  line-height: 20px;

  input {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    border-radius: 0;
  }
  .el-form-item__error {
    margin-left: 20px;
  }
}
.sale-footer {
  padding-left: 156px;
  background: #fff;
  clear: both;
  .sale-message {
    width: 500px;
    line-height: 17px;
    color: #9c9c9c;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #727272;
  }
  .sale-submit {
    margin: 50px 0px 60px 0;
    border-radius: 3px;
  }
  .sale-checked {
    margin-bottom:9px;
  }
  .el-checkbox__label {
    color: #333;
  }

}
.saleCheck {
  padding-left: 0;
  color: #aaa;
}
.sale-btn {
  height: 60px;
  display: inline-block;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
.sale-time {
  float: left;
  margin-left: 70px;
  font-size: 16px;
  color: #606266;
  margin-top: 30px;

  .block {
    display: inline-block;
    margin-left: 25px;
  }
}
.sale-trem {
  margin-top: 20px;
  margin-right: 42px;
}
</style>
