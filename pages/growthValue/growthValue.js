// pages/growthValue/growthValue.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ["全部", "获取", "支出"],
    grow:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.setData({
      grow: options.grow
    })
    this.getRecord();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获得成长记录 
  getRecord: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/vip/pageRecord",
      data: {
        page:1,
        size:1000
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("成长值记录",res)
        that.setData({
          list:res.data.data.list
        })
      }
    })
  },
  goMissionCenter:function(){
    wx.navigateTo({
      url: '../missionCenter/missionCenter?intent=vip',
    })
  }
})