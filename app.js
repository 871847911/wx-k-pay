
var apis = require('./apis/index')
var question = require('./apis/question')
var wechat = require('./apis/wechat')
var checkAuth = require('./apis/checkAuth')
var gift = require('./apis/gift')
var group = require('./apis/group')
var lecture = require('./apis/lecture.js')
var that;
var httpUrl = require('./apis/httpUrl').httpurl;
var app = getApp();

App({
  onLaunch: function () {
    that = this;
    try {
      var res = wx.getSystemInfoSync()
      console.log(res)

      if (res.system.indexOf("iOS") != -1) {

        that.globalData.isIOS = true;

      }
    } catch (e) {
      // Do something when catch error
    }

  },
  onShow:function(){
    console.log("globalData.roleId", that.globalData.roleId, that.globalData.token)
    if (that.globalData.token !=null){
      that.apis.user('getInfo', {}, that.globalData.token).then(res => {
        if (res.data.success) {
          console.log("getInfo", res)
          console.log("getInfo",res.data.data.roleId)
          that.globalData.roleId = res.data.data.roleId
        }
      })
    }
    
  },
  checkAuth:function(cb){
   var that = this;
    if (that.globalData.token){
      if (typeof cb == 'function') {
        cb(that.globalData.token);
      }
    }else{
    checkAuth();
    }
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
 
  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {//手机型号，获取网络类型
    console.log("msg",msg);
  },
  apis,
  question,
  group,
  gift,
  wechat,
  checkAuth,
  gift,
  lecture,
  globalData: {
    nickName: "",
    imgPath: "",
    payCrtl: true,
    roleId: '',
    isIOS: false,
    // httpUrl: "https://app.vdongchina.com/llh" ,
    // httpUrl: 'https://app.vdongchina.com/frontapi',
    httpUrl: httpUrl,
    imgUrl: "http://kpay-temp.qiniu.vdongchina.cn/", 
    phone:'',
    profit:'',
    id:'',
    customerPhone: "",
    route:"",
    audioUrl:"",
    storeId:""
    // token: '19_136_8f581f3c525e49cdb7c9e8ddb96ef00d'
  },
  applyForm: {},

})

/**
 * 1.pages/appAgreement/appAgreement 
 * 2.pages/appBasicInfo/appBasicInfo
 * 3.pages/appIdAuth/appIdAuth
 * 4.pages/appContact/appContact
 * 5.pages/appPersonalIntr/appPersonalIntr
 */