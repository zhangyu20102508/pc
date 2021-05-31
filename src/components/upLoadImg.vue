<template>
  <div class="upload" >
    <div class="upload">
    <div class="oss_file">
      <input type="file" accept="image/*" :id="id" @change="doUpload"/>
      <label :for="id">
        <span class="btn">
          上傳
          </span>
      </label>
      <label>
        <span class="btn disabled">
          <i class="el-icon-loading"></i>上傳
          </span>
      </label>
      <img :src="url" alt="" />
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'upload',
  props: {
    maxSize: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      region: 'oss-cn-hongkong', // 根据你买的那个区的做相应的更改
      bucket: 'tw-personaloffer-qa', // 存放backet的目录
      accessKeyId: 'LTAInYrkgcoC0p5o',
      accessKeySecret: 'eWv8bbCZ2YsUWNMwLGXvOcs5P40Kyb',
      id: 'upload',
      percentage: 0,
      url: '',
      urls: [],
      isLoading: true, // 加载效果
      getToken: {
        sign: ''
      }
    }
  },
  methods: {
    doUpload () {
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
      const files = document.getElementById(_this.id)
      if (files.files) {
        const fileLen = document.getElementById(_this.id).files
        for (let i = 0; i < fileLen.length; i++) {
          const file = fileLen[i]
          // 随机命名
          let randomName = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.')[1]
          const isLt10M = file.size / 1024 / 1024 < this.maxSize
          if (!isLt10M) {
            this.$message({
              message: '圖片大小不能超過5M',
              type: 'warning'
            })
            files.value = ''
            return false
          }
          this.isLoading = true
          this.$emit('stopSave', true)
          // 上传
          client.multipartUpload(randomName, file, {
            progress: function* (percentage, cpt) {
              // 上传进度
              _this.percentage = percentage
            }
          }).then((results) => {
            var url
            if (process.env.NODE_ENV === 'qa' || process.env.NODE_ENV === 'development') {
              url = 'https://imgtest.nuskin.com.tw/' + results.name
            } else if (process.env.NODE_ENV === 'stage') {
              url = 'https://imgstage.nuskin.com.tw/' + results.name
            } else {
              url = 'https://img.nuskin.com.tw/' + results.name
            }
            this.isLoading = false
            this.$emit('stopSave', false)
            // this.url = url
            this.$emit('avatarImg', url)
          }).catch((err) => {
            this.$emit('avatarImg', 'error')
            this.isLoading = false
            this.$emit('stopSave', false)
            console.log(err)
          })
        }
        files.value = ''
      }
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
    const body = document.getElementsByTagName('body')[0]
    const sc = document.createElement('script')
    sc.src = 'https://gosspublic.alicdn.com/aliyun-oss-sdk-4.4.4.min.js'
    body.appendChild(sc)
  }
}
</script>

<style lang="less" scoped >
  .upload {
    input {
      position: absolute;
      left: -999px;
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
  }
</style>
