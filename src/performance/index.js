const puppeteer = require('puppeteer')
// 开启多个page

async function performance (opts) {
  const {
    url,
    number
  } = opts
  console.log('初始化浏览器')
  let browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true
  })
  let tab = await browser.newPage()
  // await tab.setCacheEnabled(true)
  tab.on('load', loadHandler)
  async function loadHandler () {
    const performance = await tab.evaluate(() => {
      let total = window.performance
      let fmp = window.performance.now()
      return JSON.stringify({total, fmp})
    })
    performanceArr.push(performance)
  }
  // await monitor(tab, 'http://127.0.0.1/demo/')
  const performanceArr = [] // 数据存储
  for (let j = 0; j <= number; j++) {
    await tab.goto(url)
  }
  tab.removeListener('load', loadHandler)
  setTimeout(() => browser.close())
  return performanceArr
}
module.exports = performance
