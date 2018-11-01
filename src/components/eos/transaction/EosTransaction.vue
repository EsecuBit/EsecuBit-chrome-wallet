<template>
  <div class="vote-box-container ">
    <TransferTokens></TransferTokens>
  </div>
</template>

<script>
import TransferTokens from './children/TransferTokens'
export default {
  name: 'EosSend',
  components: {
    TransferTokens
  },
  props: {
    errorCodeMsg: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style scoped lang="less">
 .vote-box-container{
   padding: 20px 10px;
 }
</style>
