// const URL = 'https://app.vdongchina.com/lfo/app'
// const URL = 'https://app.vdongchina.com/frontapi/app'
// const URL = 'https://studyanimal.vdongchina.com/frontapi/app'
// const URL = 'https://app.vdongchina.com/frontapi/app'
const fetchApi = require('./fetch')
const URL = require('./httpUrl').httpUrl;

/**
 * 抓取远端API的结构
 * @param  {String} path   请求路径
 * @param  {Object} params 参数
 * @param  {String} token  接口访问凭证
 * @param  {String} methods请求方式
 * @return {Promise}       包含抓取任务的Promise
 */

var fetchData = function(path, params, token, methods) {
  return fetchApi(URL, path, params, token, methods)
}

/**
 * Api 分类列表
 */



var course = function(path, params, token, methods) {
  return fetchData(`course/${path}`, params, token, methods)
}
var courses = function(path, params, token, methods) {
  return fetchData(`${path}`, params, token, methods)
}
var subscribe = function(path, params, token, methods) {
  return fetchData(`subscribe/${path}`, params, token, methods)
}

var order = function(path, params, token, methods) {
  return fetchData(`order/${path}`, params, token, methods)
}


var user = function(path, params, token, methods) {
  return fetchData(`user/${path}`, params, token, methods)
}

var store = function(path, params, token, methods) {
  return fetchData(`store/${path}`, params, token, methods)
}

var advertisement = function(path, params, token, methods) {
  return fetchData(`advertisement/${path}`, params, token, methods)
}

var consult = function(path, params, token, methods) {
  return fetchData(`consult/${path}`, params, token, methods)
}

var search = function(path, params, token, methods) {
  return fetchData(`search/${path}`, params, token, methods)
}

var lecturer = function(path, params, token, methods) {
  return fetchData(`lecturer/${path}`, params, token, methods)
}

var message = {
  countUnread(params, token, methods) {
    fetchData(`message/countUnread`, params, token, methods)
      .then(res => {
        // console.log('message/countUnread', '当前未读的信息有', res.data)
        if (parseInt(res.data) > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: res.data.data.toString()
          })
        }
      })
  },
  getAndRead(params, token, methods) {
    return fetchData(`message/getAndRead`, params, token, methods)
  },
  page(params, token, methods) {
    return fetchData(`message/page`, params, token, methods)
  }
}

module.exports = {
  fetchData,
  course,
  subscribe,
  order,
  user,
  store,
  advertisement,
  consult,
  search,
  lecturer,
  message,
  URL,
  courses
}