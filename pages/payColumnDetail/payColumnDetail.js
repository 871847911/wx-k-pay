// pages/payColumnDetail/payColumnDetail.js
var app = getApp();
var that;
var columnId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all: {},
    giftDilong: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      columnId : options.columnId
    })
    
  },

  onShow:function(){
    that.getDetalis(that.data.columnId);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取专栏内容
  getDetalis: function(columnId) {
    wx.request({
      url: app.globalData.httpUrl + "/app/column/get",
      data: {
        columnId: columnId
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log(res.data.data)
        var introduction = res.data.data.column.introduction;
        if (introduction != null) {
          introduction = introduction.replace(/<img /g, '<img style="max-width:100%;height:auto" ')
          console.log("introduction===>", introduction);
        }
        var all = res.data.data;
        switch (all.column.updateType) {
          case "1":
            all.column.updateType = "每日";
            break;
          case "2":
            all.column.updateType = "每";
            break;
          case "3":
            all.column.updateType = "每月";
            break;
        }
        that.setData({
          all: all,
          introduction: introduction
        })

      }
    })
  },
  goIssue: function() {//qv去跳转发刊词页面
    wx.navigateTo({
      url: '../issue/issue?columnId=' + that .data.columnId,
    })
  },
  goPay: function() {//去购买
    console.log("xxxx==>",that.data.all)
    if (that.data.all.isBuy){//如果已经购买那就不执行下面
      console.log(" 已购买")
     return;
    }
    if (that.data.all.validOrderId == null) {//未下订单
      var param = JSON.stringify({
        price: that.data.all.column.price,
        img: that.data.all.column.columnUrl,
        title: that.data.all.column.columnName,
        courseId: that.data.all.column.id,
        // discountType: discountType
      })
      wx.navigateTo({//跳转订单页面
        url: '../settlement/settlement?param=' + param,
      })
    }else{//已下订单未支付
      wx.navigateTo({
        url: '../orderDetail/orderDetail?orderId=' + that.data.all.validOrderId,
      })
    }
  },// 上拉弹窗
  showModal: function () {
    console.log("sssssss")
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

})