// pages/cashManagement/cashManagement.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payUser: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    
   
  },
  onShow:function(){
    that.getPayUserBalance();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //生产账户信息
  getPayUserBalance: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/userSettlement/getPayUserBalance",
      data: {

      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("账户详情", res.data.data)
        that.setData({
          payUser: res.data.data
        })
      }
    })
  },
  //跳转申请提现页面
  getMoney: function() {
   wx.navigateTo({
     url: '../requestWithdrawal/requestWithdrawal?profit='+that.data.payUser.profit,
   })
  },
  //跳转已提现管理或冻结管理
  gohad:function(){
    wx.navigateTo({
      url: '../cashRecord/cashRecord?withdrawType=2',
    })
  },
  goice: function () {
    wx.navigateTo({
      url: '../cashRecord/cashRecord?withdrawType=1',
    })
  }

})