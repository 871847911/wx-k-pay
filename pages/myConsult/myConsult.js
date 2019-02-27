const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consultList: [],
    emptyJson: {
      imgUrl: '/images/No_message@2x.png',
      des: '暂无咨询'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.apis.user('pageConsult', {
      page: 1,
      size: 10
    }, app.globalData.token).then(res => {
      console.log('我的咨詢', res)
      this.setData({ consultList: res.data.data})
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
  goDetail(e) {
    const Type = e.detail.type;
    // if (Type != 'message_2') {
    //   wx.navigateTo({
    //     url: `/pages/messageDetail/messageDetail?type=${Type}`
    //   })
    // }
    wx.navigateTo({
      url: `/pages/messageDetail/messageDetail?type=${Type}&consultId=${e.detail.consultId}&courseId=${e.detail.courseId}`
    })
  }
})