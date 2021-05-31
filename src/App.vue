<template>
  <div id="app">
    <router-view/>
    <Loading v-show="showLoading"></Loading>
  </div>
</template>

<script>
import Loading from './components/loading.vue'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      name: 'app'
    }
  },
  components: {Loading},
  computed: mapGetters([
    'showLoading'
  ]),
  beforeMount () {
    let path = window.location.href
    let str = path.split('=')[1].split('#')[0]
    if (/\/?/.test(path)) {
      if ( /turistVistor/g.test(path)) {
        window.location.href = window.location.origin + '/nuskin-tw-personal-offer-pc/#/visitorSale?salesSlipId=' + str
      } else if (/fbclid=/g.test(path)) {
        window.location.href = window.location.origin + '/nuskin-tw-personal-offer-pc/#/login'
      }
    }
  }
}
</script>

<style lang="less">
@-moz-document url-prefix() { /*Firefox*/
  body{
    width: 98vw;
  }
}
::-webkit-scrollbar {
  width: 0.5vw;
  height: 0.5vw;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-track-piece {
  background-color: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
::-webkit-scrollbar-corner {
  background: #f1f1f1;
}
::-webkit-scrollbar-resizer  {
  background: #f1f1f1;
}
</style>
