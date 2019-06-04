// 引入commander插件
const program = require('commander')
// 引入文档
const pkg = require('./package.json')
// 分析组件
const analyzer = require('./analyzer.js')
// 监听指令
const { version } = pkg
let url = ''
program
  .version(version)
  .option('-n, --number [Number]', '检测的次数,默认一次', 1, parseInt)

program
  .command('verify <path>')
  .description('检测路径')
  .action((path) => {
    console.log(`开始检测路径${path}`)
    url = path
  })

program
  .on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '))
    process.exit(1)
  })

program.parse(process.argv)

// 无命令，默认help
if (process.argv.length === 2) {
  program.help()
}
const {
  number
} = program

if (number) {
  console.log(`检测次数${number}次`)
}

const puppeteer = require('puppeteer')
console.log('初始化浏览器')
puppeteer.launch().then(async browser => {
  console.log('浏览器初始化成功')
  const page = await browser.newPage()
  const performanceArr = [] // 多少次的数组
  page.on('load', loadHandler)
  console.log(`开始加载${url}页面`)
  // 开启浏览器 循环写入数组
  for(let i = 0; i <= number; i++) {
    await page.goto(url)
  }
  page.removeListener('load', loadHandler)
  analyzer(performanceArr)
  
  // 加载后的钩子函数
  async function loadHandler () {
    const performance = await page.evaluate(() => {
      let total = window.performance
      let fmp = window.performance.now()
      return JSON.stringify({total, fmp})
    })
    performanceArr.push(performance)
  }
})

