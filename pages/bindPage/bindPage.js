// pages/bindPage/bindPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    bind_des: null,
    imageSrc:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.phone) {
      this.setData({
        phone: options.phone,
        bind_des: options.state,
        imageSrc: options.state == 1 ? '../../images/succeed@2x.png' :'../../images/failed@2x.png'
      })
      
    }
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
    this.setTitle()
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
  setTitle(){
    console.log(this.data.bind_des)
    wx.setNavigationBarTitle({
      title: this.data.bind_des ? '绑定成功' : '绑定失败'
    })
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })

  }

})