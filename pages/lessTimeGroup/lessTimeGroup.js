// pages/lessTimeGroup/lessTimeGroup.js
var app = getApp();
var that;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无相关信息'
    },
    freeList: [],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    app.group.getGroupBuyRuleList({
      page: page,
      size: 10,
      storeId: app.globalData.userInfo.storeId,
     
    }, app.globalData.token).then(res => {
      console.log(res)
      that.setData({
        freeList: res.data.data.list
      })
    }),"POST"
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
    wx.showLoading({
      title: '加载中',
    })
    // 页数+1 
    page = page + 1;
    app.group.getGroupBuyRuleList({
      page: page,
      size: 10,
      storeId: app.globalData.userInfo.storeId,
    }, app.globalData.token).then(res => {
      wx.hideLoading();
      // 停止下拉动作  
      console.log(res.data.data.list)
      var list = that.data.freeList
      for (var i = 0; i < res.data.data.list.length; i++) {
        list.push(res.data.data.list[i]);
      }
      that.setData({
        freeList: list
      })
    })
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

  }
})