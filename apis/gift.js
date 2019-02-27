// const URL = 'https://app.vdongchina.com/frontapi/app'
// const URL = 'https://studyanimal.vdongchina.com/frontapi/app'
// const URL = 'http://192.168.1.166:8083/wyl/app'

const fetchApi = require('./fetch')
const URL = require('./httpUrl').httpUrl;


var fetchData = function (path, params, token, methods) {
  return fetchApi(URL, path, params, token, methods)
}

var pageGiftOrder = function (params, token, methods) {
  return fetchData(`giftManage/pageGiftOrder`, params, token, 'POST')
}

var queryById = function (params, token, methods) {
  return fetchData(`giftManage/queryById`, params, token, 'POST')
}

var checkGetGift = function (params, token, methods) {
  return fetchData(`giftManage/checkGetGift`, params, token, 'POST')  
}

var receiveGift = function (params, token, methods) {
  return fetchData(`giftManage/receiveGift`, params, token, 'POST')
}

var createOrder = function (params, token, methods) {
  return fetchData(`giftManage/createOrder`, params, token, methods)
}

var createUnifyOrder = function (params, token, methods) {
  return fetchData(`order/createUnifyOrder`, params, token, 'POST')
}

var buyGift = function (params, token, methods) {
  return fetchData(`giftManage/buyGift`, params, token, 'POST')
}

var checkGiftShare = function (params, token, methods) {
  return fetchData(`giftManage/checkGiftShare`, params, token, 'POST')
}


module.exports = {
  fetchData,
  pageGiftOrder,
  queryById,
  checkGetGift,
  receiveGift,
  createOrder,
  createUnifyOrder,
  buyGift,
  checkGiftShare,
  URL
}