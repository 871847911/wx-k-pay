// pages/addQuestionForS/addQuestionForS.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无相关信息'
    },
    questionList: [],
    pageNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.MyQuestionWX()
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageNum++
    if (Math.ceil(this.data.total / 10) > (this.data.pageNum - 1)) {
      this.MyQuestionWX()
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  MyQuestionWX() {
    var that = this;
    let params = {
      storeId: app.globalData.userInfo.storeId,
      questionerId: app.globalData.userInfo.id,
      // storeId: 1,
      // questionerId: 1,
      pageNum: that.data.pageNum,
      pageSize: 10
    }
    app.question.MyQuestionWX(params, app.globalData.token).then(res => {
      console.log(res.data.data.list)
      var a = that.data.questionList
      // that.setData({ questionList: a.concat(res.data.rows) })
      if (that.data.pageNum == 1) {
        that.setData({ questionList: res.data.data.list })
      } else {
        that.setData({ questionList: a.concat(res.data.data.list) })
      }
      that.setData({ total: res.data.data.total })
    })
  },

  toQuestionDetail(e) {
    let questionIndex = e.currentTarget.dataset.index
    let questionId = this.data.questionList[questionIndex].id
    let answerId = this.data.questionList[questionIndex].lecturerId
    let createUser = this.data.questionList[questionIndex].questionerName
    console.log(questionIndex)
    console.log(this.data.questionList[questionIndex].questionStatus)
    wx.navigateTo({
      url: '/pages/questionDetail/questionDetail?' + 'id=' + questionId,
    })
  },

  toAddQuestion() {
    wx.navigateTo({
      url: '/pages/lecturerList/lecturerList'
    })
  },
})