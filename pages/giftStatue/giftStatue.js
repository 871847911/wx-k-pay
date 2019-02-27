// pages/giftStatue/giftStatue.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 109,
    orderId: '',
    giftDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ id: options.id, orderId: options.orderId })
    this.queryById()
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
    return {
      title: '赠送',
      path: '/pages/receiveGift/receiveGift?&id=' + this.data.orderId, //这里设定都是以"/page"开头,并拼接好传递的参数
      success: function (res) {
        // 转发成功
        console.log(res);
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 1500
        })
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          duration: 1500
        })
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  queryById() {
    var that = this
    let params = {
      id: that.data.id
    }
    app.gift.queryById(params, app.globalData.token).then(res => {
      console.log(res.data.data)
      if (res.data.success == true) {
        that.setData({ giftDetail: res.data.data })
      }
    })
  },

  toIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})