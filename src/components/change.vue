<template>
  <div class="upload">
    <div class="upload">
      <div class="oss_file">
        <input type="file" accept="image/*" :id="id" @change="uploadImg"/>
        <label :for="id" v-if="!isLoading" @click="resetInput">
          <span class="btn">上傳</span>
        </label>
        <label v-else>
          <span class="btn disabled">
           <i class="el-icon-loading"></i>上傳
          </span>
      </label>
        <img :src="url" alt="" v-show="true" ref="img" class="hidden-img" :class="imgWidth"/>
      </div>
    </div>
    <el-dialog
    title="選擇圖片區域"
    :visible.sync="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    width="50%"  class="uploadAvatar-dialog">
    <vueCropper
      ref="cropper"
      :img="option.img"
      :outputSize="option.size"
      :outputType="option.outputType"
      :autoCrop="true"
      :fixedNumber="[1,1]"
      :fixed="true"
      :full='true'
      :canMove="false"
      :canScale="false"
    ></vueCropper>
    <span slot="footer" class="dialog-footer">
      <el-button class="confirm-btn" :loading="isLoading" type="primary" @click="confirm">確 定</el-button>
      <el-button @click="cancelCrop">取 消</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import VueCropper from 'vue-cropper'
export default {
  name: 'upload',
  props: {
    maxSize: {
      type: Number,
      default: 10
    }
  },
  components: {VueCropper},
  data () {
    return {
      file: '',
      option: { // 剪裁的参数
        img: '',
        size: 1,
        outputType: 'jpg'
      },
      dialogVisible: false,
      region: 'oss-cn-hongkong', // 根据你买的那个区的做相应的更改
      bucket: 'tw-personaloffer-qa', // 存放backet的目录
      accessKeyId: 'LTAInYrkgcoC0p5o', // 用户keyId
      accessKeySecret: 'eWv8bbCZ2YsUWNMwLGXvOcs5P40Kyb', // 通过密钥
      id: 'upload',
      percentage: 0,
      isLoading: false, // 图片裁剪加载
      url: '',
      urls: [],
      base64: '',
      imgWidth: 'small-img',
      showPreview: true,
      boxWidth: '',
      getToken: {
        sign: ''
      }
    }
  },
  methods: {
    resetInput () {
      const files = document.getElementById(this.id)
      files.value = ''
      this.option.img = ''
    },
    uploadImg () {
      const _this = this
      _this.showPreview = true
      const files = document.getElementById(_this.id)
      if (files.files) {
        const fileLen = document.getElementById(_this.id).files
        this.file = fileLen[0]
        for (let i = 0; i < fileLen.length; i++) {
          const file = fileLen[i]
          // 檢測大小
          const isLt10M = file.size / 1024 / 1024 < this.maxSize
          if (!isLt10M) {
            this.$message({
              message: '圖片大小不能超過5M',
              type: 'warning'
            })
            files.value = ''
            return false
          } else {
            // 显示裁剪框
            this.imgWidth = 'small-img'
            let reader = new FileReader()
            this.base64 = reader.readAsDataURL(file)
            reader.onload = function (e) {
              _this.dialogVisible = true
              // 初始化预览图片
              _this.url = reader.result
              _this.$refs.img.onload = function () {
                if (_this.$refs.img.width >= 400) {
                  _this.imgWidth = 'big-img'
                } else {
                  _this.imgWidth = 'small-img'
                }
                _this.$nextTick(() => {
                  let width = _this.$refs.img.width
                  let height = _this.$refs.img.height
                  _this.showPreview = false
                  _this.boxWidth = width
                  document.getElementsByClassName('el-dialog__body')[1].style.height = height + 'px'
                  document.getElementsByClassName('el-dialog__body')[1].style.width = width + 'px'
                  _this.option.img = reader.result
                })
              }
            }
          }
        }
      }
    },
    cancelCrop () {
      this.dialogVisible = false
      this.showPreview = false
      this.imgWidth = 'small-img'
    },
    // 确实裁剪结果
    confirm () {
      this.isLoading = true
      this.$refs.cropper.getCropData((data) => {
        this.base64 = data
        this.upOss()
      })
    },
    /* 上传到oss */
    upOss () {
      const _this = this
      /* global OSS:true */
      /* eslint no-undef: "error" */
      let bucket
      if (process.env.NODE_ENV === 'production') {
        bucket = 'tw-personaloffer-prod'
      } else if (process.env.NODE_ENV === 'stage') {
        bucket = 'tw-personaloffer-stage'
      } else {
        bucket = 'tw-personaloffer-qa'
      }
      const client = new OSS.Wrapper({
        region: this.region,
        accessKeyId: this.accessKeyId,
        accessKeySecret: this.accessKeySecret,
        bucket: bucket,
        secure: true
      })
      _this.percentage = 0
      // 随机命名
      let randomName = this.random_string(6) + '_' + new Date().getTime() + '.' + 'jpg'
      // 上传加载
      const fileLen = document.getElementById(_this.id).files
      client.multipartUpload(randomName, fileLen[0], {
        progress: function* (percentage, cpt) {
          // 上传进度
          _this.percentage = percentage
        }
      }).then((results) => {
        // 上传完成
        let url
        if (process.env.NODE_ENV === 'qa' || process.env.NODE_ENV === 'development') {
          url = 'https://imgtest.nuskin.com.tw/' + results.name
        } else if (process.env.NODE_ENV === 'stage') {
          url = 'https://imgstage.nuskin.com.tw/' + results.name
        } else {
          url = results.res.requestUrls[0].split('?')[0]
        }
        // 图片等比例裁剪
        const img = new Image()
        img.src = url
        img.onload = function () {
          let w = parseInt((_this.$refs.cropper.cropW * img.width) / _this.boxWidth)
          let h = w

          let b = _this.$refs.cropper.$el.childNodes[4].style.transform
          b = b.replace(/px/g, '')
          const arr = b.split(',')
          let x = parseInt((arr[0].split('(')[1] * img.width) / _this.boxWidth)
          let y = parseInt((arr[1].trim() * img.width) / _this.boxWidth)
          // 阿里oss裁剪参数
          let str = `${url}?x-oss-process=image/crop,w_${w},h_${h},x_${x},y_${y},r_1`
          _this.$emit('avatarImg', str)
          _this.dialogVisible = false
          _this.isLoading = false
        }
      }).catch((err) => {
        _this.isLoading = false
        _this.$emit('avatarImg', 'error')
        console.log(err)
      })
    },

    // 随机生成文件名
    random_string (len) {
      len = len || 32
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var maxPos = chars.length
      var pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    }
  },
  watch: {
    url (val) {
      if (val) {
        this.urls.push(val)
      }
    }
  },
  mounted () {
    // 加载oss js文件
    const body = document.getElementsByTagName('body')[0]
    const sc = document.createElement('script')
    sc.src = 'https://gosspublic.alicdn.com/aliyun-oss-sdk-4.4.4.min.js'
    body.appendChild(sc)
  }
}
</script>

<style lang="less" scoped >
  .el-dialog__body{
    .vue-cropper{
      background-image: none;
      background: black;
    }
  }
  .upload {
    .vue-cropper {
      background-image: none;
    }
    input {
      position: absolute;
      left: -999999px;
      opacity: 0;
      z-index: -1;
    }
    label {
      display: block;
      margin-top: 40px;
      margin-left: 20px;
    }
    img {
      height: 0;
    }
    .btn {
      display: inline-block;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      border-color: #dcdfe6;
      color: #606266;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      -webkit-transition: .1s;
      transition: .1s;
      font-weight: 500;
      user-select: none;
      padding: 8px 16px;
      font-size: 14px;
      border-radius: 3px;
      &.disabled {
        border-color: #eee;
        color: #aaa;
      }
    }
    .oss_file{
      position: relative;
      width: 400px;
    }
    .hidden-img{
      position: absolute;
      z-index: 1;
      left: -9999999px;
      opacity: 0;
    }
    .big-img{
      width: 100%;
      height: auto;
    }
    .small-img{
      width: auto;
      height: auto;
    }
  }
</style>
<style lang="less">
  .uploadAvatar-dialog {
    .el-dialog__body {
      height: 200px;
      width: 200px;
      margin: 0 auto;
    }
    .dialog-footer {
      user-select: none;
    }
  }
</style>
