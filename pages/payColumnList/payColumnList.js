// pages/payColumnList/payColumnList.js
var app = getApp();
var that ;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    columnLis:[],
    emptyJson: {
      imgUrl: '/images/mycloumn.png',
      des: '暂无专栏，快去逛逛吧'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.getColumnList(1);
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
    if (!that.data.isLastPage){
      page = page +1;
      that.getColumnList(page)
    }else{
      wx.showToast({
        title: '已加载最多',
        icon: "none"
      })
     
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取专栏列表
  getColumnList: function (page) {
    wx.request({
      url: app.globalData.httpUrl + "/app/column/page",
      data: {
        page:page,
        size:10
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("getColumnList==>", res);
        if (res.data.data.list !=null){
          var list = res.data.data.list;
          for(var i =0 ; i<list.length ; i++){
            switch (list[i].updateType ){
              case "1":
                list[i].updateType ="每日";
                break;
              case "2":
                list[i].updateType = "每";
                break;
              case "3":
                list[i].updateType = "每月";
                break;
            }
          }
          var newList = that.data.columnLis;
          for (var i = 0; i < list.length;i++){
            newList.push(list[i]);
          }
          that.setData({
            columnLis: newList,

            isLastPage: res.data.data.isLastPage
          })
        }
       
      }
    })

  },
  //跳转专栏详情
  goDetali:function(e){
    console.log(e.currentTarget.dataset.id);
    var columnId = that.data.columnLis[e.currentTarget.dataset.id].productId;
    wx.navigateTo({
      url: '../payColumnDetail/payColumnDetail?columnId=' + columnId,
    })
  }
 

})