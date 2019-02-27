// pages/myColumn/myColumn.js
var app= getApp();
var that;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLastPage:false,
    emptyJson: {
      imgUrl: '/images/mycloumn.png',
      des: '暂无订阅，快去逛逛吧'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.getColumList(1)
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
    if (!isLastPage){
      page = page +1
      that.getColumList(page)
    }else{
      wx.showToast({
        title: '已经是最后一页',
        icon:"none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取专栏审核列表
  getColumList: function (page){
    wx.request({
      url: app.globalData.httpUrl + "/app/column/pageByStudent",
      data: {
        page: page,
        size:10,
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
          list:list,
          isLastPage: res.data.data.isLastPage
        })
      }})
  },
  goDetalis:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../columDetalisByStudent/columDetalisByStudent?columnId=' + that.data.list[e.currentTarget.dataset.id].id,
    })
  }
})