#!/usr/bin/env node

const cli = require('../src/cli/index.js')
const performance = require('../src/performance/index.js')
const analyzer = require('../src/analyzer/index.js')
const output = require('../src/output/index.js')
const { createServer, closeServer } = require('../src/server/index.js')
let config = require('../src/config/index.js')
const {
  regUrl,
  fsStat,
  serverHost,
  serverPort
} = config
let server
// 获取参数
let opts = cli()
// 判定url
let {
  url
} = opts
let regUrlResult = regUrl.test(url)
async function main () {
  if (!regUrlResult) {
    console.log('未检测到合法的域名, 继续检测是否为本地文件')
  }
  
  if (fsStat(url)) {
    console.log(`检测到${url}为本地文件`)
    console.log(`自动启动本地服务器`)
    server = await createServer()
    // 本地地址
    let localPath = `http://${serverHost}:${serverPort}/${url}`
    console.log(`本地地址：${localPath}`)
    opts.url = localPath
  }
  
  if (!regUrlResult && !fsStat(url)) {
    console.log(`未检测到${url}为本地文件，程序自动关闭`)
    process.exit(1)
  }
  // 执行perfomance
  performance(opts).then(async statisticData => {
    let data = await analyzer(statisticData)
    // console.log('data:', data)
    // 打印输出data
    output(data)
    if (fsStat(url)) {
      console.log(`关闭本地服务器`)
      closeServer(server)
    }
    process.exit(1)
  })
}
// 主程序执行
main ()