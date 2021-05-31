<template>
  <div class='addSale'>
    <content-title title="新增分享"></content-title>
    <el-form label-width="150px" :model="addSaleInfo" :rules="rules" ref="ruleForm" size='small'>
      <el-form-item label="分享類型：" prop='faceObj' class='itemWidth400'>
        <el-radio-group v-model="addSaleInfo.faceObj">
          <el-radio label="0">多人</el-radio>
          <el-radio label="1">單人</el-radio>
        </el-radio-group>
        <p class='tipInfo self'>單人的分享僅支持單次購買；多人的分享在有效期限內可任意下單 </p>
      </el-form-item>
      <el-form-item label="有效期限：" class='itemWidth400 input-container' prop="date">
        <el-date-picker v-model="addSaleInfo.date" type="date" :editable = false :picker-options='pickerOptions1' placeholder="請選擇">
        </el-date-picker>
        <p class='tipInfo inline'>分享至截止日最多14天；分享一旦截止便會成為過期狀態，無法再下單 </p>
      </el-form-item>
      <el-form-item label="分享名稱：" class='itemWidth400 input-container' prop="giveObj">
        <el-input onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model.trim="addSaleInfo.giveObj" :placeholder="objectPlaceholder" @focus="objectPlaceholder=''" @blur="objectPlaceholder='幫這次的分享取一個專屬名稱'"></el-input>
        <p class='tipInfo inline'>最多五個漢字 </p>
      </el-form-item>
      <el-form-item label="備註：" class='itemWidth400' prop="realyAdress">
        <el-input resize="none" rows="4" type="textarea" :placeholder="memoPlaceholder" v-model='addSaleInfo.realyAdress' @focus="memoPlaceholder=''" @blur="memoPlaceholder='例：分享薈萃善秀潔顏系列搭配童顏面膜'"></el-input>
        <p class='tipInfo inline'>最多五十個漢字 </p>
      </el-form-item>
      <el-form-item label="產品：" class='itemWidth800'>
        <el-button class='linearBtn' @click="openDialog">選擇產品</el-button>
        <div class="borderTabel" v-show="tableData.length > 0">
          <el-table :data="tableData" class="product-tab">
            <el-table-column prop="date" align="center" label="產品圖片" width="180">
              <template slot-scope="scope">
                <div class="adaptive-img">
                  <img class="img" :src="scope.row.imgUrl" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="產品名稱" width="180">
              <template slot-scope="scope">
                <p class='onepHideen'>{{scope.row.cnName}}</p>
                <p class="prroduct-pv">PSV{{scope.row.pv}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="itemNo" label="產品編號">
            </el-table-column>
            <el-table-column prop="price" label="產品價格">
              <template slot-scope='scope'>
                <span>NT${{scope.row.price | number-formater}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="choosenum" label="產品數量">
            </el-table-column>
          </el-table>
        </div>
        <p class='choseInfo'>已選產品
          <span class="numcount">{{numCount}}</span> 件，總金額NT$
          <span class='numprice'> {{numPrice | number-formater}}</span>，
          <span>PSV{{totalPv}}</span>
        </p>
      </el-form-item>
      <el-form-item label=" " class="itemWidth400">
        <el-button class='block' type="primary" @click="toSubmit">確認提交</el-button>
        <el-button round class='block cancel' @click="cancelToPre">取消 </el-button>
      </el-form-item>
    </el-form>
    <set-product :defaultList="tableData" @getProduct="getProduct" :visible="dialogVisible" @closeDialog="closeDialog"></set-product>
  </div>
</template>
<script>
import addSaleApi from '../../api/saleSlip/addSaleApi'
import contentTitle from '../../components/ContentTitle'
import setProduct from '../../components/setProduct'
import moment from 'moment'

export default {
  data () {
    var validateAddress = (rule, value, callback) => {
      /* eslint no-control-regex: off */
      if (value.replace(/[^\u0000-\u00ff]/g, 'aa').length > 100) {
        // 正则表达式最多支持20英文字母或10漢字
        callback(new Error('已超出限定字數'))
      } else {
        this.addSaleInfo.realyAdress = value.replace(/(^\s*)|(\s*$)/g, '')
        callback()
      }
    }
    var validateGiveObj = (rule, value, callback) => {
      /* eslint no-control-regex: off */
      if (value.replace(/[^\u0000-\u00ff]/g, 'aa').length > 10) {
        // 正则表达式最多支持20英文字母或10漢字
        callback(new Error('已超出限定字數'))
      } else {
        // this.addSaleInfo.giveObj = value.replace(/(^\s*)|(\s*$)/g, '')
        callback()
      }
    }
    return {
      tableData: [], // 配置完成后的表格
      dialogVisible: false, // 彈窗
      numCount: 0, // 總數量
      numPrice: 0, // 總金額
      totalPv: 0,
      addSaleInfo: {
        faceObj: '',
        giveObj: '',
        date: '',
        realyAdress: ''
      },
      checkFormInput: true,
      objectPlaceholder: '幫這次的分享取一個專屬名稱',
      memoPlaceholder: '例：分享薈萃善秀潔顏系列搭配童顏面膜',
      rules: {
        faceObj: [
          {
            required: true,
            message: '請選擇分享類型',
            trigger: 'change'
          }
        ],
        date: [
          {
            type: 'date',
            required: true,
            message: '請選擇日期',
            trigger: 'change'
          }
        ],
        realyAdress: [
          { validator: validateAddress, trigger: 'blur' },
          { required: false, trigger: 'blur' }
        ],
        giveObj: [
          { validator: validateGiveObj, trigger: 'blur' },
          { required: false, trigger: 'blur' }
        ],
        configId: 0
      },
      pickerOptions1: {
        // 创建时间只能选择今天之前的
        disabledDate (time) {
          return (
            time.getTime() < Date.now() - 8.64e7 ||
            time.getTime() >
            moment()
              .add(13, 'days')
              .unix() +
            '000'
          )
        }
      }
    }
  },
  components: {
    contentTitle,
    setProduct
  },
  methods: {
    cancelToPre () {
      window.history.go(-1)
    },
    toSubmit () {
      if (!this.addSaleInfo.faceObj) {
        this.$message({
          showClose: true,
          message: '請選擇分享類型',
          type: 'error'
        })
        return false
      }
      if (!this.addSaleInfo.date) {
        this.$message({
          showClose: true,
          message: '請選擇有效期限',
          type: 'error'
        })
        return false
      }
      if (this.tableData.length <= 0) {
        this.$message({
          showClose: true,
          message: '請選擇產品',
          type: 'error'
        })
        return false
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          this.checkFormInput = true
          return false
        } else {
          this.checkFormInput = false
        }
      })
      if (this.checkFormInput) return false
      let products = []
      this.tableData.map((pro, index) => {
        products.push({
          productId: pro.id,
          productCount: pro.choosenum,
          productMoney: pro.price * pro.choosenum
        })
      })
      const pra = {
        totalPv: this.totalPv,
        recipients: this.addSaleInfo.giveObj,
        periodOfValidity: moment(this.addSaleInfo.date).format('YYYY-MM-DD HH:MM:SS'),
        remark: this.addSaleInfo.realyAdress,
        products: JSON.stringify(products),
        target: this.addSaleInfo.faceObj
      }
      /* 销售单提交 */
      addSaleApi.addSaleSlip(pra).then(res => {
        if (res.data.success === true) {
          this.$router.push({
            path: '/shareSale',
            query: {
              salesSlipId: res.data.body.newSalesSlip.id
            }
          })
        } else {
          this.$message({
            message: '系統錯誤',
            type: 'error'
          })
        }
      })
    },
    getProduct (params) {
      this.numCount = params.count
      this.numPrice = params.price
      this.totalPv = params.pv
      this.tableData = params.products
    },
    openDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/styles/main.less';
.addSale {
  padding: 0 0px 50px;
  .addSale-title {
    position: relative;
    padding: 19px 40px 19px 29px;
    border-bottom: 1px solid #eee;
    &::before {
      content: '';
      position: absolute;
      border-left: 4px solid #0089af;
      height: 16px;
      left: 15px;
      top: 19px;
    }
    p {
      display: inline-block;
      line-height: 1;
    }
    .title {
      padding-right: 40px;
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
  }
  .el-form {
    margin-top: 32px;
  }
  .tipInfo {
    font-size: 12px;
    color: #727272;
    &.inline {
      display: inline-block;
      font-size: 12px;
      color: #a7a7a7;
    }
    &.self {
      line-height: 1;
      padding-top: 8px;
    }
  }
  .numcount1 {
    font-size: 16px;
    color: rgb(0, 137, 175);
  }
  .numprice1 {
    font-size: 16px;
    color: rgb(245, 166, 35);
  }
  .linearBtn {
    background: #f7f7f7;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
  }
  .choseInfo {
    margin-bottom: 6px;
    font-size: 12px;
    color: #2d2d2d;
    span {
      font-size: 12px;
    }
  }
  .onepHideen {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .botBut {
    margin: 20px 0px 20px 10px;
    text-align: center;
    button {
      width: 80px;
    }
    .confrim-submit {
      width: 80px;
      padding: 0;
      line-height: 32px;
      height: 32px;
      color: #fff;
      font-size: 14px;
      box-sizing: border-box;
      margin-right: 25px;
      margin-top: 20px;
    }
    .cancel {
      width: 80px;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      line-height: 32px;
      height: 32px;
      padding: 0;
      margin-right: 25px;
      margin-top: 20px;
      color: #2d2d2d;
    }
  }
  .twoHide {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-align: left;
    font-size: 12px;
    color: #2d2d2d;
    line-height: 22px;
  }
  .marl5 {
    padding-left: 5px;
  }
  .itemWidth800 {
    width: 800px;
    .borderTabel {
      border: 1px solid #ddd;
      margin-top: 10px;
    }
  }
  .itemWidth400 {
    width: 600px;
    .choseInfo {
      background: #ebeef5;
      padding: 20px 10px;
      margin: 20px 0;
    }
    .block {
      width: 116px;
      padding: 0;
      text-align: center;
      line-height: 40px;
      height: 40px;
      font-size: 14px;
      box-sizing: border-box;
      margin-right: 30px;
    }
    .cancel {
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      color: #2d2d2d;
    }
  }
  .searchLeft {
    width: 570px;
    float: left;
  }
  .searchRight {
    float: left;
    width: 330px;
    border: 1px solid deepskyblue;
  }
  .product-tab {
    width: 100%;
  }
  .product-img {
    display: inline-block;
    width: 60px;
    height: 60px;
  }
  .product-pv {
    color: #808080;
  }
  .product-name-label,
  .product-type-label {
    width: 180px;
  }
  .product-tabel {
    height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
    .product-tabel-main {
      width: 100%;
    }
  }
  .product-modal-pv {
    text-align: left;
    font-size: 12px;
    color: #727272;
    span {
      display: inline-block;
      width: 100px;
      color: #808080;
    }
  }
  .product-checkedd-btn {
    color: #fff;
  }
  .prodcut-modal-page {
    margin: 30px 0 0 0;
    text-align: center;
  }
  .product-checked-box {
    background: #f9f9f9;
    padding: 0 9px 0 19px !important;
    .product-checked-main {
      height: 465px;
      overflow-y: auto;
      margin-top: 10px;
    }
    .checked-head {
      padding: 11px 0;
      border-bottom: 1px solid #e5e5e5;
      font-size: 13px;
      line-height: 1;
      color: #2d2d2d;
    }
    .product-checked-tabel {
      width: 100%;
      .product-checked-operation {
        img {
          width: 16px;
          height: 16px;
          cursor: pointer;

          &.unclick {
            cursor: not-allowed;
          }
        }
      }
    }
    .input-number {
      font-size:0;
      display: inline-block;
      height:32px;
      width:99px;
      border-radius: 5px;
      border: 1px solid #d1d1d1;
      overflow: hidden;
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
        width:34px;
        height:32px;
        font-size:14px;
        padding: 0;
        outline:none;
        text-align: center;
      }
      .not-allowed {
        cursor: not-allowed;
      }
    }
  }
}
</style>
<style lang="less">
.addSale {
  background: #fff;
  .modifyScroll::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }
  .modifyScroll::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }
  .modifyScroll::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #e0dbdb;
  }
  .el-dialog {
    width: 960px;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
  .itemWidth400 {
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
      font-family: Arial;
    }
  }
  .el-form-item.is-success .el-input__inner {
    border-color: #e5e5e5;
  }
  .el-table {
    thead {
      tr {
        th {
          padding: 5px 0;
          background: #f7f7f7;
          font-size: 12px;
          color: #333333;
        }
      }
    }
  }
  .input-container {
    .el-date-editor.el-input {
      width: 240px;
      margin-right: 10px;
    }
    .el-input__inner {
      border-radius: 0;
    }
    .el-input {
      width: 240px;
      margin-right: 10px;
    }
  }
  .textarea-container {
    .el-form-item__content {
      height: 80px;
    }
  }
  .my-dialog {
    .el-dialog__header {
      padding: 15px 30px;
      border-bottom: 1px solid #d7d7d7;
    }
    .el-dialog__body {
      padding: 20px 30px;
    }
    .el-form {
      margin-top: 0;
    }
    .el-form-item__label {
      font-size: 12px;
      color: #2d2d2d;
      height: 40px;
      line-height: 40px;
      display: inline-block;
    }
    .product-name-label {
      width: 210px;
      height: 32px;
    }
    .el-input__inner {
      width: 210px;
      height: 32px;
      line-height: 32px;
      border-radius: 0;
    }
    .search-btn {
      padding: 0;
      border-radius: 6px;
      width: 80px;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
    }
    .reset-btn {
      background: #fff;
      border-radius: 6px;
      width: 80px;
      height: 32px;
      padding: 0;
      display: inline-block;
      line-height: 32px;
      font-size: 12px;
      color: #2d2d2d;
      text-align: center;
      border: 1px solid #e5e5e5;
    }
    .el-cascader {
      width: 210px;
    }
    .el-table {
      .delete {
        font-size: 12px;
        color: #008ab0;
        border: none;
        text-align: right;
        cursor: pointer;
      }
      .cell {
        color: #2d2d2d;
        line-height: 22px;
      }
      tr {
        td:first-child {
          .cell {
            font-size: 0;
          }
        }
      }
      th {
        height: 40px;
        line-height: 40px;
        padding: 0;
        box-sizing: border-box;
      }
    }
  }

  .product-checked-main {
    .el-table__empty-block {
      background: #f9f9f9;
    }
    thead {
      display: none;
    }
    tr {
      background: #f9f9f9;
    }
    td {
      vertical-align: top;
      .delete {
        padding: 0 0 6px;
      }
      .cell {
        padding-left: 0;
        dd {
          margin-left: 68px;
        }
        .price {
          font-size: 12px;
          color: #2d2d2d;
          line-height: 22px;
        }
        .name {
          font-size: 12px;
          color: #2d2d2d;
          line-height: 18px;
          min-height: 38px;
          max-height: 38px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
.no-product-tips {
  background: #cbcccb;
  padding-left: 20px;
}
</style>
