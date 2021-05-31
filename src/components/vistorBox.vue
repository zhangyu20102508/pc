<template>
  <div class="vistorBox">
   <HeadNav></HeadNav>
   <div class='contentBox'>
    <router-view></router-view>
   </div>
   <DataFooter></DataFooter>
  </div>
</template>
<script>
import HeadNav from '@/components/vistorHead'
import DataFooter from '@/components/DataFooter'

export default {
  name: 'vistorBox',
  components: {
    HeadNav,
    DataFooter
  }
}
</script>
<style lang="less">
#app {
  min-width:1170px;
}
.vistorBox {
  background: #f1f1f1;
}
.contentBox {
  width: 1170px;
  margin: 20px auto;
  min-height: 80vh;
}
</style>
