// pages/storeOrder/storeOrder.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    order:[],
    isOk:false,
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无订单，快去逛逛吧'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.getOrderList(1)

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  clickTab(e) {
    var idx = e.currentTarget.dataset.idx;
    console.log(idx)
    switch (idx){
      case 0:
        that.getOrderList(1);
        break;
      case 1:
        that.getOrderList(4);
        break;
      case 2:
        that.getOrderList(3);
        break;
      case 3:
        that.getOrderList(2);
        break;
    
    }
    this.setData({
      index: idx,
      isOk:false
    })
  },
  //
  getOrderList: function(channelType) {
    wx.showLoading({
      title: '正在加载中',
    })
    wx.request({
      url: app.globalData.httpUrl + "/app/user/pageStoreOrder",
      data: {
        page: 1,
        size: 100,
        channelType: channelType
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("getOrderList", res);
        that.setData({
          order:res.data.data.list
        }, res=>{
          wx.hideLoading();
          that.setData({
            isOk:true
          })
        })
      }
    })
  },
  goDetails:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../storeOrderDeatils/storeOrderDeatils?orderId=' + that.data.order[e.currentTarget.dataset.id].id,
    })
  }
})