// pages/courseBuyed/courseBuyed.js
var app = getApp()
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无课程，快去逛逛吧'
    },
    courseDetail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.group.getShareCourses( {
      page:1,
      size:100,
      storeId: app.globalData.storeId 
    }, app.globalData.token, "POST")
      .then(res => {
        console.log(res)
        this.setData({
          courseDetail: res.data.data.list
        })
      })
  },

 
  goDetail(e) {
    console.log('eeee', e.currentTarget.dataset.courseid)
    wx.navigateTo({
      url: `/pages/courseDetail/courseDetail?courseId=${e.currentTarget.dataset.courseid}`,
    })
  }
})