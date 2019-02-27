// pages/groupList/groupList.js
const app = getApp()
var page = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    list2: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.group.getAppGroupBuyList({
      page: page,
      size: 10,
      // storeId: app.globalData.userInfo.storeId,
      courseId: options.courseId,
      userId: app.globalData.userInfo.id,
    }, app.globalData.token).then(res => {
      console.log(res)
      that.setData({
        list: res.data.data.list
      })
    })
    app.group.getAppGroupBuyList({
      page: page,
      size: 10,
      storeId: app.globalData.userInfo.storeId,
      userId: app.globalData.userInfo.id,
      courseId: options.courseId,
    }, app.globalData.token).then(res => {
      console.log(res)
      that.setData({
        list2: res.data.data.list
      })
    })
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
  gogroupPin(e) {
    console.log(e.currentTarget.dataset.index)
    var collageId = this.data.list[e.currentTarget.dataset.index].id
    var status = this.data.list[e.currentTarget.dataset.index].isState
    if (status == 0) {
      var param = JSON.stringify({
        collageId: collageId
      })
      console.log(param)
      wx.navigateTo({
        url: `/pages/groupPay/groupPay?param=${param}`,
      })
    }
  },
  gogroupPin2(e) {
    console.log(e.currentTarget.dataset.index)
    var collageId = this.data.list2[e.currentTarget.dataset.index].id
    var status = this.data.list2[e.currentTarget.dataset.index].isState
    if (status == 0) {
      var param = JSON.stringify({
        collageId: collageId
      })
      console.log(param)
      wx.navigateTo({
        url: `/pages/groupPay/groupPay?param=${param}`,
      })
    }
  },
})