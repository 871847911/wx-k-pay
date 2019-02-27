// pages/mySub/mySub.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subDetail: {},
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无订阅，快去逛逛吧'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.apis.user('pageLecturer', {
        page: 1,
        size: 10
    }, app.globalData.token)
      .then(res => {
        console.log('我的订阅', res)
        this.setData({subDetail: res.data.data })
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
  goDetail(e) {
    console.log(e)
    // this.triggerEvent('goDetail', detail)
    wx.navigateTo({
      url: `/pages/${e.detail.type}/${e.detail.type}?lecturerId=${e.detail.lecturerId}`
    })
  }
})