// pages/courseBuyed/courseBuyed.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无课程，快去逛逛吧'
    },
    courseDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.apis.user('pageCourse', {
        page: 1,
        size: 10
    }, app.globalData.token)
      .then(res => {
        console.log('已购课程', res)
        this.setData({ courseDetail: res.data.data})
      })
  },

  goDetail(e) {
    console.log('eeee', e, '../noBuyCourseDetails/noBuyCourseDetails?courseId=' + e.detail.courseId + "&page=courseBuyed")
    wx.navigateTo({
      url: `/pages/${e.detail.type}/${e.detail.type}?courseId=${e.detail.courseId}&page=courseBuyed`
    })
  }
})