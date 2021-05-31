<template>
  <div class="login_warp" >
    <div class="login_bg"></div>
    <div class="login_content">
      <div class="logo">
        <!--<i class="iconfont img icon-nuskin-white-img"></i>-->
      </div>
      <div  class="login-box">
        <div class="welcome">如新會員分享管理</div>
        <el-form :model="ruleForm" status-icon   ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="rules">
          <el-form-item  prop="userName">
            <el-input v-model="ruleForm.userName" :placeholder="userPlaceholder" onkeyup="this.value=this.value.replace(/[^\w]/g,'');" @focus="userPlaceholder=''" @blur="userPlaceholder='請輸入您的賬號'"><i slot="prefix" class="iconfont icon-user"></i></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off" :placeholder="passwordPlaceholder" @keyup.enter.native="submitForm('ruleForm')" onkeyup="this.value=this.value.replace(/[^\w]/g,'')" @focus="passwordPlaceholder=''" @blur="passwordPlaceholder='請輸入密碼'"><i slot="prefix" class="iconfont icon-psd"></i></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登錄</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</div>
</template>
<script>
// import LoginAPI from '../../api/loginApi'
import JsEncrypt from 'jsencrypt'
export default {
  name: 'login',
  data () {
    var userName = (rule, value, callback) => {
      let uPattern = /^[a-zA-Z0-9]{4,16}$/ // 用户名正则，4到16位（字母，数字，下划线）
      if (!value) {
        return callback(new Error('賬號不能為空!'))
      } else {
        if (uPattern.test(value) === false) {
          callback(new Error('請輸入正確的賬號!'))
        } else {
          callback()
        }
      }
    }
    /**
     * [description]
     * @param  {[type]}   rule     [description]
     * @param  {[type]}   value    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    return {
      userPlaceholder: '請輸入您的賬號',
      passwordPlaceholder: '請輸入密碼',
      ruleForm: {
        password: '',
        userName: ''
      },
      rules: {
        password: [{required: true, trigger: 'blur', message: '密碼不能為空！'}],
        userName: [{ validator: userName, trigger: 'blur' }]
      }
    }
  },
  beforeMount () {
    // 判断用户的访问设备 在内容未加载的时候改变路径
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      window.location.href = window.location.origin + '/nuskin-tw-personal-offer-h5/#/'
    }
  },
  methods: {
    submitForm (formName) {
      let postObj = {
        userName: this.ruleForm.userName,
        password: this.ruleForm.password
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          const jse = new JsEncrypt()
          jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
            MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfxj1mQyN2nyRvmu4naL3TFuOkZkoy1EGubkl7IKyozPGsUGICqdBYiUSzCVwgz8D7Eaf5ozj0hEdZExksE71mpu67QzLbs+oe+qYaCvK+kjbULkCUO2CeKVBKU9S2JJTj7+WDRlNm/Vji1JQq058FW2HMJ2e9nAtgTND2fenA5QIDAQAB
          -----END PUBLIC KEY-----`)
          postObj.password = jse.encrypt(postObj.password)
          postObj.userName = jse.encrypt(postObj.userName)
          // LoginAPI.login(postObj).then(res => {
          const res = {
            data: {
              success: true,
              body: {
                token: '111111'
              }
            }
          }
          if (res.data.success === true) {
            let user = res.data.body
            window.localStorage.token = user.token
            localStorage.setItem('userName', this.ruleForm.userName)
            if (window.sessionStorage.loginToUrl) {
              window.location.replace(window.sessionStorage.loginToUrl)
            } else {
              this.$router.replace({ path: '/order' })
            }
          } else {
            let error = res.data.errMsg + ''
            this.$message({
              showClose: true,
              message: error,
              type: 'error'
            })
          }
          // })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/styles/main.less";
.login_warp {
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;
}
.login_bg {
  background: rgba(0, 0, 0, 0) url(../../assets/img/login/nuskin-bg.jpg) no-repeat
    scroll 50% 50% / cover;
  height: 100%;
  // transition: transform 0.5s linear 0s,
  // -webkit-transform 0.5s linear 0s;
  width: 100%;
  //  &:hover{
  //   transform: scale(1.3);
  //  }
}
.login_content {
  left: 50%;
  position: absolute;
  top: 60%;
  transform: translate(-50%, -50%);
  width: 380px;
  z-index: 100;
  h3 {
    color: #fff;
  }
  .logo {
    .img {
      display: block;
      text-align: center;
      margin: 0 auto;
      padding-left: 20px;
    }
  }
  .login-box {
    padding: 10px 30px;
    background-color: #fff;
    border-radius: 6px;
    .welcome {
      font-size: 18px;
      text-align: center;
      color: #333;
      margin-top: 20px;
      font-weight: normal;
    }
  }
}
.el-form-item {
  padding-bottom: 0px !important;
  margin-bottom: 40px !important;
}
.el-button {
  width: 100% !important;
}
.el-form {
  margin-left: -100px !important;
  padding-top: 30px !important;
}
.el-input__inner {
  text-indent: 10px !important;
}
</style>
