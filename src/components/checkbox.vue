<template>
  <div class="checkbox-wrapper" @click="handleClick">
    <div :class="{'active': active}" class="checkbox--content"></div>
  </div>
</template>
<script>
export default {
  props: {
    active: Boolean
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
  .checkbox-wrapper {
   .checkbox--content {
     position: relative;
     display: inline-block;
     width: 14px;
     height: 14px;
     border: 1px solid #8c93a4;
     border-radius: 2px;
     box-sizing: border-box;
     &.active {
       background:#008ab0;
       &::after {
         content: '';
         position: absolute;
         left: 0;
         top: 0;
         display: inline-block;
         height: 7px;
         width: 3px;
         border: 1px solid;
         border-color: transparent #fff #fff transparent;
         transform: rotate(45deg) translate(2px,-3px);
       }
     }
   }
  }
</style>
