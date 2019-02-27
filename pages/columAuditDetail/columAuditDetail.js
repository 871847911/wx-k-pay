// pages/columAuditDetail/columAuditDetail.js]
var app = getApp();
var that;
var columnId;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    columnId = options.columnId
    this.getDetali(options.columnId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获得专栏详情
  getDetali: function(columnId) {
    wx.request({
      url: app.globalData.httpUrl + "/app/column/get",
      data: {
        columnId: columnId

      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log(res)
        var introduction = res.data.data.column.introduction;
        introduction = introduction.replace(/<img /g, '<img style="max-width:100%;height:auto" ')
        var all = res.data.data
        switch (all.column.updateType) {
          case "1":
            all.column.updateType = "每日";
            break;
          case "2":
            all.column.updateType = "每";
            break;
          case "3":
            all.column.updateType = "每月";
            break;
        }

        that.setData({
          all: all,
          introduction: introduction
        })
      }
    })
  },
  //跳转
  goIssue: function() {
    wx.navigateTo({
      url: '../issue/issue?columnId=' + columnId,
    })
  }

})