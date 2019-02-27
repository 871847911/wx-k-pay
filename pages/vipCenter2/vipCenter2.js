// pages/vipCenter2/vipCenter2.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    baifenbi: '',
    nickName: '',
    sale:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.getVipInfo();
    this.getViplev();
    this.getVipPrivilege()
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
  //获取vip信息
  getVipInfo: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/vip/getVipInfo",
      data: {},
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("vip", res);
        var baifenbi = res.data.data.grow / (res.data.data.gap + res.data.data.grow) * 100
        that.setData({
          info: res.data.data,
          baifenbi: baifenbi,
          nickName: app.globalData.userInfo.nickName
        })
      }
    })
  },
  getViplev: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/vip/listLevel",
      data: {},
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("vip==>", res)
        var list = res.data.data;
        var listLev = [];

        for (var i = 0; i < list.length; i++) {
          var levlev = {
            growMin: '',
            level: "",
            levelName: ""
          }
          levlev.growMin = list[i].growMin;
          levlev.level = list[i].level;
          levlev.levelName = list[i].levelName.split(".")[1];
          listLev.push(levlev);
        }
        that.setData({
          listLev: listLev,
        })
      }
    })
  },
  goGrowthValue: function() {
    wx.navigateTo({
      url: '../growthValue/growthValue?grow=' + that.data.info.grow,
    })
  },
  //获取会员特权
  getVipPrivilege: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/vip/getVipPrivilege",
      data: {},
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("会员特权",res);
        if (res.data.data.sale!=null){
          that.setData({
            sale:true
          })
        }
      }
    })
  }
})