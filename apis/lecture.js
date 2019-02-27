// const URL = 'https://app.vdongchina.com/frontapi/app'
// const URL = 'https://studyanimal.vdongchina.com/frontapi/app'
// const URL = 'http://192.168.1.166:8083/wyl/app'


const fetchApi = require('./fetch')
const URL = require('./httpUrl').httpUrl;

var fetchData = function (path, params, token, methods) {
  return fetchApi(URL, path, params, token, methods)
}

var getLecturerPhone = function (params, token, methods) {
  return fetchData(`lecturer/getLecturerPhone`, params, token)
}

var lecturerBindPhone = function (params, token, methods) {
  return fetchData(`lecturer/lecturerBindPhone`, params, token, 'POST')
}



module.exports = {
  fetchData,
  getLecturerPhone,
  lecturerBindPhone,
  URL
}