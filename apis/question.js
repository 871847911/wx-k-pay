// const URL = 'https://studyanimal.vdongchina.com/frontapi/app'
// const URL = 'https://app.vdongchina.com/frontapi/app'
// const URL = 'http://192.168.1.166:8083/wyl/app'

const fetchApi = require('./fetch')
const URL = require('./httpUrl').httpUrl;


var fetchData = function (path, params, token, methods) {
  return fetchApi(URL, path, params, token, methods)
}


var saveQuestion = function ( params, token, methods) {
  return fetchData(`questionAndAnswer/saveQuestion`, params, token, 'POST')
}

var queryQuestion = function (params, token, methods) {
  return fetchData(`questionAndAnswer/queryQuestionsWX`, params, token, methods)
}

var queryQuestionById = function (params, token, methods) {
  return fetchData(`questionAndAnswer/queryQuestionById`, params, token, methods)
}

var queryAnswerByQuesid = function (params, token, methods) {
  return fetchData(`questionAndAnswer/queryAnswerByQuesid`, params, token, methods)
}
var addAnswer = function (params, token, methods) {
  return fetchData(`questionAndAnswer/addAnswer`, params, token, 'POST')
}

var saveQuestionAndPics = function (params, token, methods) {
  return fetchData(`questionAndAnswer/saveQuestionAndPics`, params, token, "POST")
}

var queryStarQuestions = function (params, token, methods) {
  return fetchData(`questionAndAnswer/queryStarQuestions`, params, token, methods)
}

var MyQuestionWX = function (params, token, methods) {
  return fetchData(`questionAndAnswer/myQuestionWX`, params, token, methods)
}

var askMeQuestionWX = function (params, token, methods) {
  return fetchData(`questionAndAnswer/askMeQuestionWX`, params, token, methods)
}

var queryById = function (params, token, methods) {
  return fetchData(`questionAndAnswer/queryById`, params, token, methods)
}
//我的分享
var getCourseByOpenId = function (page, size, userId, params, token, methods) {
  return fetchData(`shareCourse/getCourseByOpenId?page=` + page + `&size=` + size + `&userId=` + userId, params, token, methods)
}
//根据课程ID查该分享规则和进度
var rule = function (params, token, methods) {
  return fetchData(`shareCourse/getShareCourseRuleDTO`, params, token, 'POST')
}
var addAnswerAndPics = function (params, token, methods) {
  return fetchData(`questionAndAnswer/addAnswerAndPics`, params, token, 'POST')
}
var updateQuestion = function (params, token, methods) {
  return fetchData(`questionAndAnswer/updateQuestion`, params, token, 'POST')
}

var updateQuestion = function (params, token, methods) {
  return fetchData(`questionAndAnswer/updateQuestion`, params, token, 'POST')
}

var listExceptMe = function (params, token, methods) {
  return fetchData(`questionAndAnswer/listExceptMe`, params, token, methods)
}

var addStar = function (params, token, methods) {
  return fetchData(`questionAndAnswer/addStar`, params, token, "POST")
}
// 分享进入页面
var groupShareDetail = function (params, token, methods) {
  return fetchData(`collage/queryCollagByShare`, params, token, "POST")
}
module.exports = {
  fetchData,
  saveQuestion, 
  queryQuestion,
  queryQuestionById,
  queryAnswerByQuesid,
  addAnswer,
  saveQuestionAndPics,
  queryStarQuestions,
  MyQuestionWX,
  askMeQuestionWX,
  queryById,
  getCourseByOpenId,
  rule,
  addAnswerAndPics,
  updateQuestion,
  listExceptMe,
  addStar,
  groupShareDetail,
  URL
}