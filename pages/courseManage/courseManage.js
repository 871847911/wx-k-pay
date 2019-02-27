// pages/courseManage/coureseManage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无课程'
    },
    index: 0,
    courseManage:{
      list:[]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log(app)
    this.init( )
  },

  init ( that) {
    var index = parseInt(this.data.index)
    app.apis.user('pageCourseManage', {
      page: 1,
      size: 10,
      status: index != 3 ? (index + 1) + '0' : 31
    }, app.globalData.token)
    .then(res => {
     
      this.setData({ courseManage: res.data.data })
    })
  },
  clickTab(e) {
    var idx = e.currentTarget.dataset.idx;
    this.setData({ index: idx }, ()=>{
      this.init()
    })
  },
  goDetail(e) {
    console.log(e)
    var page = 'courseManage'
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.listtype}/${e.currentTarget.dataset.listtype}?courseId=${e.currentTarget.dataset.courseid}&page=${page}`
    })
  }
})