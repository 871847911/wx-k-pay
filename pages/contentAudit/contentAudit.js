// pages/contentAudit/contentAudit.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: ['未审核', '审核中', '已审核'],
    navId: 0,
    auditStatus:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  changeNav(e) {
    // console.log(e.currentTarget.dataset.index)
    switch (e.currentTarget.dataset.index) {
      case 0:
        this.setData({
          auditStatus: 10
        })
        this.getContentList(10);
        break;
      case 1:
        this.setData({
          auditStatus: 20
        })
        this.getContentList(20);
        break;
      case 2:
        this.setData({
          auditStatus: 50
        })
        this.getContentList(50);
        break;

    }
    this.setData({
      navId: e.currentTarget.dataset.index
    })
  },
  onLoad: function(options) {
    that = this;
    this.getContentList(10);
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
  getContentList: function (auditStatus ) {
    wx.request({
      url: app.globalData.httpUrl + "/app/column/pageContentByLecturer",
      data: {
        page: 1,
        size: 10,
        auditStatus: auditStatus 

      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("getContentList",res)
        that.setData({
          list:res.data.data.list
        })
      }
    })
  },
  //跳转
  goDetalis:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../contentAuditDetail/contentAuditDetail?contentId=' + that.data.list[e.currentTarget.dataset.id].id,
    })
  }
})