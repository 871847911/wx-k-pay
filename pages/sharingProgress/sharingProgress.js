// pages/courseBuyed/courseBuyed.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actions: [{
      name: '确定',
      color: '#00B4B9',
    }],
    modalText: 0,
    maxNum: '',
    nowNum: '',
    courseName:'',
    appCourseShareDto:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.courseId)
    this.setData({
      courseId: options.courseId
    })
    console.log(options)
    app.question.rule({
        courseId: options.courseId,
        userId: app.globalData.userInfo.id
    }, app.globalData.token)
      .then(res => {
        console.log(res.data.data)
        var shareCourseDTOS = res.data.data.shareCourseDTOS
        if (shareCourseDTOS){
          for (var i = 0; i < shareCourseDTOS.length; i++) {
            if (shareCourseDTOS[i].details != '') {
              shareCourseDTOS[i].details = Number(shareCourseDTOS[i].details).toFixed(0)
            }
          }
        }
        this.setData({
          maxNum: res.data.data.appShareCoursePriceDto.maxNum,
          nowNum: res.data.data.appShareCoursePriceDto.nowNum,
          modalText: res.data.data.appShareCoursePriceDto.nowNum,
          shareCourseDTOS: shareCourseDTOS,
          appCourseShareDto: res.data.data.appCourseShareDto,
          courseName: res.data.data.appCourseShareDto.courseName
        })

      })
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
  // onShareAppMessage: function () {

  // },
  tocourseDetial: function() {
    wx.navigateTo({
      url: `/pages/courseDetail/courseDetail?courseId=` + this.data.courseId,
    })
  },
  showTip: function() {
    this.setData({
      visible: true
    })
  },
  handleClose: function() {
    this.setData({
      visible: false
    })
  }
})