<template>
  <div class="layui-card">
    <div class="layui-card-header">Unstake NET/CPU</div>
    <div class="layui-card-body layui-row layui-col-space10">
      <div class="layui-form-item">
        <label class="from-label">Account name of original owner of stake</label>
        <input type="text" placeholder="Account to refund stake to" autocomplete="off" class="layui-input">
      </div>
      <div class="layui-form-item">
        <label class="from-label">Account name of who currently holds stake </label>
        <input type="text" placeholder="Account with stake" autocomplete="off" class="layui-input">
      </div>
      <div class="layui-form-item">
        <label class="from-label">Amount of CPU to Unstake (in EOS)</label>
        <input type="number" placeholder="Amount of CPU to unstake (e.g. 10 EOS)" autocomplete="off" class="layui-input">
      </div>
      <div class="layui-form-item">
        <label class="from-label">Amount of NET to Unstake (in EOS) </label>
        <input type="number" placeholder="Amount of NET to unstake (e.g. 10 EOS)" autocomplete="off" class="layui-input">
      </div>
      <div class="layui-form-item">
        <button class="layui-btn" >立即提交</button>
        <button type="button" class="layui-btn layui-btn-primary">重置</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Unstake'
}
</script>

<style scoped lang="less">
  ::-webkit-input-placeholder{
    color: #aaa;
  }
  .layui-card{
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    box-shadow: 1px 3px 10px 0 #e2e2e2;
    .layui-card-header{
      font-size: 16px;
      border-bottom: 1px solid #eee;
    }
  }
  .layui-form-item{
    margin-bottom: 4px!important;
    .layui-btn{
      color: #fff;
    }
    .from-label{
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
    }
  }
</style>
