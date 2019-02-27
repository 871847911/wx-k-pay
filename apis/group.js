// const URL = 'https://app.vdongchina.com/frontapi/app'
// const URL = 'https://studyanimal.vdongchina.com/frontapi/app'
// const URL = 'http://192.168.1.166:8083/wyl/app'

const fetchApi = require('./fetch');
const URL = require('./httpUrl').httpUrl;


var fetchData = function(path, params, token, methods) {
  return fetchApi(URL, path, params, token, methods)
}

var getMyGroupBuyList = function(params, token, methods) {
  return fetchData(`groupBuy/getMyGroupBuyList`, params, token, methods)
}

var getAppGroupBuyList = function(params, token, methods) {
  return fetchData(`groupBuy/getAppGroupBuyList`, params, token, methods)
}

var getGroupBuyRuleList = function (params, token, methods) {
  return fetchData(`groupBuy/getGroupBuyRuleList`, params, token, 'post')
}

var getGroupBuyById = function(params, token, methods) {
  return fetchData(`groupBuy/getGroupBuyById`, params, token, 'post')
}

var createCollagOrder = function(params, token, methods) {
  return fetchData(`collage/createCollagOrder`, params, token, 'post')
}
var createPaidCollagOrder = function(params, token, methods) {
  return fetchData(`collage/createPaidCollagOrder`, params, token, 'post')
}
var queryCollagByShare = function(params, token, methods) {
  return fetchData(`collage/queryCollagByShare`, params, token, 'post')
}
var createGroupQrcode = function(params, token, methods) {
  return fetchData(`collage/createGroupQrcode`, params, token, 'post')
}

var getAppGroupOrderDTO = function(params, token, methods) { // 拼团订单详情
  return fetchData(`groupBuy/getAppGroupOrderDTO`, params, token)
}

var deleteGroupOrder = function(params, token, methods) { // 删除订单
  return fetchData(`groupBuy/deleteGroupOrder`, params, token, 'post')
}
var queryByCollage = function(params, token, methods) { // 删除订单
  return fetchData(`collage/queryByCollage`, params, token, 'post')
}

var getShareCourses = function (params, token, methods) { 
  return fetchData(`shareCourse/getShareCourses`, params, token, methods)
}

module.exports = {
  fetchData,
  getMyGroupBuyList,
  getAppGroupBuyList,
  getGroupBuyById,
  createCollagOrder,
  createPaidCollagOrder,
  queryCollagByShare,
  createGroupQrcode,
  getAppGroupOrderDTO,
  deleteGroupOrder,
  queryByCollage,
  getShareCourses,
  URL,
  getGroupBuyRuleList
}