<template>
  <div class="order-wrap">
    <div>
      <el-row class="order-top">
        <el-col :span="4" class="user-wrap">
          <div v-if="imageUrl===''|| imageUrl===null" class="user-photo"><img src="../../assets/img/default.png" alt="" @click="editInfo"></div>
          <div v-else class="user-photo"><img :src="imageUrl" alt="個人頭像" @click="editInfo"></div>
          <!--<div class="user-photo"><img src="../../assets/img/default.png" alt="" @click="editInfo"></div>-->
          <div class="user-message">
            <router-link to="/leaveMessage">查看留言</router-link>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="user-name">
            <span class="user-name_text">{{userName}}</span>
            <span class="user-name_edit" @click="editInfo">修改信息<i class="el-icon-arrow-right"></i></span>
          </div>
          <div class="self-intro">{{selfIntroduction}}</div>
          <div class="btn-wrap">
            <el-button  size="medium" @click="addSale"><i class="el-icon-plus"></i> 新增分享</el-button>
            <el-button size="medium" @click="productRankings">產品銷量排行(TOP10)</el-button>
          </div>
        </el-col>
        <el-col :span="11">
          <el-row class="list-info-wrap">
            <el-col :span="8">
              <p>創建</p>
              <p>{{createNum}}</p>
            </el-col>
            <el-col :span="8">
              <p>分享</p>
              <p>{{shareNum}}</p>
            </el-col>
            <el-col :span="8">
              <p>瀏覽量(本月)</p>
              <p>{{browse}}</p>
            </el-col>
          </el-row>
          <el-row class="list-info-wrap">
            <el-col :span="8">
              <p>成功下單(本月)</p>
              <p>{{transNum}}</p>
            </el-col>
            <el-col :span="8">
              <p>訂單未付款(本月)</p>
              <p>{{orderFail}}</p>
            </el-col>
            <el-col :span="8">
              <p>銷售總額NT$(本月)</p>
              <p>{{totalSale | number-formater}}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="latest-sale-wrap">
      <content-title class="content-title" :isReturn="false" title="最近分享" :rightBtnText="true">
        <el-button plain type="primary" size="small" @click="allSale">查看全部分享</el-button>
      </content-title>
      <!-- <div class="latest-title"><span>最近分享</span></div> -->
      <div class="latest-sale" v-for="items in finalLatestSale" :key="items.id">
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
          <el-table  :data="items.tableData" :show-header=false width="100%" border :class-name="items.tableClass">
            <el-table-column width="827">
              <template slot-scope="scope">
                <div class="products-info" :class="scope.row.heightClass">
                  <el-row :gutter="30">
                    <el-col :span="20" class="pic-col">
                      <div class="adaptive-img margin" v-if="scope.row.productLength > 0" v-for="(item, i) in scope.row.imgStatus" :key="i">
                        <img class="img" v-if="!item.proImg || item.proImg === ''" src='../../assets/img/productDefault.png'>
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
                      <p @click="limitedPicNum(scope)" class="limitedPicNum gery-font">收起<i class="el-icon-arrow-up"></i></p>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="151" align="center">
              <template slot-scope="scope">
                <p class="pointer-cursor" @click="toDetail(scope)" >查看詳情</p>
                <p class="pointer-cursor" @click="release(scope)">再次分享</p>
              </template>
            </el-table-column>
            <el-table-column width="190">
              <template slot-scope="scope">
                <el-row class="share-row">
                  <el-col :span="24" class="last-row">
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
            <el-col :span="5">分享名稱：{{items.recipients}}</el-col>
            <el-col :span="19">備註：{{items.remark}}</el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog title="會員資料更改" :visible.sync="editDialogVisible" :custom-class="editDialog" :show-close=false @close="clearValidate">
      <div class="dialog-wrap">
        <div class="close-dialog" @click="clearValidate">×</div>
        <el-row class="photo-row">
          <el-col :span="8" v-if="imageUrl===''"><div class="edit-img-wrap"><img src="../../assets/img/default.png" class="avatar"></div></el-col>
          <el-col :span="8" v-else><div class="edit-img-wrap"><img :src="imageEdit" class="avatar"></div></el-col>
          <el-col :span="16">
            <up-load-img @stopSave="disabledSaveBtn" :maxSize="5" @avatarImg="setAvatar"></up-load-img>
          </el-col>
        </el-row>
        <div class="edit-name-title">顯示暱稱</div>
        <el-form :model="editForm" :inline=true :rules="rules" ref="editForm" class="user-edit-form">
          <el-form-item prop="nickName">
            <el-input v-model.trim="editForm.nickName" auto-complete="off" :placeholder="namePlaceholder" @focus="namePlaceholder=''"></el-input>
          </el-form-item>
          <div class="edit-tip">顯示在分享上的昵稱，最多12個英文字母或6個漢字</div>
          <div class="selfIntro">自我介紹：</div>
          <el-form-item prop="introduce">
            <el-input :rows="4" resize="none" type="textarea" v-model.trim="editForm.introduce" auto-complete="off" :placeholder="selfIntroPlaceholder" @focus="selfIntroPlaceholder=''"></el-input>
          </el-form-item>
        </el-form>
        <div class="save-edit-wrap"><el-button :disabled="isDisabled" type="primary" class="saveEdit" @click="saveEdit('editForm')">保存</el-button></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderApi from '../../api/saleSlip/orderApi'
import upLoadImg from '../../components/change'
import loginApi from '../../api/loginApi'
import contentTitle from '../../components/ContentTitle'
import { mapState, mapMutations } from 'vuex'
import imgHttp from '../../common/imghttp'

export default {
  name: 'order',
  data () {
    var validateName = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback(new Error('請輸入暱稱'))
      } else {
        /* eslint no-control-regex: off */
        if (value.replace(/[^\u0000-\u00ff]/g, 'aa').length > 12) {
          callback(new Error('已超過限定字數'))
        } else {
          callback()
        }
      }
    }
    var validateSelfIntro = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback()
      } else {
        /* eslint no-control-regex: off */
        if (value.replace(/[^\u0000-\u00ff]/g, 'aa').length > 100) {
          callback(new Error('已超過限定字數，最多五十個漢字或一百個英文字符'))
        } else {
          callback()
        }
      }
    }
    return {
      createNum: 0,
      shareNum: 0,
      transNum: 0,
      totalSale: 0,
      orderFail: 0,
      browse: 0,
      editDialogVisible: false,
      editDialog: 'user-edit-dialog',
      isDisabled: false,
      imageUrl: '',
      noAvatar: false, // 后台是否已经上传头像了
      namePlaceholder: '請輸入新暱稱',
      selfIntroPlaceholder: '請填寫',
      /* 标记用户头像是否被更改 */
      imageUrlChange: false,
      /* 修改用户头像时url */
      imageEdit: '',
      uploadApiUrl: '',
      copyUrl: '',
      token: { auth: '' },
      userName: '',
      selfIntroduction: '',
      // tableClass: 'table-wrap',
      editForm: {
        nickName: '',
        introduce: ''
      },
      rules: {
        nickName: [{ validator: validateName, trigger: 'blur' }],
        introduce: [{ validator: validateSelfIntro, trigger: 'blur' }]
      },
      finalLatestSale: []
    }
  },
  components: {
    upLoadImg,
    contentTitle
  },
  computed: {
    ...mapState({
      user: 'user'
    })
  },
  mounted () {
    this.copyUrl = window.location.origin + window.location.pathname + '#/visitorSale?salesSlipId='
    this.getInfo()
  },
  methods: {
    ...mapMutations(['USER']),
    disabledSaveBtn (boo) {
      this.isDisabled = boo
    },
    setAvatar (img) {
      if (img === 'error') {
        this.$message('上傳出錯！')
        return
      }
      this.imageEdit = img
      this.imageUrlChange = true
    },
    getInfo () {
      orderApi.latestSaleList().then(res => {
        if (
          res.data.body.headImgUrl === '' ||
          res.data.body.headImgUrl === null
        ) {
          /** 没有头像时，显示默认头像 */
          this.imageUrl = require('../../assets/img/default.png')
          this.noAvatar = true
        } else {
          this.imageUrl = res.data.body.headImgUrl
        }
        this.userName = res.data.body.nickName
        this.editForm.introduce = res.data.body.selfIntroduction ? res.data.body.selfIntroduction : ''
        this.selfIntroduction = res.data.body.selfIntroduction ? res.data.body.selfIntroduction : '暫無自我介紹'
        let str
        if (/x-oss-proce/g.test(this.imageUrl)) {
          str = this.imageUrl + '/resize,h_34,w_34'
        } else {
          str = this.imageUrl
        }
        window.localStorage.username = this.userName
        window.localStorage.userImg = str
        this.USER({ name: this.userName, img: str })
        this.createNum = res.data.body.salesSlipCount ? res.data.body.salesSlipCount : 0
        this.shareNum = res.data.body.shareCount ? res.data.body.shareCount : 0
        this.transNum = res.data.body.orderCount ? res.data.body.orderCount : 0
        this.totalSale = res.data.body.totalMoney ? res.data.body.totalMoney : 0
        this.browse = res.data.body.shareOpenCount ? res.data.body.shareOpenCount : 0
        this.orderFail = res.data.body.notPayOpenCount ? res.data.body.notPayOpenCount : 0
        let result = res.data.body.latestSalesSlips
        /** 封装table数据相应格式 */
        if (result && result.length > 0) {
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
            if (
              result[i].status === 1 ||
              result[i].status === 2
            ) {
              result[i]['latestClass'] = 'invalid-sale'
            }
          }
          this.finalLatestSale = result.map((item, i) => {
            const tableData = item.tableData.map((ite, idx) => {
              ite['imgStatus'] = []
              ite.show = false
              const url = encodeURIComponent(
                `${window.location.origin}${window.location.pathname}/nuskin-tw-personal-offer-h5/#/turistVistor?salesSlipId=${
                  ite.id
                }`
              )
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
        }
        this.$nextTick(() => {
          document.onclick = () => {
            this.resetShareWx()
          }
        })
      })
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
    /** 修改用户信息 */
    editInfo () {
      this.editDialogVisible = true
      this.imageEdit = this.imageUrl
      this.editForm.nickName = this.userName
      this.token.auth = `${window.localStorage.token}`
      this.uploadApiUrl =
        process.env.DOMAIN + '/api/v1/nuskin/trade/mall/user/updateHeadImg'
    },
    clearValidate () {
      this.editDialogVisible = false
      this.editForm.introduce = this.selfIntroduction
      this.$refs.editForm.clearValidate()
    },
    /** 保存更改昵称 */
    saveEdit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            nickName: this.editForm.nickName,
            introduce: this.editForm.introduce
          }
          loginApi.editName(params).then(res => {
            if (res.data.success === true) {
              orderApi.latestSaleList().then(rest => {
                this.userName = rest.data.body.nickName
                this.selfIntroduction = this.editForm.introduce ? this.editForm.introduce : '暫無自我介紹'
                window.localStorage.username = this.userName
                /* 用户名修改成功后 如果头像修改过
                提交头像修改 最終提示在 handleAvatarSuccess 函數中
                */
                if (this.imageUrlChange) {
                  let info = {}
                  info.headImg = this.imageEdit
                  loginApi
                    .editAvatar({ headImg: this.imageEdit })
                    .then(resp => {
                      if (resp.data.success) {
                        this.editDialogVisible = false
                        const user = {}
                        this.imageUrl = this.imageEdit
                        user.img = this.imageEdit
                        user.name = rest.data.body.nickName
                        this.USER(user)
                        this.$message.success('修改頭像成功！')
                      } else {
                        this.$message('修改頭像失敗！')
                      }
                    })
                    .catch(err => {
                      this.$message('修改頭像失敗！')
                      console.log(err)
                    })
                } else {
                  /* 未修改头像 直接提示保存成功 */
                  this.editDialogVisible = false
                  this.editForm.nickName = ''
                  this.USER({ name: this.userName, img: this.imageUrl })
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success'
                  })
                }
              })
            } else {
              // this.editDialogVisible = false
              this.$message({
                showClose: true,
                message: res.data.errMsg,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    /** 展开全部产品 */
    showAllPic (scope) {
      scope.row.heightClass = 'auto-height'
    },
    /** 收起全部产品 */
    limitedPicNum (scope) {
      scope.row.heightClass = 'limited-height'
    },
    /** 新增销售单 */
    addSale () {
      if (this.userName === '' || this.userName === null) {
        this.$message({
          showClose: true,
          message: '請先設置暱稱',
          type: 'error'
        })
      } else {
        this.$router.push({ path: '/addSale' })
      }
    },
    /** 銷售排行 */
    productRankings () {
      this.$router.push({ path: '/productRankings' })
    },
    /** 查看全部销售单 */
    allSale () {
      window.localStorage.setItem('searchParams', '')
      this.$router.push({ path: '/saleList' })
    },
    /** 查看详情 */
    toDetail (scope) {
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
      let params = { salesSlipId: e.trigger.dataset.id, shareType: 4 }
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
      let params = { salesSlipId: scope.row.id, shareType: 0 }
      orderApi.shareSale(params).then(res => {
        this.getInfo()
      })
      let shareUrl =
        window.location.origin + window.location.pathname + '#/visitorSale?salesSlipId=' + scope.row.id
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u='.concat(
          encodeURIComponent(shareUrl)
        ),
        '',
        'height=400,width=600,top=100,left=300,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no'
      )
    },
    /** 分享到line */
    shareLine (scope) {
      let params = { salesSlipId: scope.row.id, shareType: 1 }
      orderApi.shareSale(params).then(res => {
        this.getInfo()
      })
      let shareUrl =
        window.location.origin + window.location.pathname + '#/visitorSale?salesSlipId=' + scope.row.id
      window.open(
        'https://lineit.line.me/share/ui?url='.concat(
          encodeURIComponent(shareUrl)
        )
      )
    },
    /** 分享到微信 */
    shareWx (scope) {
      if (scope.row.show === false) {
        let params = { salesSlipId: scope.row.id, shareType: 2 }
        orderApi.shareSale(params).then(res => {
          orderApi.latestSaleList().then(res => {
            this.shareNum = res.data.body.shareCount
            scope.row.show = true
          })
        })
      } else {
        scope.row.show = false
      }
    },
    closeWechat () {
      this.resetShareWx()
    },
    /** 分享messenger(pc) */
    shareMsg (scope) {
      let shareUrl =
        window.location.origin + window.location.pathname + '#/visitorSale?salesSlipId=' + scope.row.id
      window.open(
        'https://www.messenger.com?link='.concat(encodeURIComponent(shareUrl))
      )
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/main.less';
.order-wrap {
  background: #f1f1f1;
  min-height: 616px;
  .gery-font {
    color: #999999;
  }
  .copy-cursor {
    cursor: pointer;
  }
}
.pointer-cursor {
  cursor: pointer;
  font-size: 12px;
}
.pointer-cursor:hover {
  color: #008ab0;
}
.order-top {
  height: 216px;
  background: linear-gradient(45deg, #008ab0 16%, #007298 100%);
  .user-name {
    margin-left: 10px;
    margin-top: 40px;
    font-size: 14px;
    color: #fff;
    .user-name_edit {
      padding-left:10px;
      color: #B9E1EA;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .self-intro{
    margin-left: 10px;
    color: white;
    margin-top: 10px;
    margin-bottom: 32px;
    font-size: 14px;
    line-height: 20px;
    min-height: 40px;
    box-sizing: border-box;
    word-break: break-all;
  }
  .user-wrap {
    .user-message {
      margin-top: 20px;
      font-size: 13px;
      width: 100px;
      margin-left: 66px;
      text-align: center;
      a {
        color: #b9e1ea;
      }
    }
  }
  .btn-wrap {
    margin-left: 10px;
    button {
      width: 120px;
      height: 36px;
      color: white;
      font-size: 13px;
      background: none;
    }
    button:first-child{
      background: white;
      color: #0080a6;
    }
    button:last-child {
      width: 160px;
    }
  }
  .list-info-wrap {
    width: 80%;
    text-align: right;
    margin-left: 16%;
    margin-top: 48px;
    color: white;
    .el-col {
      text-align: center;
      height: 40px;
      border-right: 1px solid rgba(255, 255, 255, 0.5);
      p:nth-child(even) {
        margin-top: 5px;
        font-size: 18px;
      }
      p:nth-child(odd) {
        opacity: 0.7;
        font-size: 14px;
      }
    }
    .el-col:last-child {
      border-right: none;
    }
  }
  .user-photo {
    margin-top: 40px;
    margin-left: 66px;
    img {
      width: 100px;
      height: 100px;
      cursor: pointer;
      border-radius: 50%;
      min-height: 100px;
      min-width: 100px;
      line-height: 100px;
      color: #b9e1ea;
      font-size: 13px;
      object-fit: cover;
    }
  }
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
  background: #f1f1f1;
  .content-title {
    background-color: #fff;
    padding: 14px 20px 14px 29px;
    margin: 15px 0;
    &::before {
      top: 23px;
    }
  }
  .invalid-sale {
    color: #a7a7a7;
    .products-info p {
      color: #a7a7a7;
    }
    .copy-cursor {
      color: #a7a7a7;
    }
    .share-to {
      color: #a7a7a7;
    }
    .pointer-cursor{
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
    span {
      height: 16px;
      padding-left: 10px;
      border-left: 2px solid #0089af;
    }
  }
  .latest-sale {
    border: 1px solid #e5e5e5;
    margin-bottom: 10px;
    .last-row {
      position: relative;
      // text-align: center;
      div:first-child {
        text-align: left;
      }
    }
    .code {
      opacity: 0;
      position: absolute;
      left: 50%;
      transform: translateX(-50%) scale(0);
      transition: all 0.2s;
      z-index: 100;
      display: inline-block;
      background: #008ab0;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2), 0 0 6px 0 rgba(0, 0, 0, 0.1);
      padding: 5px;
      &.active {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }
      img {
        width: 100px;
        height: 100px;
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
  .list-row {
    font-size: 12px;
    padding: 10px 0 10px 20px;
    background: #f9f9f9;
  }
  .products-info {
    font-size: 12px;
    p {
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
  .share-row {
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
  .share-not {
    .icon-set {
      cursor: not-allowed;
    }
  }
}
.dialog-wrap {
  position: relative;
  margin-top: -20px;
  .close-dialog {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: absolute;
    top: -74px;
    right: -50px;
    font-size: 30px;
    cursor: pointer;
    text-align: center;
    line-height: 40px;
    background: #ffffff;
    box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.09);
  }
  .photo-row {
    height: 120px;
    .edit-img-wrap {
      background: #e5e5e5;
      border-radius: 50%;
      margin-bottom: 20px;
      display: inline-block;
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    button {
      margin-top: 40px;
      margin-left: 20px;
      height: 32px;
      width: 80px;
      line-height: 6px;
      font-size: 12px;
      text-indent: -5px;
    }
  }
  .edit-name-title {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .edit-tip {
    color: #bbbbbb;
    margin-top: 15px;
  }
  .selfIntro {
    margin: 20px 0 10px;
    font-size: 14px;
  }
  .save-edit-wrap {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
    button {
      width: 80px;
      height: 32px;
      font-size: 12px;
      line-height: 6px;
      border: none;
    }
  }
}
</style>
<style lang="less">
.user-edit-dialog {
  width: 360px;
  .el-dialog__body {
    padding: 30px 30px 15px 30px;
    textarea {
      font-family: '微软雅黑';
    }
  }
  .el-dialog__header {
    width: 80%;
    margin: 0 auto;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    .el-dialog__title {
      font-size: 16px;
    }
  }
}
.user-edit-form {
  font-size: 12px;
  .el-form-item__content {
    width: 100%;
  }
  .el-form-item {
    width: 100%;
    .el-input__inner{
      width: 280px;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
    }
    .el-textarea__inner {
      width: 280px;
      font-size: 12px;
    }
  }
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border: 1px solid #e5e5e5;
  }
}
.order-wrap {
  .el-table,
  .el-table__body-wrapper,
  .el-table .cell {
    overflow: inherit;
  }
  .el-table th,
  .el-table td {
    vertical-align: top;
  }
  .el-table th,
  .el-table td {
    padding: 12px 0 12px 0;
  }
}
/*.table-wrap {*/
/*.el-table th,*/
/*.el-table td {*/
/*padding: 12px 0 0 0;*/
/*}*/
/*}*/
</style>
