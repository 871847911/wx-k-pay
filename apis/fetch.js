/**
 * 抓取远端API的结构
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Object} params 参数
 * @param  {String} token  接口访问凭证
 * @param  {String} methods请求方式
 * @return {Promise}       包含抓取任务的Promise
 */
const checkAuth = require('./checkAuth');
module.exports = function(api, path, params, token, methods) {
    var token = token ? token : ''
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${api}/${path}`,
            method: methods ? 'POST' : 'GET',
            data: Object.assign({}, params),
            header: methods ? { 'Content-Type': 'application/x-www-form-urlencoded', userToken: token } : { 'Content-Type': 'json', userToken: token },
            success: resolve,
            fail: reject
        })
    })
}