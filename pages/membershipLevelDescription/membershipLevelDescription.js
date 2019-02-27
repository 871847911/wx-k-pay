// pages/membershipLevelDescription/membershipLevelDescription.js
var app = getApp();
var that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks: ["1", "20", "300","4000","50000"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.getViplev()
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
  getViplev:function(){
    wx.request({
      url: app.globalData.httpUrl + "/app/vip/listLevel",
      data: {},
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function (res) {
        console.log("vip==>",res)
        var list = res.data.data;
        var listLev = [];
        
        for(var i = 0 ;i< list.length;i++){
          var levlev = { growMin: '', level: "", levelName:""}
          levlev.growMin = list[i].growMin;
          levlev.level = list[i].level;
          levlev.levelName = list[i].levelName.split(".")[1];
          listLev.push(levlev);
        }
        that.setData({
          listLev: listLev
        })
      }})
  }
})