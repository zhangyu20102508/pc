<template>
  <div class="userIndex">
   <HeadNav></HeadNav>
   <div class='contentBox'>
    <router-view></router-view>
   </div>
   <DataFooter></DataFooter>
  </div>
</template>
<script>
import HeadNav from '@/components/HeadNav'
import DataFooter from '@/components/DataFooter'

export default {
  name: 'userIndex',
  components: {
    HeadNav,
    DataFooter
  },
  beforeMount () {
    // 判斷用户的访问设备 在内容未加载的时候改变路径
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      window.location.href = window.location.origin + '/nuskin-tw-personal-offer-h5/#/'
    }
  }
}
</script>
<style lang="less">
#app {
  min-width: 1170px;
}
.userIndex {
  background: #f1f1f1;
}
.contentBox {
  width: 1170px;
  margin: 20px auto;
  min-height: 80vh;
}
</style>
