// pages/myPublish/myPublish.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // publishDetail: {},
    courseManage:[],
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无发布'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //我的发布
    // app.apis.user('pagePublish', {
    //     page: 1,
    //     size: 100
    // }, app.globalData.token)
    //   .then(res => {
    //     console.log('我的发布',res)
    //     this.setData({ publishDetail: res.data.data})
    //   })
    app.apis.user('pageCourseManage', {
      page: 1,
      size: 10,
      status: 31
    }, app.globalData.token)
      .then(res => {

        this.setData({ courseManage: res.data.data })
      })
  },
  goDetail(e) {
    console.log(e)
    var page = 'courseBuyed'
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.listtype}/${e.currentTarget.dataset.listtype}?page=${page}&courseId=${e.currentTarget.dataset.courseid}`
    })
  },
  goManage:function(){
    wx.navigateTo({
      url: '../courseManage/courseManage',
    })
  }
})