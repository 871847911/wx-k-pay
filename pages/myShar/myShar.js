// pages/courseBuyed/courseBuyed.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyJson: {
      imgUrl: '/images/share@2x.png',
      des: '暂无课程，快去逛逛吧'
    },
    courseDetail: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.token)
    var page = 1
    var size = 10
    var userId = app.globalData.userInfo.id
    app.question.getCourseByOpenId(page, size, userId, {

    }, app.globalData.token, "POST")
      .then(res => {
        
        this.setData({
          courseDetail: res.data.data.list
        })
        console.log(this.data.courseDetail)
      })


    // app.apis.user('pageCourse', {
    //   page: 1,
    //   size: 10
    // }, app.globalData.token)
    //   .then(res => {
    //     console.log('已购课程', res.data.data)
    //     this.setData({ courseDetail: res.data.data })
    //   })
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
    console.log('eeee', e)
    wx.navigateTo({
      url: `/pages/sharingProgress/sharingProgress?courseId=${e.detail.courseId}`,
    })
  }
})