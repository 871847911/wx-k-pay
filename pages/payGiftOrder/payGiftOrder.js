// pages/payGiftOrder/payGiftOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading()
    console.log(options)
    this.setData({ 
      courseId: options.courseId,
      id: options.id
    })
    this.getCourseDetail()
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
      path: '/pages/receiveGift/receiveGift?&id=' + this.data.id, //这里设定都是以"/page"开头,并拼接好传递的参数
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

  toIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  getCourseDetail() {
    var that = this
    app.apis.course('getDetail', {
      courseId: that.data.courseId,
    }, app.globalData.token).then(res => {
      if (res.data.success == true) {
        that.setData({ courseDetail: res.data.data.courseMain })
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },


})