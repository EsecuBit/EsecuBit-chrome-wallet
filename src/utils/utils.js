export default {
  getFormatTime (time) {
    let date = new Date(time)
    let yyyy = date.getFullYear()
    let moth = date.getMonth() + 1
    let MM = parseInt(moth / 10) ? moth : '0' + moth
    let dd = parseInt(date.getDate() / 10) ? date.getDate() : '0' + date.getDate()
    let HH = parseInt(date.getHours() / 10) ? date.getHours() : '0' + date.getHours()
    let mm = parseInt(date.getMinutes() / 10) ? date.getMinutes() : '0' + date.getMinutes()
    let ss = parseInt(date.getSeconds() / 10) ? date.getSeconds() : '0' + date.getSeconds()
    let arr = []
    arr.push(yyyy)
    arr.push('-')
    arr.push(MM)
    arr.push('-')
    arr.push(dd)
    arr.push(' ')
    arr.push(HH)
    arr.push(':')
    arr.push(mm)
    arr.push(':')
    arr.push(ss)
    return arr.join('')
  },
  formatNum (num) {
    return parseFloat(num).toLocaleString()
  }
}
