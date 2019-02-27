// pages/myBasicSet/myBasicSet.js
const app = getApp()
Page({
  data: {
    textareaLength: 0,
    textareaCont: '',
    lecturerId: '',
    courseId: '',
    lecturerName: '',
    courseDetail: {}
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(options.courseId)
    this.setData({ 
      lecturerName: options.lecturerName,
      lecturerId: options.lecturerId,
      courseId: options.courseId ? options.courseId : null
    })
    // if (options.courseId != undefined){
    //   this.setData({ courseId: options.courseId })
    // }else{
    //   this.setData({ courseId: -1 })
    // }
    console.log(this.data.lecturerId, this.data.courseId)
    if (this.data.courseId != null) {
      this.getCourseDetail()
    }
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

  getTextareaLength(e) {
    this.setData({ textareaLength: e.detail.cursor })
    this.setData({ textareaCont: e.detail.value })
    // console.log(this.data.textareaCont)
  },

  toAddQuestionCont() {
    if (this.data.textareaLength < 10){
      wx.showToast({
        title: '请输入10-50个字符',
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.navigateTo({
        url: '/pages/addQuestionCont/addQuestionCont?title=' + this.data.textareaCont + '&lecturerId=' + this.data.lecturerId + '&courseId=' + this.data.courseId,
      })
    }
  },

  getCourseDetail() {
    var that = this
    app.apis.course('getDetail', {
      courseId: that.data.courseId,
    }, app.globalData.token).then(res => {
      that.setData({ courseDetail: res.data.data.courseMain })
      console.log('课程详情', res.data.data.courseMain)
    })
  },

 



})