#!/usr/bin/env node

const cli = require('../src/cli/index.js')
const performance = require('../src/performance/index.js')
const analyzer = require('../src/analyzer/index.js')
const output = require('../src/output/index.js')

// 获取参数
let opts = cli()
// 执行perfomance
performance(opts).then(async statisticData => {
  let data = await analyzer(statisticData)
  // console.log('data:', data)
  // 打印输出data
  output(data)
  process.exit(1)
})