const puppeteer = require('puppeteer')

// page 拦截request，手动将cdn转化为本地链接
async function monitor (page, opt) {
  await page.setRequestInterception(true)
  page.on('request', async request => {
    const url = request.url()
    // 配置了 cdn 的需要在这里拦截请求
    if (/\.ihago\.net\/a\/.+\/assets\/.+\/.+\..+/.test(url) && !/corejslib|ihago-libs/.test(url)) {
      // 命中了 cdn 拦截的
      request.continue({ url: `${opt.host}assets${url.split('assets')[1]}` })
    } else {
      // 否则直接返回
      request.continue()
    }
  })
}

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
  // 去掉浏览器缓存
  await tab.setCacheEnabled(false)
  // 数据存储
  const performanceArr = []

  // tab.on('load', loadHandler)
  // async function loadHandler () {
  //   const performance = await tab.evaluate(() => {
  //     let total = window.performance
  //     let fmp = window.performance.now()
  //     return JSON.stringify({total, fmp})
  //   })
  //   performanceArr.push(performance)
  // }
  // // await monitor(tab, 'http://127.0.0.1/demo/')
  // for (let j = 0; j <= number; j++) {
  //   await tab.goto(url)
  // }
  // tab.removeListener('load', loadHandler)
  let loadTasks = []
  let loadEvents = []
  tab.on('load', loadHandler)
  function loadHandler () {
    loadEvents.push(tab.evaluate(() => {
      let total = window.performance
      let entries = total.getEntries()
      return JSON.stringify({ total, entries })
    }))
  }
  for (let i = 0; i < number; i++) {
    loadTasks.push(
      tab.goto(url)
    )

  }
  await Promise.all(loadTasks)
  console.log(loadEvents)
  performanceArr = await Promise.all(loadEvents)
  tab.removeListener('load', loadHandler)
  setTimeout(() => browser.close())
  return performanceArr
}
module.exports = performance
