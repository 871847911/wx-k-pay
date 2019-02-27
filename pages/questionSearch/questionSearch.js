// pages/questionSearch/questionSearch.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchHistory: [],
    inputValue: '',
    searchList: [],
    pageNum: 1,
    isEmpty: false,
    hasSearch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'searchHistory',
      success: function (res) {
        console.log(res.data)
        that.setData({ searchHistory: res.data })
      },
    })
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

  queryQuestion() {
    var that = this;
    let params = {
      storeId: app.globalData.userInfo.storeId,
      // questionerId: app.globalData.userInfo.id,
      // storeId: 1,
      pageNum: that.data.pageNum,
      pageSize: 10,
      title: that.data.inputValue
    }
    app.question.queryQuestion(params, app.globalData.token).then(res => {
      console.log(res.data)
      if (res.data.data.list.length == 0) {
        that.setData({ isEmpty: true })
      }
      that.setData({ searchList: res.data.data.list, hasSearch: true  })
    })
  },

  toSearchResult() {
    var a = this.data.searchHistory
    a.push(this.data.inputValue)
    this.setData({ searchHistory: a })
    console.log(this.data.searchHistory)
    wx.setStorage({
      key: 'searchHistory',
      data: this.data.searchHistory,
    })
    this.queryQuestion()
  },
  
  clearHistory() {
    var that = this;
    wx.removeStorage({
      key: 'searchHistory',
      success: function(res) {
        that.setData({ searchHistory: [] })
      },
    })
  },

  inputValue(e) {
    this.setData({ inputValue: e.detail.value })
  },

  getSearchValue(e) {
    console.log(e.currentTarget.dataset.index)
    console.log(this.data.searchHistory[e.currentTarget.dataset.index])
    var that = this;
    let params = {
      storeId: app.globalData.userInfo.storeId,
      // questionerId: app.globalData.userInfo.id,
      // storeId: 1,
      pageNum: that.data.pageNum,
      pageSize: 10,
      title: this.data.searchHistory[e.currentTarget.dataset.index]
    }
    app.question.queryQuestion(params, app.globalData.token).then(res => {
      console.log(res.data)
      if (res.data.data.list.length == 0) {
        that.setData({ isEmpty: true })
      }
      that.setData({ searchList: res.data.data.list, hasSearch: true })
    })
  },

  toQuestionDetail(e) {
    let questionIndex = e.currentTarget.dataset.index
    let questionId = this.data.searchList[questionIndex].id
    let answerId = this.data.searchList[questionIndex].lecturerId
    let createUser = this.data.searchList[questionIndex].questionerName
    console.log(questionIndex)
    console.log(this.data.searchList[questionIndex].questionStatus)
    wx.navigateTo({
      url: '/pages/questionDetail/questionDetail?' + 'id=' + questionId,
    })
  },


})