
const D = require('../D').default.class

const IEsDevice = function () {
}
export default {class: IEsDevice}

IEsDevice.prototype.listenPlug = function (callback) {
  setTimeout(() => callback(D.ERROR_NOT_IMPLEMENTED), 0)
}

IEsDevice.prototype.sendAndReceive = async function (apdu) {
  throw D.ERROR_NOT_IMPLEMENTED
}
