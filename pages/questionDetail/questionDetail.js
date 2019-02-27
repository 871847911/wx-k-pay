
const app = getApp()
Page({
  data: {
    questionId: '',
    questionDetail: {},
    answerDetail: {},
    questionUrl: [],
    answerUrl: [],
    more: true,
    starNum: '',
    showStar: false,
    hasStar: false,
    courseDetail: {}
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ questionId: options.id })
    console.log(this.data.questionId)
    this.queryById()
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

  },

  queryById() {
    let that = this;
    app.question.queryById({ id: that.data.questionId, userId: app.globalData.userInfo.id }, app.globalData.token).then(res => {
      console.log(res.data.data)
      that.setData({ 
        questionDetail: res.data.data.questionAndAnswerDto,
        answerUrl: res.data.data.answerUrl == null ? [] : res.data.data.answerUrl,
        questionUrl: res.data.data.questionUrl == null ? [] : res.data.data.questionUrl,
        starNum: res.data.data.questionAndAnswerDto.starNum
      })
      if (res.data.data.questionAndAnswerDto.answerId != null && res.data.data.questionAndAnswerDto.answerId != '' && res.data.data.questionAndAnswerDto.starStatus == 1) {
        that.setData({ hasStar: true })
        that.setData({ showStar: false })
      }
      if (res.data.data.questionAndAnswerDto.answerId != null && res.data.data.questionAndAnswerDto.answerId != '' && res.data.data.questionAndAnswerDto.starStatus == null) {
        that.setData({ showStar: true })
        that.setData({ hasStar: false })
      }
    })
  },

  addStar() {
    var that = this
    let params = {
      answerId: that.data.questionDetail.answerId,
      userId: app.globalData.userInfo.id,
      lecturerId: that.data.questionDetail.lecturerId
    }
    app.question.addStar(params, app.globalData.token).then(res => {
      console.log(res.data.data.success)
      var a = that.data.starNum
      if(res.data.data.success == true) {
        var a = that.data.starNum
        that.setData({ starNum: a + 1, showStar: false, hasStar: true })
      }
      else{
        wx.showToast({
          title: '您已经为该回答点过赞了',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  hasAddStar() {
    wx.showToast({
      title: '您已经为该回答点过赞了',
      icon: 'none',
      duration: 2000
    })
  },

  more() {
    this.setData({ more: !this.data.more })
  },

  getCourseDetail() {
    var that = this
    app.apis.course('getDetail', {
      courseId: 4,
    }, app.globalData.token).then(res => {
      that.setData({ courseDetail: res.data.data.courseMain })
      console.log('课程详情', res.data.data.courseMain)
    })
  },

  toCourseDetail() {
    console.log(this.data.questionDetail.courseId)
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?courseId=' + this.data.questionDetail.courseId,
    })
  }

})