// pages/sharingRules/sharingRules.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ruletitle: 'title',
    ruleMain: "contant",
    ruleName: "这里显示分享规则名称",
    appCourseShareDto:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    app.question.rule({
        courseId: options.courseId,
        userId: app.globalData.userInfo.id
    }, app.globalData.token)
      .then(res => {
        console.log(res.data.data)
        var shareCourseDTOS = res.data.data.shareCourseDTOS
        for (var i = 0; i < shareCourseDTOS.length; i++) {
          if (shareCourseDTOS[i].details != '') {
            shareCourseDTOS[i].details = Number(shareCourseDTOS[i].details).toFixed(0)
          }
        }
        console.log(shareCourseDTOS)
        this.setData({
          ruletitle: res.data.data.shareCourseRule.shareName,
          ruleMain: res.data.data.shareCourseRule.shareExplain,
          shareCourseDTOS: shareCourseDTOS,
          appCourseShareDto: res.data.data.appCourseShareDto
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
  onShareAppMessage: function() {

  },

})