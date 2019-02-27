function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: resolve,
      fail: reject
    })
  })
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: resolve,
      fail: reject
    })
  })
}

function setStorage(key, value) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: key,
      data: value,
      success: resolve,
      fail: reject
    })
  })
}

function getStorage(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: resolve,
      fail: reject
    })
  })
}

function getLocation(type) {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: type,
      success: resolve,
      fail: reject
    })
  })
}

function requestPayment(param) {
  // const timestamp = Date.parse(new Date());
  // const nonceStr = Math.random().toString(36).substr(2, 36);
  //key 支付秘钥
  // const paySign = MD5(`appId=wx78d21906d8f5d871&nonceStr=${nonceStr}&package=${prepay_id}&signType=MD5&timeStamp=${timestamp}& key=qazwsxedcrfvtgbyhnujmikolp111111`)
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': 'MD5',
      'paySign': param.paySign,
      'success': resolve,
      'fail': reject
    })
  })
}

function uploadFile( url,filePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload',
      filePath: filePath,
      name: 'file',
      success: resolve,
      fail: reject
    })
  })
}

module.exports = {
  login,
  getUserInfo,
  setStorage,
  getStorage,
  getLocation,
  original: wx,
  requestPayment,
  uploadFile
}