const puppeteer = require('puppeteer')
async function performance (opts) {
  const {
    url,
    number
  } = opts
  console.log('初始化浏览器')
  return await puppeteer.launch().then(async browser => {
    console.log('浏览器初始化成功')
    const page = await browser.newPage()
    const performanceArr = [] // 多少次的数组
    page.on('load', loadHandler)
    console.log(`开始加载${url}页面`)
    // 开启浏览器 循环写入数组
    for (let i = 0; i <= number; i++) {
      await page.goto(url)
    }
    page.removeListener('load', loadHandler)

    // 加载后的钩子函数
    async function loadHandler() {
      const performance = await page.evaluate(() => {
        let total = window.performance
        let fmp = window.performance.now()
        return JSON.stringify({
          total,
          fmp
        })
      })
      performanceArr.push(performance)
    }
    return performanceArr
  })
}
module.exports = performance
