// pages/myColumn/myColumn.js
var app= getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.getColumList()
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
  goContentAudit:function(){//跳转内容审核
    wx.navigateTo({
      url: '../contentAudit/contentAudit',
    })
  },
goColumAudit: function() {//跳转专栏审核
    wx.navigateTo({
      url: '../columAudit/columAudit',
    })
  },
  //获取专栏审核列表
  getColumList: function (){
    wx.request({
      url: app.globalData.httpUrl + "/app/column/pageByLecturer",
      data: {
        page:1,
        size:10,
        auditStatus:30
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function (res) {

        console.log(res);
        var list = res.data.data.list;
        for (var i = 0; i < list.length; i++) {
          switch (list[i].updateType) {
            case "1":
              list[i].updateType = "每日更新";
              break;
            case "2":
              list[i].updateType = "每周更新";
              break;
            case "3":
              list[i].updateType = "每月更新";
              break;
          }
        }
        that.setData({
          list:list
        })
      }})
  },
  go:function(e){
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../columDetalisByStudent/columDetalisByStudent?columnId=' + that.data.list[e.currentTarget.dataset.id].id,
    })
  }
})