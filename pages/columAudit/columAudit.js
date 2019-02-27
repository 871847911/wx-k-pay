// pages/contentAudit/contentAudit.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: ['未审核', '审核中', '已审核'],
    navId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // changeNav(e) {
  //   switch (e.currentTarget.dataset.index) {
  //     case 0:
  //       that.setData({
  //         auditStatus: 10
  //       })
  //       that.getColumList(10);
  //       break;
  //     case 1:
  //       that.setData({
  //         auditStatus: 10
  //       })
  //       that.getColumList(20);
  //       break;
  //     case 2:
  //       that.setData({
  //         auditStatus: 10
  //       })
  //       that.getColumList(50);
  //       break;

  //   }
  //   // console.log(e.currentTarget.dataset.index)
  //   this.setData({
  //     navId: e.currentTarget.dataset.index
  //   })
  // },
  onLoad: function(options) {
    that = this;
    that.getColumList();
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
   * 用户点击右上角分享z`
   */
  onShareAppMessage: function() {

  },
  //获取专栏审核列表
  getColumList: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/column/pageByLecturer",
      data: {
        page: 1,
        size: 10,
      
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {

        console.log(res);
        var list = res.data.data.list;
        for (var i = 0; i < list.length; i++) {
          switch (list[i].updateType) {
            case "1":
              list[i].updateType = "每日更新";
              break;
            case "2":
              list[i].updateType = "每周更新";
              break;
            case "3":
              list[i].updateType = "每月更新";
              break;
          }
        }
        that.setData({
          list: list
        })
      }
    })
  },
  //跳转详情
  goDetalis:function(e){
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../columAuditDetail/columAuditDetail?columnId=' + that.data.list[e.currentTarget.dataset.id].id,
    })
  }
})