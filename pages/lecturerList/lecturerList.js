// pages/myBasicSet/myBasicSet.js
const app = getApp()
Page({
  data: {
    pageNum: 1,
    lecturerList: [],
    total: '',
    lecturerName: '',
    lecturerId: '',
    arr1: [1,2,3],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (app.globalData.roleId  == 3){
    //   this.getLecturerList()
    // }else{
      this.listExceptMe()
    // }
    
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
    if (Math.ceil(this.data.total / 10) > (this.data.pageNum - 1)) {
      this.data.pageNum++;
      this.getLecturerList()
    }else{
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

  getLecturerList() {
    var that = this;
    app.apis.lecturer('page', {
      page: that.data.pageNum,
      size: 10
    }, app.globalData.token).then(res => {
      console.log(res)
      console.log(res.data.data.list)
      var a = that.data.lecturerList
      if (that.data.pageNum == 1){
        that.setData({ lecturerList: res.data.data.list })
      }else {
        that.setData({ lecturerList: a.concat(res.data.data.list) })
      }
      that.setData({ total: res.data.data.total })
      if (that.data.pageNum != 1) {
        wx.stopPullDownRefresh()
      }
    })
  },

  listExceptMe() {
    var that = this;
    app.question.listExceptMe( {
      storeId: app.globalData.userInfo.storeId,
      id: app.globalData.userInfo.id,
      pageNum: that.data.pageNum,
      pageSize: 10
    }, app.globalData.token).then(res => {
      console.log(res)
      console.log(res.data.list)
      var a = that.data.lecturerList
      if (that.data.pageNum == 1) {
        that.setData({ lecturerList: res.data.data.list })
      } else {
        that.setData({ lecturerList: a.concat(res.data.data.list) })
      }
      that.setData({ total: res.data.data.total })
      if (that.data.pageNum != 1) {
        wx.stopPullDownRefresh()
      }
    })
  },

  toAddQuestionTitle(e) {
    let lecturerIndex = e.currentTarget.dataset.index
    this.setData({ lecturerName: this.data.lecturerList[lecturerIndex].realName })
    this.setData({ lecturerId: this.data.lecturerList[lecturerIndex].id })
    wx.navigateTo({
      url: '/pages/addQuestionTitle/addQuestionTitle?lecturerId=' + this.data.lecturerId + '&lecturerName=' + this.data.lecturerName,
    })
  }

})