// pages/settlement/settlement.js
var that ;
var app = getApp();
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
    that= this;
    console.log(options)
    const {
      price,
      img,
      title,
      orderId = "",
      courseId,
      // discountType
    } = JSON.parse(options.param)
    this.setData({
      price,
      img,
      title,
      orderId,
      courseId,
      // discountType,
  
    })
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
  //创建订单
  createrOrder: function () {
 
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.httpUrl + "/app/column/createOrder",
      data: {
        productId: that.data.courseId,
        // discountType: that.data.discountType
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function (res) {
        console.log("创建订单", res)
        that.setData({
          id: res.data.data.id
        })
        that.createUnifyOrder(res.data.data.wechatOrderId)
      }
    })
  },
  //创建预付id
  createUnifyOrder: function (wechatOrderId) {
    wx.request({
      url: app.globalData.httpUrl + "/app/order/createUnifyOrder",
      data: {
        wechatOrderId: wechatOrderId,

      },
      header: {
        "userToken": app.globalData.token,
        'content-type': 'application/x-www-form-urlencoded'

      },
      method: "POST",

      success: function (res) {
        wx.hideLoading();
        console.log("预付订单", res)
        var msg = res.data.data;
        wx.requestPayment({
          'timeStamp': msg.timeStamp,
          'nonceStr': msg.nonceStr,
          'package': msg.package,
          'signType': 'MD5',
          'paySign': msg.paySign,
          'success': function (res) {
            console.log("支付成功", res)
            that.goOrderDetail();
          },
          'fail': function (res) {
            console.log("支付失败", res)
            that.goOrderDetail();
          },
          'complete': function (res) { }
        })
      }
    })
  },
  //跳转订单详情orderId =id
  goOrderDetail: function () {
 
      wx.navigateTo({
        url: '../orderDetail/orderDetail?orderId='+that.data.id,
      })
  
  }
})