// pages/creatGigeOrder/creatGigeOrder.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseDetail: {},
    orderInfo: {},
    creatWxOrder: {},
    courseId: 2,
    showPayButton: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ courseId: options.courseId })
    console.log(options.courseId)
    this.getCourseDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  getCourseDetail() {
    var that = this
    app.apis.course('getDetail', {
      courseId: that.data.courseId,
    }, app.globalData.token).then(res => {
      if (res.data.success == true) {
        that.setData({ courseDetail: res.data.data.courseMain })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  createOrder() {
    this.setData({ showPayButton: false })
    var that = this
    app.gift.createOrder( {
      productId: that.data.courseId,
    }, app.globalData.token).then(res => {
      // console.log(res.data)
      if (res.data.success == true) {
        that.setData({ orderInfo: res.data.data })
        that.createUnifyOrder()
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
      console.log(that.data.orderInfo)
    })
  },

  createUnifyOrder() {
    var that = this
    app.gift.createUnifyOrder({
      wechatOrderId: that.data.orderInfo,
    }, app.globalData.token).then(res => {
      // console.log(res.data)
      if (res.data.success == true) {
        that.setData({ creatWxOrder: res.data.data })
        that.wxPay()
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
      console.log(that.data.creatWxOrder)
    })
  },

  wxPay() {
    var that = this 
    wx.requestPayment(
      {
        'timeStamp': that.data.creatWxOrder.timeStamp,
        'nonceStr': that.data.creatWxOrder.nonceStr,
        'package': that.data.creatWxOrder.package,
        'signType': that.data.creatWxOrder.signType,
        'paySign': that.data.creatWxOrder.paySign,
        'success': function (res) {
          wx.showLoading({
            title: '加载中...',
          })
          that.setData({ showPayButton: true })
           console.log(res)
           that.buyGift()
          },
        'fail': function (res) { 
          that.setData({ showPayButton: true })
          wx.showToast({
            title: 支付失败,
            icon: 'none',
            duration: 2000
          })
         },
        'complete': function (res) { console.log('res===>', res) }
      })
  },

  buyGift() {
    var that = this
    app.gift.buyGift({
      storeId: app.globalData.userInfo.storeId,
      orderId: that.data.orderInfo,
    }, app.globalData.token).then(res => {
      console.log(res.data)
      if (res.data.success == true) {
        // console.log(that.data.courseId)
        wx.redirectTo({
          url: '/pages/payGiftOrder/payGiftOrder?courseId=' + that.data.courseId + '&id=' + that.data.orderInfo,
        })
      } else {
        wx.hideLoading()        
        wx.showToast({
          title: '支付异常，请联系客服',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

})