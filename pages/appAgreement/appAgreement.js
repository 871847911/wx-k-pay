// pages/appAgreement/appAgreement.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isYes: false,
    applyStatus:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取订阅状态  默认值;10：待处理;20：通过;30：已拒绝;
    app.apis.user('getInfo', {}, app.globalData.token).then(res => {
      console.log("获取订阅状态", res.data.data.applyStatus);
      this.setData({
        applyStatus: res.data.data.applyStatus
      })
    })      

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value[0] == 'YES')
      this.setData({ isYes: true })
    else
      this.setData({ isYes: false })
  },
  next() {
    console.log('xxx')
    if (this.data.isYes) {
      wx.navigateTo({
        url: '/pages/appBasicInfo/appBasicInfo',
      })
    } else {
      wx.showToast({
        title: '确认你已阅读此协议',
        icon: 'none'
      })
    }
  }
})