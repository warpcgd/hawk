function formatMSToHumanReadable(ms, readable) {
  let ret = `${(ms).toFixed(2)} ms`
  if (!readable) return ret
  const ONE_SECOND = 1000
  const ONE_MINUTE = 60 * ONE_SECOND
  const ONE_HORE = 60 * ONE_MINUTE
  // 小于1秒，那么用毫秒为单位
  if (ms >= ONE_SECOND && ms < ONE_MINUTE) {
    // 大于一秒小于一分钟，用秒作为单位
    ret = `${(ms / 1000).toFixed(2)} s`
  } else if (ms >= ONE_MINUTE && ms < ONE_HORE) {
    // 大于一分钟，小于一小时，用分钟作单位
    ret = `${(ms / 1000 / 60).toFixed(2)} m`
  } else if (ms >= ONE_HORE) {
    // 大于一个小时，用小时作单位
    ret = `${(ms / 1000 / 60 / 60).toFixed(2)} h`
  }
  return ret
}
/**
 * @param {Number} domainLookupStart 返回用户代理对当前文档所属域进行DNS查询开始的时间。
 * 如果此请求没有DNS查询过程，如长连接，资源cache,甚至是本地资源等。 那么就返回 fetchStart的值
 * @param {Number} domainLookupEnd 返回用户代理对结束对当前文档所属域进行DNS查询的时间。
 * 如果此请求没有DNS查询过程，如长连接，资源cache，甚至是本地资源等。那么就返回 fetchStart的值
 * @returns {Number} DNS查询耗时
 */
function getDNSTime(domainLookupStart, domainLookupEnd) {
  return domainLookupEnd - domainLookupStart
}

/**
 * @param {Number} connectStart 返回用户代理向服务器服务器请求文档，开始建立连接的那个时间，
 * 如果此连接是一个长连接，又或者直接从缓存中获取资源（即没有与服务器建立连接）。
 * 则返回domainLookupEnd的值
 * @param {Number} connectEnd 返回用户代理向服务器服务器请求文档，
 * 建立连接成功后的那个时间，如果此连接是一个长连接，又或者直接从缓存中获取资源（即没有与服务器建立连接）。
 * 则返回domainLookupEnd的值
 * @returns {Number} TCP链接耗时
 */
function getTCPTime(connectStart, connectEnd) {
  return connectEnd - connectStart
}
/**
 * @param {Number} responseStart 返回用户代理从服务器、缓存、本地资源中，接收到第一个字节数据的时间
 * @param {Number} responseEnd 返回用户代理接收到最后一个字符的时间，和当前连接被关闭的时间中，更早的那个。
 * 同样，文档可能来自服务器、缓存、或本地资源
 * @returns {Number} 网页本身的下载耗时
 */
function getDownloadTime(responseStart, responseEnd) {
  return responseEnd - responseStart
}

/**
 *
 * @param {Number} domInteractive 准备加载新页面的起始时间
 * @param {Number} domComplete readyState = complete的时候
 * @returns {Number} 解析DOM Tree耗时
 * 这个说法有点儿不严谨，这个只能当做dom加载完毕以后，子资源的下载耗时，名字起的容易让人误解
 */
function getAfterDOMReadyTheDownloadTimeOfTheRes(domInteractive, domComplete) {
  return domComplete - domInteractive
}
/**
 *
 * @param {Number} domInteractive 准备加载新页面的起始时间
 * @param {Number} responseStart 返回用户代理从服务器、缓存、本地资源中，接收到第一个字节数据的时间
 * @returns {Number} 白屏时间
 */
function getWhiteScreenTime(navigationStart, domInteractive) {
  return domInteractive - navigationStart
}
/**
 *
 * @param {*} navigationStart
 * @param {*} domContentLoadedEventEnd
 */
function getDOMReadyTime(navigationStart, domContentLoadedEventEnd) {
  return domContentLoadedEventEnd - navigationStart
}
/**
 *
 * @param {Number} navigationStart 准备加载新页面的起始时间
 * @param {Number} loadEventEnd 文档触发load事件结束后的时间。如果load事件没有触发，那么该接口就返回0
 * @returns {Number} DOM Ready耗时
 */
function getLoadTime(navigationStart, loadEventEnd) {
  return loadEventEnd - navigationStart
}

function getAverage(total, length) {
  return total / length
}

function getTTFB(requestStart, responseStart) {
  return responseStart - requestStart
}

function analyzer(data) {
  if (!data) {
    return
  }

  if (!Array.isArray(data)) {
    data = [data]
  }

  let length = data.length // 分析次数

  // DNS查询耗时
  let totalDNSTime = 0
  // TCP链接耗时
  let totalTCPTime = 0
  // TTFB
  let totalTTFBTime = 0
  // donwload资源耗时
  let totalDownloadTime = 0
  // 解析dom树耗时
  let totalAfterDOMReadyTheDownloadTimeOfTheRes = 0
  // 白屏时间
  let totalWhiteScreenTime = 0
  // domready时间
  let totalDOMReadyTime = 0
  // onload时间
  let totalLoadTime = 0
  // FMP时间
  let totalFMP = 0

  for (let item of data) {
    let {
      total
    } = JSON.parse(item)
    let {
      fmp
    } = JSON.parse(item)
    let {
      navigationStart,
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      connectEnd,
      requestStart,
      responseStart,
      responseEnd,
      // domLoading,
      domInteractive,
      // domContentLoadedEventStart,
      domContentLoadedEventEnd,
      domComplete,
      // loadEventStart,
      loadEventEnd
    } = total.timing
    totalDNSTime += getDNSTime(domainLookupStart, domainLookupEnd)
    totalTCPTime += getTCPTime(connectStart, connectEnd)
    totalTTFBTime += getTTFB(requestStart, responseStart)
    totalDownloadTime += getDownloadTime(responseStart, responseEnd)
    totalAfterDOMReadyTheDownloadTimeOfTheRes += getAfterDOMReadyTheDownloadTimeOfTheRes(domInteractive, domComplete)
    totalWhiteScreenTime += getWhiteScreenTime(navigationStart, domInteractive)
    totalDOMReadyTime += getDOMReadyTime(navigationStart, domContentLoadedEventEnd)
    totalLoadTime += getLoadTime(navigationStart, loadEventEnd)
    totalFMP += fmp

  }
  // console.log('DNS lookup time:', formatMSToHumanReadable(getAverage(totalDNSTime, length)))
  // console.log('TCP connect time:', formatMSToHumanReadable(getAverage(totalTCPTime, length)))
  // console.log('TTFB:', formatMSToHumanReadable(getAverage(totalTTFBTime, length)))
  // console.log('Download time of the page:', formatMSToHumanReadable(getAverage(totalDownloadTime, length)))
  // console.log('After DOM Ready the download time of resources:', formatMSToHumanReadable(getAverage(totalAfterDOMReadyTheDownloadTimeOfTheRes, length)))
  // console.log('White screen time:', formatMSToHumanReadable(getAverage(totalWhiteScreenTime, length)))
  // console.log('DOM Ready time:', formatMSToHumanReadable(getAverage(totalDOMReadyTime, length)))
  // console.log('Load time:', formatMSToHumanReadable(getAverage(totalLoadTime, length)))
  // console.log('DNS查询耗时：', formatMSToHumanReadable(getAverage(totalDNSTime, length)))
  // console.log('TCP连接耗时:', formatMSToHumanReadable(getAverage(totalTCPTime, length)))
  // console.log('TTFB:', formatMSToHumanReadable(getAverage(totalTTFBTime, length)))
  // console.log('页面下载耗时:', formatMSToHumanReadable(getAverage(totalDownloadTime, length)))
  // console.log('白屏时间:', formatMSToHumanReadable(getAverage(totalWhiteScreenTime, length)))
  // console.log('DOM Ready耗时:', formatMSToHumanReadable(getAverage(totalDOMReadyTime, length)))
  // console.log('DOM Ready之后继续进行资源下载的耗时:', formatMSToHumanReadable(getAverage(totalAfterDOMReadyTheDownloadTimeOfTheRes, length)))
  // console.log('Load时间:', formatMSToHumanReadable(getAverage(totalLoadTime, length)))
  // console.log('FMP:', formatMSToHumanReadable(getAverage(totalFMP, length)))
  // console.log(`\n`)

  return {
    total: {
      dnsTime: formatMSToHumanReadable(getAverage(totalDNSTime, length)),
      tcpTime: formatMSToHumanReadable(getAverage(totalTCPTime, length)),
      TTFB: formatMSToHumanReadable(getAverage(totalTTFBTime, length)),
      pageDownloadTime: formatMSToHumanReadable(getAverage(totalDownloadTime, length)),
      whiteScreenTime: formatMSToHumanReadable(getAverage(totalWhiteScreenTime, length)),
      DOMReadyTime: formatMSToHumanReadable(getAverage(totalDOMReadyTime, length)),
      afterDOMReadyDownloadTime: formatMSToHumanReadable(getAverage(totalAfterDOMReadyTheDownloadTimeOfTheRes, length)),
      loadTime: formatMSToHumanReadable(getAverage(totalLoadTime, length)),
      fmp: formatMSToHumanReadable(getAverage(totalFMP, length))
    }
  }
}

module.exports = analyzer