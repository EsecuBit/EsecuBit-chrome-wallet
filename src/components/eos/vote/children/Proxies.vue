<template>
  <div class="layui-card-body layui-row layui-col-space10">
    <div class="layui-form-item">
      <label class="from-label">Proxies</label>
      <input type="text" placeholder="Account that owns the RAM" autocomplete="off" class="layui-input">
    </div>
    <div class="layui-form-item">
      <label class="from-label">Username </label>
      <input type="text" placeholder="Enter Proxies EOS Username" autocomplete="off" class="layui-input">
    </div>
    <div class="layui-form-item">
      <button class="layui-btn" >Vote</button>
      <button type="button" class="layui-btn layui-btn-primary">Reset</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Proxies'
}
</script>

<style scoped lang="less">
  ::-webkit-input-placeholder{
    color: #aaa;
  }
  .layui-form-item{
    margin-bottom: 4px!important;
    .layui-btn{
      color: #fff;
    }
    .layui-form-label{
      width: auto;
      padding-left: 0;
    }
    .layui-input-block{
      margin-left: 0;
    }
    .from-label{
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
    }
  }
</style>
