// pages/myBasicSet/myBasicSet.js
var utils = require("../../utils/util")
import { $init, $digest } from '../../utils/common.util'
const app = getApp()
var timerNum = 0;
var timer
Page({
  data: {
    switchValue: false,
    token: '',
    key: '',
    count: 0,
    images: [],
    questionTitle: '',
    questionCont: '',
    questionLength: '',
    lecturerId: '',
    answerId: '',
    courseId: null,
    showSubmit: true,
    courseId: null,
    temp: '',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ 
      questionTitle: options.title,
      courseId: options.courseId,
      lecturerId: options.lecturerId
    })
    $init(this)
    var that = this;
    app.apis.store('getUploadToken', {}, app.globalData.token).then(res => {
      that.setData({
        token: res.data.data.uptoken ,
        temp: res.data.data.tempDomain
      })
      console.log(that.data.token)
    });

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
    clearTimeout(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timer);
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

  switchChange(e) {
    this.setData({ switchValue: e.detail.value })
    console.log(this.data.switchValue)
    console.log('switch 发生 change 事件，携带值为', e.detail.value)
  },

  getQuestionCont(e) {
    this.setData({ questionLength: e.detail.cursor })
    this.setData({ questionCont: e.detail.value })
  },

  submitQuestion() {
    var that = this
    if (this.data.questionCont.length < 20) {
      wx.showToast({
        title: '请输入至少二十个字',
        icon: 'none',
        duration: 2000
      })
    }else{
      that.setData({ showSubmit: false })
      if (that.data.courseId != 'null') {
        var params = {
          // serialNum: 1,
          questionerType: app.globalData.roleId == 3 ? 0 : 1,   //app.globalData.roleId==3?消费者(0):(1)
          questionerId: app.globalData.userInfo.id,
          // questionerId: 1,
          storeId: app.globalData.userInfo.storeId,
          // storeId: 1,
          lecturerId: that.data.lecturerId,
          // lecturerId: 2,
          title: that.data.questionTitle.trim(),
          describe: that.data.questionCont.trim(),
          status: 0, //0:带解答； 1：已解答 
          anonymity: that.data.switchValue == true ? 1 : 0,
          courseId: this.data.courseId,
          picUrls: that.data.images,
          createUser: app.globalData.userInfo.nickName,
        }
      }else{
        var params = {
          // serialNum: 1,
          questionerType: app.globalData.roleId == 3 ? 0 : 1,   //app.globalData.roleId==3?消费者(0):(1)
          questionerId: app.globalData.userInfo.id,
          // questionerId: 1,
          storeId: app.globalData.userInfo.storeId,
          // storeId: 1,
          lecturerId: this.data.lecturerId,
          // lecturerId: 2,
          title: that.data.questionTitle.trim(),
          describe: that.data.questionCont.trim(),
          status: 0, //0:带解答； 1：已解答 
          anonymity: that.data.switchValue == true ? 1 : 0,
          // courseId: that.data.courseId,
          picUrls: that.data.images,
          createUser: app.globalData.userInfo.nickName,
        }
      }
      app.question.saveQuestionAndPics(params, app.globalData.token).then(res => {
        console.log(res.data.status)
        if (res.data.success == true){
          that.Countdown()
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000
          })
        }else{
          that.setData({ showSubmit: true })
          wx.showToast({
            title: '提交失败,请重试',
            icon: 'none',
            duration: 2000
          })
        }
        
      })
    }
    
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    $digest(this)
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        console.log(images)
        this.data.images = images.length <= 3 ? images : images.slice(0, 3)
        $digest(this)
      }
    })
  },
  choosePic() {
    var that = this;
    wx.chooseImage({
      count: 3 - that.data.images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log(res)
        console.log(tempFilePaths.length)
        for (var i = 0; i < tempFilePaths.length; i++) {
          that.uploadImg(tempFilePaths, i)
        }
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },


  uploadImg(tempFilePaths, i) {
    var that = this
    utils.upDataKey(tempFilePaths[i]).then(rest => {
      wx.uploadFile({
        url: 'https://up.qbox.me',
        filePath: tempFilePaths[i],
        name: 'file',
        formData: {
          'token': that.data.token,
          'accept': 'text/plain',
          'key': rest
        },
        success: function (res) {
          that.data.images.push('http://' + that.data.temp +'/' + rest )
          that.data.images = that.data.images.length <= 3 ? that.data.images : that.data.images.slice(0, 3)
          console.log(that.data.images)
          $digest(that)
        },
        fail: function (res) { }
      })
    })
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  Countdown: function () {
    var that = this
    timer = setTimeout(function () {
      if (timerNum == 2) {
        that.setData({ showSubmit: true })
        clearTimeout(timer);
        wx.navigateTo({
          url: '/pages/questionAndAnswer/questionAndAnswer',
        })
      } else {
        timerNum++
        that.Countdown()
      }
    }, 1000)
  }

})