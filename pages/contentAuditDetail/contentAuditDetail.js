// pages/contentAuditDetail/contentAuditDetail.js
var util = require("../../utils/util.js")
var app = getApp();
var that;
var innerAudioContext = wx.getBackgroundAudioManager();
import {
  audio
} from '../../utils/playAudio.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    time: "00:00",
    all: {},
    content: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log("是否", innerAudioContext.paused)

    this.setData({
      contentId: options.contentId
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
    that = this;
    if (app.globalData.token) {
      this.getDetals(that.data.contentId)
    } else {
      app.checkAuth(() => {
        this.getDetals(that.data.contentId)
      });
    }
    var getBackgroundAudioManager = wx.getBackgroundAudioManager();
    getBackgroundAudioManager.onTimeUpdate(() => {
      if (getBackgroundAudioManager.src == that.data.all.audioUrl ) {
        var durations = getBackgroundAudioManager.duration
        that.setData({
          time: that.stotime(durations)
        })
      }

    })
  },
  stotime: function(s) { //转换分秒
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

  //获取详情
  getDetals: function(contentId) {
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
        console.log(res)
        // innerAudioContext.src = res.data.data.audioUrl;
        var content = res.data.data.content;
        content = content.replace(/<img /g, '<img style="max-width:100%;height:auto" ')
        that.setData({
          all: res.data.data,
          content: content

        })
        //对比与缓存中音频地址是否相同 
        if (audio.ifAudioUrlSame(app.globalData.audioUrl, that.data.all.audioUrl)) {
          console.log("shi", app.globalData.audioUrl, that.data.all.audioUrl)
          if (innerAudioContext.paused == false) { //播放状态通过判断
            console.log(innerAudioContext.paused)
            that.setData({
              isPlay: true
            })
          }
        } else {
          console.log("fou", app.globalData.audioUrl, that.data.all.audioUrl)
          if (innerAudioContext.paused == true || innerAudioContext.paused == null) {
            audio.SaveAudioUrl(that.data.all.audioUrl);
            console.log(innerAudioContext.paused)
          }
        }
      }
    })
  },
  //播放音频
  playAudio: function() {
    if (innerAudioContext.src == null) {
      innerAudioContext.title = that.data.all.audioName;
      innerAudioContext.src = that.data.all.audioUrl;

    } else {
      if (innerAudioContext.src != that.data.all.audioUrl) { //切换并储存url
        innerAudioContext.title = that.data.all.audioName;
        innerAudioContext.src = that.data.all.audioUrl;
        audio.SaveAudioUrl(that.data.all.audioUrl);
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
    console.log("noplay", innerAudioContext.src)
    innerAudioContext.pause();
    console.log('暂停播放')
    that.setData({
      isPlay: false
    })
  },
})