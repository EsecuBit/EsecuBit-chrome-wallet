<template>
  <div class="layui-card">
    <div class="layui-card-header">Buy RAM</div>
    <div class="layui-card-body layui-row layui-col-space10 " >
      <form class="layui-form" lay-filter="form">
        <div class="layui-form-item">
          <label class="from-label">RAM Payer</label>
          <input type="text" placeholder="Account paying for RAM" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-item">
          <label class="from-label">RAM Receiver: </label>
          <input type="text" placeholder="Account receiving RAM (may be same as payer to buy for yourself)" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-item">
          <label class="from-label">By in EOS or Bytes?</label>
          <input type="radio" lay-filter="unit" name="unit" value="EOS" title="EOS">
          <input type="radio" lay-filter="unit" name="unit" value="Bytes" title="Bytes" checked>
        </div>
        <div class="layui-form-item">
          <label class="from-label">Amount of RAM to Buy in EOS</label>
          <input type="number" placeholder="Amount of RAM to Buy in EOS" autocomplete="off" class="layui-input">
        </div>
        <div class="layui-form-item">
          <button class="layui-btn">立即提交</button>
          <button type="button" class="layui-btn layui-btn-primary">重置</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
const form = layui.form
export default {
  name: 'BuyRAM',
  mounted () {
    form.render('radio', 'form')
  }
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
    padding: 5px;
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
