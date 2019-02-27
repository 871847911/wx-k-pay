// pages/payPage/payPage.js
const app = getApp()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [0],
    index: 0,
    ifAll: false,
    visible3: false,
    actions3: [{
        name: '返回首页',
      },
      {
        name: '查看订单',
        color: '#6CDDC7'
      }
    ],
    img: '',
    price: '',
    title: '',
    courseId: '',
    orderId: '',
    saveMoney: 0,
    jifen: 0,
    id:'',
    leavePay:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    const {
      price,
      img,
      title,
      orderId = "",
      courseId,
      discountType
    } = JSON.parse(options.param)
    this.setData({
      price,
      img,
      title,
      orderId,
      courseId,
      discountType,
      shouldPay: price.toFixed(2),
      param: options.param
    })
    this.getPayInfo();
    //第一次进入
    if (this.data.orderId == '') {

    }

  },
  pay() {
    that.createrOrder();
    
  },
  handleClick3({
    detail
  }) {
    const index = detail.index;
    // this.setData({
    //   visible3: false
    // })
    console.log(index)
    if (index == 0) {
      wx.switchTab({
        url: '/pages/index/index',
      })
      console.log('xxxxx')
    } else {
      wx.redirectTo({
        url: '/pages/orderDetail/orderDetail?',
      })
    }
  },
  switchChange: function(e) {
    console.log("switchChange==>", e.detail.value);
    that.setData({
      ifAll: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    console.log("积分", e.detail.value)
    that.setData({
      jifen: that.data.array[e.detail.value],
      index: e.detail.value,
      saveMoney: e.detail.value,
      shouldPay: (that.data.price - e.detail.value).toFixed(2)
    })
    
  },
  //查询支付可使用积分情况

  getPayInfo: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/score/getPayInfo",
      data: {},
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        // console.log("PayInfo==>", res)
        var userTotalScore = res.data.data.userTotalScore; //可用
        var orderAmountPro = res.data.data.orderAmountPro; //最高折扣
        var value = res.data.data.value //抵扣一元所需积分
        var price = that.data.price;
        that.getPointsArr(price, orderAmountPro, value, userTotalScore);
        that.setData({
          isOpen: res.data.data.isOpen,
          userTotalScore:userTotalScore,
          dikou: parseInt(userTotalScore / value)
        })
      }
    })
  },
  //计算可以用积分列表
  getPointsArr: function(price, maxPriceRate, oneYuanScore, availableScore) {
    var arr = [];
    //先算价格可以抵扣金额(100,0.5) s所需积分   100*50/100*200

    var pricePont = (price-1) * maxPriceRate / 100 * oneYuanScore
    //与可用积分，做比较，谁小选谁
    if (pricePont > oneYuanScore) { //可用 积分必须大于抵扣一元积分
      if (pricePont > availableScore) {
        var cout = parseInt(availableScore / oneYuanScore);
        console.log("cout==>", cout)

        for (var i = 0; i <= cout; i++) {
          arr.push(i * oneYuanScore)
        }
      } else {
        var cout = parseInt(pricePont / oneYuanScore);
        console.log("cout==>", cout)

        for (var i = 0; i <= cout; i++) {
          arr.push(i * oneYuanScore)
        }
      }
      console.log("arr==>", arr);
      that.setData({
        array: arr
      })
    }

  },
  //创建订单
  createrOrder: function() {
    console.log("jifen", that.data.jifen)
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.httpUrl + "/app/course/order/createOrder",
      data: {
        productId: that.data.courseId,
        score: that.data.jifen,
        discountType: that.data.discountType
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("创建订单", res)
        that.setData({
          id: res.data.data.id,
          leavePay:false
        })
        that.createUnifyOrder(res.data.data.wechatOrderId)
      }
    })
  },
  //创建预付id
  createUnifyOrder: function(wechatOrderId) {
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

      success: function(res) {
        wx.hideLoading();
        console.log("预付订单", res)
        var msg = res.data.data;
        wx.requestPayment({
          'timeStamp': msg.timeStamp,
          'nonceStr': msg.nonceStr,
          'package': msg.package,
          'signType': 'MD5',
          'paySign': msg.paySign,
          'success': function(res) {
            console.log("支付成功", res)
            that.goOrderDetail();
          },
          'fail': function(res) {
            console.log("支付失败",res)
            that.goOrderDetail();
          },
          'complete': function(res) {
            
          }
        })
      }
    })
  },
  //跳转订单详情orderId =id
  goOrderDetail:function(){
    wx.redirectTo({
      url: '../orderDetail/orderDetail?orderId='+that.data.id,
    })
  },
  onUnload:function(){
    if (this.data.leavePay){
      wx.showModal({
        content: '放弃支付？',
        cancelText: "放弃",
        confirmText: "我在想想",
        confirmColor: "#6CDDC7",
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../payPage/payPage?param=' + that.data.param,
            })
          }
        }
      })
    }
  }
})