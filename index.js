// 引入commander插件
const program = require('commander')
// 引入文档
const pkg = require('./package.json')
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
  page.on('load', loadHandler)
  console.log(`开始加载${url}页面`)
  await page.goto(url)
  // 开启浏览器
  async function loadHandler () {
    console.log('Page loaded!')
    const performance = await page.evaluate(() => {
      let total = window.performance
      let entries = total.getEntries()
      return JSON.stringify({ total, entries })
    })
    page.removeListener('load', loadHandler)
    console.log(performance)
  }
})

