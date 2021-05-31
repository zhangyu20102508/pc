<template id="loading-template">
    <div class="loading-overlay">
        <div class="sk-three-bounce">
            <div class="sk-child sk-bounce1"></div>
            <div class="sk-child sk-bounce2"></div>
            <div class="sk-child sk-bounce3"></div>
        </div>
    </div>
</template>

<script>
export default {
  data: function () {
    return {

    }
  },
  methods: {
    hideLoading () {
      setTimeout(() => {
        this.$store.commit('hideloader')
      }, 30000)
    }
  },
  watch: {
    loading: function () {
      if (this.loading) {
        this.hideLoading()
      }
    }
  }
}

</script>

<style scoped >
.loading-overlay {
    content: ''; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 2100;
    opacity: 1;
  background: rgba(0, 0, 0, 0);
  transition: all .6s;
}

.sk-three-bounce {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50% ,-50%);
}

.sk-three-bounce .sk-child {
  margin: 0 15px;
  width: 15px;
  height: 15px;
  background-color: #0bbeea;
  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-three-bounce 1.4s ease-in-out 0s infinite both;
  animation: sk-three-bounce 1.4s ease-in-out 0s infinite both;
}

.sk-three-bounce .sk-bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.sk-three-bounce .sk-bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-three-bounce {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
    }
    40% {
    -webkit-transform: scale(1);
    transform: scale(1);
    }
}

@keyframes sk-three-bounce {
   0%,
   80%,
    100% {
    -webkit-transform: scale(0);
    transform: scale(0);
    }
    40% {
    -webkit-transform: scale(1);
    transform: scale(1);
    }
}
</style>
