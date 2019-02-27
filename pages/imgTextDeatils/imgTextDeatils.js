// pages/imgTextDeatils/imgTextDeatils.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    context: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   that = this;
    console.log(options.subId)
    this.getDetalis(options.subId)

  },
  //获取专栏内容
  getDetalis: function (subId) {
    wx.request({
      url: app.globalData.httpUrl + "/app/course/getSubContext",
      data: {
        subId: subId
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log(res)
         var context=res.data.data.replace(/<img /g, '<img style="max-width:100%;height:auto" ')
        that.setData({
          context: context
        })
      }
    })

  }
})