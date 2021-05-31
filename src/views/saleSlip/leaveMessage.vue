<template>
  <div class="leaveMessage-wrapper">
    <content-title title="查看留言"></content-title>
    <div class="item-wrapper" v-for="(item, i) in msgs" :key="i">
      <div class="title">
        <p class="title-left fl">
          <span class="name">{{item.name}}</span>
          <span class="phone">{{item.phone}}</span>
        </p>
        <p class="title-right fr">
          <!-- <span class="name">删除留言</span> -->
        </p>
      </div>
      <div class="desc">
        {{item.message}}
      </div>
      <div class="date">
        <el-row>
          <el-col :span="2">
            <el-button size="small" class="to-share" @click="toShare(item.salesSlipId)">查看分享</el-button>
          </el-col>
          <el-col :span="19" class="top10">
            分享編號：{{item.salesSlipNo}}
          </el-col>
          <el-col :span="3" class="top10">
            <span>{{item.createTime}}</span>
            <span>{{item.date}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="list-page">
      <el-pagination
        v-if= 'pageShowOrHide'
        @size-change="handleSizeChange"
        @current-change="sizeChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="proTotal">
      </el-pagination>
    </div>
    <div class="no-data" v-show="noData">
      <div class="no-data_content">
        <i class="iconfont icon-no-data"></i>
        <p class="no-data_text">暫無留言信息</p>
        <div class="no-data_btn">
         <span class="return" @click="$router.go(-1)">返回分享首頁</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import contentTitle from '../../components/ContentTitle'
import leaveMessageApi from '../../api/saleSlip/leaveMessageApi'
import moment from 'moment'
export default {
  name: '',
  data () {
    return {
      msgs: [],
      pageShowOrHide: false,
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      proTotal: '',
      noData: false
    }
  },
  components: {
    contentTitle
  },
  methods: {
    toShare (id) {
      this.$router.push({path: '/checkSale', query: {salesSlipId: id}})
    },
    getMessage (pageNum, pageSize) {
      let params = {
        pageNum: pageNum,
        pageSize: pageSize
      }
      leaveMessageApi(params).then(res => {
        if (res.data.success) {
          let list = res.data.body.comment.list
          this.msgs = list.map((item, i) => {
            item.createTime = moment(moment(item.createTime).format()).format('HH:mm:ss  MM-DD-YYYY')
            return item
          })
          if (this.msgs.length > 0) {
            this.pageShowOrHide = true
            this.noData = false
          } else {
            this.pageShowOrHide = false
            this.noData = true
          }
          this.proTotal = res.data.body.comment.total
        }
      }).catch(err => {
        this.$message({
          message: '網絡錯誤'
        })
        console.log(err)
      })
    },
    /** 更改每页條數 */
    handleSizeChange (val) {
      this.pageSize = val
      this.getMessage(1, this.pageSize)
    },
    /** 每页 */
    sizeChange (currentPage) {
      this.pageNum = currentPage
      this.getMessage(this.pageNum, this.pageSize)
    }
  },
  beforeMount () {
    this.getMessage(this.pageNum, this.pageSize)
  },
  mounted () {}
}
</script>
<style lang="less" scoped>
  @import "../../assets/styles/main.less";
  .leaveMessage-wrapper {
    background: #fff;
    padding-bottom: 30px;
    .item-wrapper {
      background: #fff;
      padding: 20px;
      margin-bottom: 15px;
      border-bottom: 1px solid #E5E5E5;
    }
    .title {
      .clearfix;
    }
    .title-left {
      padding-bottom: 10px;
      font-size: 18px;
      color: #2D2D2D;
      .phone {
        padding-left:15px;
      }
    }
    .title-right {
      font-size: 12px;
      color: #727272;
      .name {
        margin-top: 6px;
        display: inline-block;
      }
    }
    .commenter {
      padding-bottom: 10px;
      font-size: 14px;
      color: #727272;
    }
    .desc {
      padding-bottom: 10px;
      font-size: 12px;
      color: #444444;
    }
    .date {
      font-size: 12px;
      color: #727272;
      span+span {
        padding-left: 14px;
      }
    }
    .top10{
      margin-top: 10px;
    }
    .to-share{
      color: #008AB0;
      background: #FFFFFF;
      border: 1px solid #008AB0;
      border-radius: 3px;
    }
    .list-page{
      text-align: center;
      padding-top: 20px;
    }
    .no-data{
      text-align: center;
      background: #fff;
      min-height: 80vh;
      margin-top: -20px;
      .no-data_content {
        padding-top: 140px;
        text-align: center;
      }
      .icon-no-data {
        width: 130px;
      }
      .no-data_text {
        margin: 15px 0;
        font-size: 15px;
        color: #2D2D2D;
      }
      .return {
        display: inline-block;
        width: 140px;
        height: 32px;
        font-size: 14px;
        line-height: 32px;
        color: #fff;
        background: #008AB0;
        border-radius: 3px;
        cursor: pointer;
      }
    }
  }
</style>
<style lang="less">
  .leaveMessage-wrapper{
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
