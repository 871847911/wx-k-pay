// pages/moneyManagement/moneyManagement.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayAmount: "",
    moonAmount: "",
    allAmount: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.getUserIncomeSummary();
  },

  //生产者收入统计
  getUserIncomeSummary: function () {
    wx.request({
      url: app.globalData.httpUrl + "/app/userSettlement/getUserIncomeSummary",
      data: {},
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function (res) {
        console.log("生产者收入统计==》", res);
        that.setData({
          dayAmount: res.data.data.dayAmount,
          moonAmount: res.data.data.moonAmount,
          allAmount: res.data.data.allAmount,
          settlementAmount: res.data.data.settlementAmount,
          waitAmount: res.data.data.waitAmount
        })
      }

    })
  },
  gohasSet:function(){
    wx.navigateTo({
      url: '../hasSettled/hasSettled',
    })
  },
  gowaiteSet:function(){
    wx.navigateTo({
      url: '../waitSettled/waitSettled',
    })
  },
  goToday: function (e){
  
    wx.navigateTo({
      url: '../income/income?incometime=' + e.currentTarget.dataset.incometime,
    })
  }
})