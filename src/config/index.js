const fs = require('fs')
// url检测
const regUrl = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/i
// 本地域名
const serverHost = '127.0.0.1'
// 本地端口
const serverPort = 2333
// 文件目录检测
const fsStat = function fsExistsSync(path) {
  try {
      fs.accessSync(path,fs.F_OK);
  } catch(e){
      return false
  }
  return true
}
module.exports = {
  regUrl,
  fsStat,
  serverHost,
  serverPort
}