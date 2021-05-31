<template>
  <el-dialog class="my-dialog" title="選擇產品" :close-on-click-modal='false' @close="cancelSubmit" :visible.sync="dialogVisible">
    <el-row :gutter="60">
      <el-col :span="15">
        <el-form label-width="90px">
          <el-form-item label="商品搜索：">
            <el-input @keyup.enter.native="searchForm" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" v-model.trim="serchInfo.name" class="product-name-label"></el-input>
            <el-button @click="searchForm" type="primary" class='search-btn ml15'> 搜索 </el-button>
            <el-button @click="resetForm" class="reset-btn"> 清除 </el-button>
          </el-form-item>
          <el-form-item label="類目篩選：" class="mt15 mb15">
            <el-cascader class="product-type-label" :options="options" v-model="serchInfo.selectedOptions" @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-form>
        <div class="product-tabel modifyScroll">
          <el-table class="product-tabel-main" :data="productList" empty-text="未檢索到產品信息">
            <el-table-column label="選擇" align="center">
              <template slot-scope="scope">
                <el-button size='mini' disabled v-if='scope.row.inventory <= 0'>已售罄</el-button>
                <el-checkbox v-else class="chackboxs" :ref="'checkbox'+scope.row.id"  v-model="scope.row.isSelected" @change="chooseRow(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="產品圖片" align="center">
              <template slot-scope="scope">
                <div class="img-container">
                  <img class="product-img" :src='scope.row.imgUrl' alt="">
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="產品名稱" align="center" width="180">
              <template slot-scope='scope'>
                <dl>
                  <dt class="fl">
                    <!-- <img class="product-img" :src='scope.row.imgUrl' alt=""> -->
                  </dt>
                  <dd>
                    <p class='twoHide marl5'>{{scope.row.cnName}}</p>
                    <p class='marl5 product-modal-pv'>
                      <span>PSV{{scope.row.pv}}</span>
                    </p>
                  </dd>
                </dl>
              </template>
            </el-table-column>
            <el-table-column prop="itemNo" align="center" label="產品編號">
            </el-table-column>
            <el-table-column width="100" prop="price" align="center" label="產品價格">
              <template slot-scope='scope'>
                <span>NT${{scope.row.price | number-formater}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                    <el-button round size='mini' disabled v-if='scope.row.inventory < 1'>已售罄</el-button>
                    <el-button v-else-if="scope.row.chooseState" class='linearBtn' @click="chooseRow(scope.row)" type='primary' round size='mini'>
                      選擇
                    </el-button>
                    <el-button v-else type='info' class="product-checkedd-btn" round disabled size='mini'>已選擇</el-button>
                  </template>
            </el-table-column> -->
          </el-table>
        </div>
        <el-pagination class="prodcut-modal-page" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total=proTotal>
        </el-pagination>
      </el-col>
      <el-col :span="8" class="product-checked-box">
        <p class="checked-head">已選擇
          <span class="numcount1">{{numCount}} </span>件商品
          <span>總金額NT$
            <span class="numprice1">{{numPrice | number-formater}} </span>
          </span>
          <span>PSV{{totalPv | number-formater}}</span>
        </p>
        <div class="product-checked-main modifyScroll">
          <el-table :data="selectedProductList" class="product-checked-tabel">
            <el-table-column prop="date" label="產品" width="180">
              <template slot-scope='scope'>
                <dl>
                  <dt class="fl">
                    <div class="adaptive-img">
                      <img class="img" :src='scope.row.imgUrl' alt="">
                    </div>
                  </dt>
                  <dd>
                    <p class="name">{{scope.row.cnName}}</p>
                    <p class="price">NT${{scope.row.price | number-formater}}</p>
                  </dd>
                </dl>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <p class='delete' @click='deleteChoose(scope.row)'>刪除</p>
                <div class="product-checked-operation">
                  <div class="input-number">
                    <span @click='reduceNum(scope)' v-if='scope.row.choosenum > 1'>-</span>
                    <span class="not-allowed" v-else>-</span>
                    <input onpaste="return false" onkeyup="this.value=this.value.replace(/\D/g,'')" type="text" v-model="scope.row.choosenum" @input="changeScopeNum(scope, $event)" />
                    <span @click='addNum(scope)' v-if='scope.row.choosenum < scope.row.inventory'>+</span>
                    <span class="not-allowed1" v-else>+</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <div class="botBut">
        <el-button @click='sureSubmit' class='confirm-submit' type="primary" size='mini'>完成</el-button>
        <el-button @click='cancelSubmit' class="cancel" type="default" size='mini'>取消</el-button>
      </div>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="innerVisible"
      width="30%"   append-to-body>
      <span>確定刪除此商品嗎？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="() => { innerVisible = false }">取 消</el-button>
        <el-button type="primary" @click="confirmDeleteHandle">確 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
import addSaleApi from '../api/saleSlip/addSaleApi'
import imgHttp from '../common/imghttp'
export default {
  props: {
    visible: Boolean,
    defaultList: Array
  },
  data () {
    return {
      selectedProductList: [], // 選中的產品
      productList: [],
      proTotal: 0,
      dialogVisible: false,
      innerVisible: false,
      tempChoose: '', // 臨時商品
      params: {pageNum: 0}, // 參數
      currentPage: 1,
      options: [], // 類目
      firstCategory: '',
      secondCategory: '',
      serchInfo: {
        name: '',
        type: '',
        selectedOptions: []
      }, // 搜索參數
      tableData: [], // 配置完成的表格
      numCount: 0, // 總數量
      numPrice: 0, // 總金額
      totalPv: 0,
      tipState: 1
    }
  },
  watch: {
    visible (val, oldVal) {
      if (val) {
        this.dialogVisible = val
        if (this.defaultList && this.defaultList.length > 0) {
          this.selectedProductList = this.defaultList.map((item, idx) => {
            return Object.assign({}, item)
          })
          this.comptedNumCountPrice()
        }
        this.getData()
        if (this.tipState) {
          setTimeout(() => {
            this.tipState = 0
            this.$message({
              message: '溫馨提醒「我的分享」將暫不支援現行促銷活動。會員促銷請至官網購物車下單',
              type: 'warning',
              duration: 5000,
              customClass: 'first-config-tip'
            })
          }, 100)
        }
      }
    }
  },
  methods: {
    changeScopeNum (scope, e) {
      // this.$nextTick(() => {
      let val = e.target.value
      // 如果優質 轉換爲數字
      val = val.replace(/^0/, '').replace(/\s/, '').replace(/\D/g, '')
      if (scope.row.choosenum) {
        scope.row.choosenum = val || 1
      } else {
        // 如果爲空直接賦值爲默認值1
        scope.row.choosenum = 1
      }
      if (parseInt(scope.row.choosenum) > 99) {
        scope.row.inventory = 99
      }
      if (parseInt(scope.row.choosenum) > scope.row.inventory) {
        scope.row.choosenum = scope.row.inventory
      }
      this.selectedProductList.map((pre, index) => {
        if (pre.id === scope.row.id) {
          pre = scope.row
        }
        this.$set(this.selectedProductList, index, pre)
      })
      this.comptedNumCountPrice()
      // })
    },
    sureSubmit () {
      this.dialogVisible = false
      let Num = 0
      let Price = 0
      let pv = 0
      for (let i = 0; i < this.selectedProductList.length; i++) {
        Num += this.selectedProductList[i].choosenum - 0
        Price +=
          this.selectedProductList[i].choosenum * this.selectedProductList[i].price - 0
        pv += this.selectedProductList[i].choosenum * this.selectedProductList[i].pv - 0
      }

      // 向父組件傳遞數據
      const info = {
        count: Num,
        price: Price,
        pv: Number(pv.toFixed(2)),
        products: [...this.selectedProductList]
      }
      this.$emit('getProduct', info)
    },
    cancelSubmit () {
      this.dialogVisible = false
      this.$emit('closeDialog', true)
    },
    addNum (scope) {
      scope.row.choosenum = scope.row.choosenum - 0 + 1
      if (scope.row.inventory > 99) {
        scope.row.inventory = 99
      }
      if (scope.row.choosenum > scope.row.inventory) {
        scope.row.choosenum = scope.row.inventory
      }
      this.selectedProductList.map((pre, index) => {
        if (pre.id === scope.row.id) {
          pre = scope.row
          this.$set(this.selectedProductList, index, pre)
        }
      })
      this.comptedNumCountPrice()
    },
    reduceNum (scope) {
      scope.row.choosenum = scope.row.choosenum - 1
      this.selectedProductList.map((pre, index) => {
        if (pre.id === scope.row.id) {
          pre = scope.row
        }
        this.$set(this.selectedProductList, index, pre)
      })
      this.comptedNumCountPrice()
    },
    comptedNumCountPrice () {
      let Num = 0
      let Price = 0
      let pv = 0
      for (let i = 0; i < this.selectedProductList.length; i++) {
        Num += this.selectedProductList[i].choosenum - 0
        Price +=
          this.selectedProductList[i].choosenum * this.selectedProductList[i].price - 0
        pv += this.selectedProductList[i].choosenum * this.selectedProductList[i].pv - 0
      }
      this.numCount = Num
      this.numPrice = Price
      this.totalPv = Number(pv.toFixed(2))
    },
    deleteChoose (row) {
      this.innerVisible = true
      this.tempChoose = row
    },
    confirmDeleteHandle () {
      let row = this.tempChoose
      let selectedProductList = this.selectedProductList
      this.selectedProductList = selectedProductList.filter((item, i) => {
        return row.id !== item.id
      })
      this.productList.forEach(item => {
        if (item.id === row.id) {
          item.isSelected = false
        }
      })
      this.innerVisible = false
      this.comptedNumCountPrice()
    },
    chooseRow (row) {
      if (row.isSelected) {
        // 選中
        const boo = this.selectedProductList.some((item, i) => {
          return row.id === item.id
        })
        if (!boo) {
          this.selectedProductList.push(row)
        }
        this.comptedNumCountPrice()
      } else {
        // 取消選中
        this.tempChoose = row
        this.confirmDeleteHandle()
      }
    },
    resetForm () {
      this.serchInfo.name = ''
      this.serchInfo.selectedOptions = []
      this.firstCategory = ''
      this.secondCategory = ''
      this.params = {}
      this.currentPage = 1
      this.getData()
      this.comptedNumCountPrice()
    },
    searchForm () {
      let queryKey = this.serchInfo.name
      let params
      let num = this.serchInfo.selectedOptions && this.serchInfo.selectedOptions[0]
      if (Number(num) === 99999999) {
        this.serchInfo.selectedOptions = []
        params = {
          queryKey: queryKey,
          firstCategory: '',
          secondCategory: '',
          pageNum: 1
        }
      } else {
        params = {
          queryKey: queryKey,
          firstCategory: this.firstCategory,
          secondCategory: this.secondCategory,
          pageNum: 1
        }
      }
      this.productList = []
      this.getProductListData(params,
        () => {
          this.currentPage = 1
        })
    },
    clearForm () {
      this.serchInfo.name = ''
      this.serchInfo.selectedOptions = ''
    },
    handleCurrentChange (currentPage) {
      if (currentPage === this.params.pageNum) {
        return
      }
      this.currentPage = currentPage
      let params = this.params
      params.pageNum = this.currentPage

      this.productList = []
      this.getProductListData(params)
    },
    getData () {
      this.dialogVisible = true
      let params
      // 是否已經打開過了
      if (this.params.pageNum) {
        params = this.params
      } else {
        params = {
          pageNum: 1
        }
      }
      this.productList = []
      this.getProductListData(params)
      this.getCatgory()
    },
    handleChange (val) {
      this.firstCategory = val[0]
      this.secondCategory = val[1]
      let params = {
        pageNum: 1,
        firstCategory: val[0],
        secondCategory: val[1]
      }
      this.productList = []
      this.getProductListData(params,
        () => {
          this.currentPage = 1
        })
    },
    getCatgory () {
      addSaleApi.getProductCatgory().then(res => {
        this.options = res.data.body.categoryList.map(function (option1, index1) {
          option1.children.map(function (option2, index2) {
            delete option2.children
          })
          return option1
        })
      })
    },
    getProductListData (params, fn) {
      addSaleApi
        .getProductList(params)
        .then(res => {
          let result = res.data.body.productPage
          // 判斷是否有數據
          if (result.list && result.list.length > 0) {
            this.productList = result.list.map((item, idx) => {
              item.isSelected = false
              return item
            })

            this.productList.map((item, i) => {
              this.productList[i].choosenum = 1
              this.productList[i].imgUrl = imgHttp + this.productList[i].imgUrl
              // 判斷是否選中
              for (let n = 0; n < this.selectedProductList.length; n++) {
                if (this.productList[i].id === this.selectedProductList[n].id) {
                  this.productList[i].isSelected = true
                }
              }
            })
            this.proTotal = result.total
            this.params = params
            if (fn) {
              fn()
            }
          }
        })
    }
  }
}
</script>
<style lang="less" scoped>
  input[type=number] {
      -moz-appearance:textfield;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
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
  .img-container {
    font-size: 0;
    display: inline-block;
    min-width: 60px;
    max-width:60px;
    height: 60px;
    line-height: 60px;
    // margin-left: 15px;
    margin-bottom: 10px;
    text-align: center;
    background: url("../assets/img/img-loading.gif") no-repeat 100% 100%;
    background-size: cover;
    background-position: -9px 0;
  }
  .product-img {
    display: inline-block;
    width: auto;
    height: auto;
    max-width:99%;
    max-height:99%;
    background: white;
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
        &:first-child::after {
          content: '';
          border-bottom: 1px solid #aaa;
        }
      }
      .not-allowed1 {
        color:#aaa;
        cursor: not-allowed;
      }
    }
  }

</style>
<style lang="less">
  .first-config-tip {
    .el-message__icon {
      margin: 0;
      margin-right: 10px;
    }
  }
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
  .my-dialog{
    .el-dialog {
      width: 960px;
    }
    .chackboxs{
      .el-checkbox__inner{
        border:1px solid #8c93a4;
      }
    }
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
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
  .el-cascader-menus{
    .el-cascader-menu{
      min-width: 215px;
    }
    .el-cascader-menu__item--extensible:after{
      right: 5px;
    }
  }

.no-product-tips {
  background: #cbcccb;
  padding-left: 20px;
}
</style>
