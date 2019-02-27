// pages/giftHistory/giftHistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftList: [],
    pageNum: 1,
    pageSize: 10,
    total: 10,
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无相关信息'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGiftList()
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
    this.data.pageNum++
    if (Math.ceil(this.data.total / 10) > (this.data.pageNum - 1)) {
      this.getGiftList()
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  getGiftList() {
    var that = this
    let params = {
      userId: app.globalData.userInfo.id,
      storeId: app.globalData.userInfo.storeId,
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    }
    app.gift.pageGiftOrder(params, app.globalData.token).then(res => {
      // console.log(res.data.data.list)
      if (res.data.success == true) {
        var a = that.data.giftList
        if (that.data.pageNum == 1) {
          that.setData({ giftList: res.data.data.list })
        } else {
          that.setData({ giftList: a.concat(res.data.data.list) })
        }
        that.setData({
          // giftList: res.data.data.list,
          total: res.data.data.total
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  giftDetail(e) {
    // console.log(e.currentTarget.dataset.index)
    console.log(this.data.giftList[e.currentTarget.dataset.index].id)
    wx.navigateTo({
      url: '/pages/giftStatue/giftStatue?id=' + this.data.giftList[e.currentTarget.dataset.index].id + '&orderId=' + this.data.giftList[e.currentTarget.dataset.index].orderId,
    })
  }

})