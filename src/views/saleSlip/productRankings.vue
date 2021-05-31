<template>
  <div class="product-sort-wrapper">
    <!-- <div class="product-sort_title">產品銷售排行（top10）</div> -->
    <content-title title="產品銷售排行（TOP10）"></content-title>
    <div class="product-sort_content" v-if="topData">
      <div class="product-sort_left">
        <table class="product-sort_table" collapse='0'>
          <thead class="thead">
            <tr class="thead-title">
              <th colspan="4">本月</th>
            </tr>
            <tr class="thead-cate">
              <th class="index"></th>
              <th class="product">產品</th>
              <th class="num">產品編號</th>
              <th class="sales">銷售量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in currentData" :key="i">
              <td class="index">
                <img :src="imgRanking[i]" />
              </td>
              <td class="product">
                <div class="product_img">
                  <img :src="item.productUrl" />
                </div>
                <div class="product_name">{{item.productName | text-limit(28)}}</div>
                <div class="product_type">NT$ {{item.productPrice}}</div>
              </td>
              <td class="num">
                {{item.productCode}}
              </td>
              <td class="sale">
                {{item.productCount}}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="no-data-wrap" v-if="currentNoData" :style="{'height':currentLen+'px'}" >
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sale-out"></use>
          </svg>
          <p>本月尚未產生訂單</p>
          <p>無產品銷售排行數據</p>
        </div>
      </div>
      <div class="product-sort_right">
        <table class="product-sort_table" collapse='0'>
          <thead class="thead">
            <tr class="thead-title">
              <th colspan="4">上月</th>
            </tr>
            <tr class="thead-cate">
              <th class="index"></th>
              <th class="product">產品</th>
              <th class="num">產品編號</th>
              <th class="sales">銷售量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in lastData" :key="i">
              <td class="index">
                <img :src="imgRanking[i]" />
              </td>
              <td class="product">
                <div class="product_img">
                  <img :src="item.productUrl" />
                </div>
                <div class="product_name">{{item.productName | text-limit(28)}}</div>
                <div class="product_type">NT$ {{item.productPrice}}</div>
              </td>
              <td class="num">
                {{item.productCode}}
              </td>
              <td class="sale">
                {{item.productCount}}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="no-data-wrap" v-if="lastNoData" :style="{'height':lastLen+'px'}">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sale-out"></use>
          </svg>
          <p>本月尚未產生訂單</p>
          <p>無產品銷售排行數據</p>
        </div>
      </div>
    </div>
    <div class="no-all-data" v-if="noAllData">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-sale-out"></use>
      </svg>
      <p>尚未產生訂單</p>
      <p>無產品銷售排行數據</p>
    </div>
  </div>
</template>
<script>
import contentTitle from '../../components/ContentTitle'
import getProductRankings from '../../api/saleSlip/productRankings'
import imghttp from '../../common/imghttp'
// import moment from 'moment'
export default {
  data () {
    return {
      imgRanking: [
        require('../../assets/img/productRankings/top1.png'),
        require('../../assets/img/productRankings/top2.png'),
        require('../../assets/img/productRankings/top3.png'),
        require('../../assets/img/productRankings/top4.png'),
        require('../../assets/img/productRankings/top5.png'),
        require('../../assets/img/productRankings/top6.png'),
        require('../../assets/img/productRankings/top7.png'),
        require('../../assets/img/productRankings/top8.png'),
        require('../../assets/img/productRankings/top9.png'),
        require('../../assets/img/productRankings/top10.png')
      ],
      currentLen: 0,
      lastLen: 0,
      currentData: [],
      currentNoData: false,
      lastData: [],
      lastNoData: false,
      prevData: [],
      topData: false,
      noAllData: false
    }
  },
  components: {
    contentTitle
  },
  async mounted () {
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    let curStatus = false
    let lastStatus = false
    await getProductRankings({date: year + '-' + month}).then(res => {
      if (res.data.success === true) {
        res.data.body.result.map((pre, index) => {
          pre.productUrl = imghttp + pre.productUrl
        })
        this.currentData = res.data.body.result
        if (!this.currentData || this.currentData.length <= 0) {
          curStatus = true
        }
      }
    })
    await getProductRankings({date: year + '-' + new Date().getMonth()}).then(res => {
      if (res.data.success === true) {
        res.data.body.result.map((pre, index) => {
          pre.productUrl = imghttp + pre.productUrl
        })
        this.lastData = res.data.body.result
        if (!this.lastData || this.lastData.length <= 0) {
          lastStatus = true
        }
      }
    })
    if (curStatus === false || lastStatus === false) { // 本月或上月只要其中一个有数据即显示排行榜
      this.noAllData = false
      this.topData = true
      this.currentNoData = curStatus
      this.lastNoData = lastStatus
      if (!curStatus && !lastStatus) {
      } else {
        if (curStatus) {
          this.currentLen = 760
        }
        if (lastStatus) {
          this.lastLen = 760
        }
      }
    } else if (curStatus === true && lastStatus === true) {
      this.noAllData = true
      this.topData = false
      this.currentNoData = false
      this.lastNoData = false
    }
  }
}
</script>
<style lang="less" scoped>
  @import "../../assets/styles/main.less";
  .product-sort-wrapper {
    background-color: #fff;
    padding: 0 0 20px;
    min-height: 600px;
    .product-sort_title {
      padding: 9px 0 29px;
      font-size: 20px;
      color: #2D2D2D;
      letter-spacing: -0.37px;
      text-align: center;
      font-weight: 700;
    }
    .product-sort_content {
      margin-top: 10px;
      padding:10px 20px 0;
      .clearfix;
    }
    .product-sort_left {
      float: left;
      width: 48.6%;
    }
    .product-sort_right {
      float: right;
      width: 48.6%;
    }
    .no-data-wrap,.no-all-data{
      margin-top: 80px;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #727272;
      svg{
        width: 80px;
        height: 80px;
      }
      p{
        margin-top: 5px;
      }
    }
    .no-data-wrap {
      padding-top: 80px;
      margin-top: 0;
      border: 1px solid #ddd;
      border-top-color: transparent;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #727272;
      svg{
        width: 80px;
        height: 80px;
      }
      p{
        margin-top: 5px;
      }
    }
    .no-all-data{
      margin-top: 100px;
    }
    .product-sort_table {
      border-collapse:collapse;
      width: 100%;
      thead {
        border: 1px solid #ddd;
      }
      .thead-title {
        th {
          padding: 16px 0;
          font-size: 20px;
          color: #2D2D2D;
          letter-spacing: -0.37px;
          text-align: center;
        }
      }
      .thead-cate {
        th {
          font-size: 12px;
          color: #2D2D2D;
          text-align: center;
          padding: 13px 0 10px;
          background-color: #f1f1f1;
          &.index {
            width: 70px;
          }
          &.product {
            text-align: left;
          }
          &.num {
            width: 100px;
            text-align: center;
          }
          &.sales {
            width: 70px;
            text-align: center;
          }
        }
      }
      tbody {
        tr {
          border: 1px solid #ddd;
          border-bottom: 0;
          &:last-child {
            border-bottom: 1px solid #ddd;
          }
        }
        td {
          font-size: 12px;
          color: #2D2D2D;
          text-align: center;
          padding: 13px 0 10px;
          &.index {
            img {
              width: 28px;
              height: 28px;
              padding-right: 10px;
            }
          }
          &.product {
            text-align: left;
            .product_img {
              float: left;
              text-align: center;
              margin-right: 10px;
              background-image: url(../../assets/img/img-loading.gif);
              background-position: -9px 0;
              background-size:cover;
              width: 60px;
              height: 60px;
              line-height: 60px;
              vertical-align: middle;
              box-sizing: border-box;
              img {
                max-width: 60px;
                max-height: 60px;
                width: auto;
              }
            }
            .product_type {
              font-size: 12px;
              color: #727272;
              margin-top: 10px;
            }
          }
          &.num {
            width: 100px;
            text-align: center;
          }
          &.sales {
            width: 70px;
            text-align: center;
          }
        }
      }
    }
    .product-sort_img {
      width: 60px;
      height: 60px;
      float: left;
    }
    .product-sort_desc {
      margin-left: 68px;
      .desc-type {
        font-family: '微軟雅黑';
      }
    }
  }
</style>
