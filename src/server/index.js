const { createServer } = require('http-server')
const {
  serverHost,
  serverPort
} = require('../config/index.js')

exports.createServer = function (opt = {}) {
  return new Promise((resolve) => {
    const server = createServer({
      root: './'
    })
    server.listen(serverPort, serverHost, function (res) {
      resolve(server)
      console.log(`http 服务已经启动，端口 ${serverPort}`)
    })
  })
}

exports.closeServer = function (server) {
  if (server) {
    server.close(() => {
      console.log(`http 服务关闭，端口 ${serverPort} ${Date.now()}`)
    })
  }
}
