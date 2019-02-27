// pages/myFans/myFans.js
var app = getApp();
var that;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fans: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.getFans(1);
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
    if (that.data.isLastPage){
      wx.showLoading({
        title: '已经加载最多',
        icon:"none"
      })
    }else{
      page = page +1;
      that.getFans(page);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  getFans: function(page) {
    wx.request({
      url: app.globalData.httpUrl + "/app/user/pageLecturerFans",
      data: {
        page: page,
        size:10
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        var fans = that.data.fans;
        var list = res.data.data.list;
        for(var i = 0 ; i < list.length;i++){
          fans.push(list[i]);
        }
        console.log("fans==>",res.data.data);
        that.setData({
          total: res.data.data.total,
          fans: fans,
          isLastPage: res.data.data.isLastPage
        })
      }
    })
  }
})