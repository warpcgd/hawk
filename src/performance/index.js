const puppeteer = require('puppeteer')
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

async function performance (opts) {
  const {
    url,
    number
  } = opts
  console.log('初始化浏览器')
  let browser = await puppeteer.launch()
  let tabs = await generateTabs(browser, number)
  let tabsLen = tabs.length
  let countPerTab = Math.floor(number / tabsLen)
  let lastCountOfTheTab = number - (countPerTab * tabsLen)
  let loadTasks = []
  let loadEvents = []
  for (let i = 0; i < tabsLen; i++) {
    let tab = tabs[i]
    let loadCountPerTab = countPerTab
    if (i < tabsLen - 1) loadCountPerTab = countPerTab + lastCountOfTheTab
    for (let j = 0; j < loadCountPerTab; j++) {
      loadTasks.push(
        tab.goto(url, {
          timeout: 172800000,
          waitUntil: 'load'
        })
      )
      let loadHandler = () => {
        loadEvents.push(tab.evaluate(() => {
          console.log(1)
          let total = window.performance
          let fmp = window.performance.now()
          return JSON.stringify({
             total,
             fmp
           })
        }))
        tab.removeListener('load', loadHandler)
      }
      tab.on('load', loadHandler)
    }
  }
  await Promise.all(loadTasks)
  let performances = await Promise.all(loadEvents)
  setTimeout(() => browser.close())
  return performances
}
module.exports = performance
