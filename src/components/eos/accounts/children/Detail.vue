<template>
  <div>
    <div class="table-shadow" @click="closeDetail">
    </div>
    <div class="content" v-if="detail">
      <h1 class="table-title">Detail</h1>
      <table class="table table-striped">
        <colgroup>
          <col width="20%">
          <col width="80%">
        </colgroup>
        <thead>
        <tr>
          <th>Name</th>
          <th>Information</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>transaction id</td>
          <td>{{detail.tx}}</td>
        </tr>
        <tr>
          <td>date</td>
          <td>{{detail.time}}</td>
        </tr>
        <tr>
          <td>from/to</td>
          <td>{{detail.showAddresses}}</td>
        </tr>
        <tr>
          <td>amount</td>
          <td>{{detail.value}}</td>
        </tr>
        <tr>
          <td>memo</td>
          <td >{{detail.memo}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    closeDetail () {
      this.$emit('changeShowDetail', false)
    }
  }
}
</script>

<style scoped lang="less">
  .table-shadow{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    cursor: pointer;
  }
  .content {
    width: 800px;
    height: 380px;
    font-size: 13px;
    padding: 25px 0 0 0;
    position: fixed;
    z-index: 99999999;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 1px 1px 50px rgba(0,0,0,.3);
    .table-title{
      margin: 0 0 10px 0;
      font-size: 28px;
      color: #666;
    }
    .table {
      table-layout: fixed;
      width: 100%;
      max-width: 100%;
      margin-bottom: 17px;
      background-color: transparent;
      border-collapse: collapse;
      border-spacing: 0;
      display: table;
      border: 1px solid #eee;
      border-radius: 4px;
      td {
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
      }
      thead {
        display: table-header-group;
        vertical-align: middle;
        border-color: inherit;
      }
      tr {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
      }
      th {
        font-weight: bold;
        display: table-cell;
        text-align: left;
      }
      tbody {
        display: table-row-group;
        vertical-align: middle;
        border-color: inherit;
      }
    }
    .table > thead > tr > th {
      width: 40px;
      border-bottom: 2px solid #f4f4f4;
      vertical-align: bottom;
      padding: 8px;
      line-height: 1.42857143;
    }
    .table > thead:first-child > tr:first-child > th {
      border-top: 0
    }
    .table-striped > tbody > tr:nth-of-type(odd) {
      background-color: #f9f9f9;
    }
    .table > tbody > tr > td {
      border-top: 1px solid #f4f4f4;
      padding: 8px;
      line-height: 1.42857143;
      vertical-align: top;
      word-break: break-all;
      white-space: pre-wrap;
    }
  }
</style>
