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
// 开启多个page
async function generateTabs (browser, count) {
  let tabs = []
  let pagesLength = 1

  if (count >= 20) {
    pagesLength = 2
  }

  if (count >= 40) {
    pagesLength = 3
  }

  if (count >= 80) {
    pagesLength = 4
  }

  if (count >= 100) {
    pagesLength = 5
  }

  if (count >= 500) {
    pagesLength = 6
  }

  for (let i = 0; i < pagesLength; i++) {
    tabs.push(await browser.newPage())
  }
  return tabs
}

// async function performance (opts) {
//   const {
//     url,
//     number
//   } = opts
//   console.log('初始化浏览器')
//   let browser = await puppeteer.launch()
//   let tabs = await generateTabs(browser, number)
//   let tabsLen = tabs.length
//   let countPerTab = Math.floor(number / tabsLen)
//   let lastCountOfTheTab = number - (countPerTab * tabsLen)
//   let loadTasks = []
//   let loadEvents = []
//   for (let i = 0; i < tabsLen; i++) {
//     let tab = tabs[i]
//     let loadCountPerTab = countPerTab
//     if (i < tabsLen - 1) loadCountPerTab = countPerTab + lastCountOfTheTab
//     // 去掉浏览器缓存
//     await tab.setCacheEnabled(false)
//     for (let j = 0; j < loadCountPerTab; j++) {
//       loadTasks.push(
//         tab.goto(url, {
//           timeout: 172800000,
//           waitUntil: 'load'
//         })
//       )
//       let loadHandler = () => {
//         loadEvents.push(tab.evaluate(() => {
//           console.log(1)
//           let total = window.performance
//           let fmp = window.performance.now()
//           return JSON.stringify({
//              total,
//              fmp
//            })
//         }))
//         tab.removeListener('load', loadHandler)
//       }
//       tab.on('load', loadHandler)
//     }
//   }
//   await Promise.all(loadTasks)
//   let performances = await Promise.all(loadEvents)
//   setTimeout(() => browser.close())
//   return performances
// }


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

