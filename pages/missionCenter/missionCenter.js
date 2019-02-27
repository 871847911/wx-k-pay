// pages/missionCenter/missionCenter.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks: ["首次订阅课程", "每日登陆", "绑定手机号"],
    dailyList:[],
    newbieList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    if(options.intent != null){
      this.getTaskList("vip");
    }else{
      this.getTaskList("score");
    }
    
  },

 
  //获取任务列表1=新手任务 2=日常任务
  getTaskList: function(vip) {
    wx.request({
      url: app.globalData.httpUrl + "/app/"+vip+"/listTask",
      data: {
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("listTask",res);
        that.setData({
          dailyList: res.data.data.dailyList,
          newbieList: res.data.data.newbieList
        })
      }
    })
  }
})