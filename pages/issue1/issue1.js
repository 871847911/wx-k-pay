// pages/issue/issue.js
var app = getApp();
var that;
const innerAudioContext = wx.getBackgroundAudioManager();
var audioUrl;
import {
  audio
} from '../../utils/playAudio.js';
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    introduction: {},
    time:"00:00"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.getDetalis(options.contentId);
    innerAudioContext.onTimeUpdate(() => {
      if (innerAudioContext.src == that.data.introduction.columnUrl) {
        var durations = innerAudioContext.duration
        that.setData({
          time: that.stotime(durations)
        })
      }

    })
  },
  stotime: function (s) { //转换分秒
    let t = '';
    if (s > -1) {
      let min = Math.floor(s / 60) % 60;
      let sec = Math.ceil(s % 60);
      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
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
    // //对比与缓存中音频地址是否相同 

    // if (audio.ifAudioUrlSame(app.globalData.audioUrl, that.data.introduction.audioUrl)) {
    //   console.log("相同", audio.ifAudioUrlSame(app.globalData.audioUrl, that.data.introduction.audioUrl));
    //   if (innerAudioContext.paused == false) { //播放状态通过判断
    //     this.setData({
    //       isPlay: true
    //     })
    //   }
    // }else{
    //   console.log("不同", audio.ifAudioUrlSame(app.globalData.audioUrl, that.data.introduction.audioUrl));
    //   console.log(app.globalData.audioUrl)
    //   console.log(that.data.introduction.audioUrl)

    // }

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
  //获取专栏内容
  getDetalis: function(contentId) {
    wx.request({
      url: app.globalData.httpUrl + "/app/column/getContent",
      data: {
        contentId: contentId
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("专栏内容",res)
        var content = res.data.data.content
        if (content != null) {
          content = content.replace(/<img /g, '<img style="max-width:100%;height:auto" ')
          // console.log("content===>", content);
        }
        that.setData({
          introduction: res.data.data,
          content: content
        })
        //对比与缓存中音频地址是否相同 
        if (audio.ifAudioUrlSame(app.globalData.audioUrl, that.data.introduction.audioUrl)) {
          if (innerAudioContext.paused == false) { //播放状态通过判断
            that.setData({
              isPlay: true
            })
          }
        } else {
          if (innerAudioContext.paused == true || innerAudioContext.paused == null) {
            audio.SaveAudioUrl(res.data.data.audioUrl);
          }
        }

      }
    })
  },
  //播放音频
  playAudio: function() {
    if (innerAudioContext.src == null) {
      innerAudioContext.title = that.data.introduction.audioName
      innerAudioContext.epname = that.data.introduction.audioName
      innerAudioContext.src = that.data.introduction.audioUrl;
      innerAudioContext.duration;
    } else {
      if (innerAudioContext.src != that.data.introduction.columnUrl) { //切换并储存url
        innerAudioContext.title = that.data.introduction.audioName
        innerAudioContext.epname = that.data.introduction.audioName
        innerAudioContext.src = that.data.introduction.audioUrl;
        console.log("innerAudioContext.title", innerAudioContext.title)
        audio.SaveAudioUrl(that.data.introduction.audioUrl);
        var time = util.stotime(innerAudioContext.duration)
        that.setData({
          time: time
        })
      } else {
        innerAudioContext.play();
      }
    }

    that.setData({
      isPlay: true
    })
  },
  //暂停播放
  stopPlay: function() {
    innerAudioContext.pause();
    console.log('暂停播放')
    that.setData({
      isPlay: false
    })
  },
  // 上拉弹窗
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
})