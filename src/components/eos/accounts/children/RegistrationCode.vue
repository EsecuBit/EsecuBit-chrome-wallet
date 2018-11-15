<template>
  <div class="content">
    <table class="table table-striped">
      <colgroup>
        <col width="30%">
        <col width="70%">
      </colgroup>
      <tbody>
      <tr>
        <td>Owner Public Key</td>
        <td>{{ownerPublicKey}}</td>
      </tr>
      <tr>
        <td>Active Public Key</td>
        <td>{{activePublicKey}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RegistrationCode',
  props: {
    ownerPublicKey: {
      type: String,
      default: ''
    },
    activePublicKey: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="less">
  .content {
    width: 100%;
    padding: 15px 0;
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
  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }
  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
  }
  th {
    font-weight: bold;
    display: table-cell;
    text-align: left;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  td {
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
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
