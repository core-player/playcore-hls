import isMobileJS from 'ismobilejs';
// import config from '../config';



const ua = navigator.userAgent.toLowerCase()
const isMobile = isMobileJS(navigator)


export function generateID() {
  return 'xxxxxxxx-4xxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function getFormatBandwidth (speed) {
  if (!speed) {
    return '0 KB/s'
  }
  if (speed / 1024 / 1024 < 1) {
    return (speed / 1024).toFixed(2) + ' KB/s'
  } else {
    return (speed / 1024 / 1024).toFixed(2) + ' MB/s'
  }
}


export function getElementOffsets(obj) {
  let left = 0;
  let top = 0;
  do {
    left += obj.offsetLeft
    top += obj.offsetTop
  } while ((obj = obj.offsetParent))
  return {
    left,
    top
  }
}



const _isSafari = function() {
  return navigator.userAgent.indexOf("Safari") > -1
}

export function debounce(fun, delay) {
  return function () {
      let that = this
      let args = arguments
      clearTimeout(fun.id)
      fun.id = setTimeout(function () {
          fun.call(that, args )
      }, delay)
  }
}

// find the correct part of video buffered
export function getMatchRangeTime(time, ranges) {
  if (ranges.length === 0) {
    return 0;
  }
  for (let i = 0; i < ranges.length; i ++) {
    const start = ranges.start(i)
    const end = ranges.end(i)
    if (time >= start && time <= end) {
      return ranges.end(i)
    }
  }
  return time
}

function getMediaSource () {
  return window.MediaSource || window.WebKitMediaSource
}

const WEB_SUPPORT_H264_CODEC = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'

export const isMSESupported = () => {
  const mediaSource = getMediaSource()
  const sourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer
  const isTypeSupported = mediaSource &&
    typeof mediaSource.isTypeSupported === 'function' &&
    mediaSource.isTypeSupported(WEB_SUPPORT_H264_CODEC)

  // if SourceBuffer is exposed ensure its API is valid
  // safari and old version of Chrome doe not expose SourceBuffer globally so checking SourceBuffer.prototype is impossible
  const sourceBufferValidAPI = !sourceBuffer ||
    (sourceBuffer.prototype &&
      typeof sourceBuffer.prototype.appendBuffer === 'function' &&
      typeof sourceBuffer.prototype.remove === 'function')
  return !!isTypeSupported && !!sourceBufferValidAPI
}




export const isAndroid = isMobile.android
export const isApple = isMobile.apple.device
export const isSafari = isMobile.apple.device && _isSafari()
export const isTencentGroup = /MQQBrowser/i.test(ua)
export const isUC = /ucbrowser/i.test(ua)
export const isChrome = /chrome/i.test(ua)
export const isWechat = /MicroMessenger/i.test(ua)
export const isFirefox = /firefox/i.test(ua)
