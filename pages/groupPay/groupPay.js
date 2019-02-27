// pages/groupPay/groupPay.js
const app = getApp()
var param
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: '',
    price: '',
    title: '',
    courseId: '',
    orderId: '',
    courseMain: '',
    leavePay: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var that = this
    param = options.param
    const {
      groupPrice,
      courseId,
      collageId
    } = JSON.parse(options.param)
    console.log()
    this.setData({
      courseId,
      groupPrice,
      collageId
    })
    if (JSON.parse(options.param).courseId) {
      console.log("开团")
      app.apis.course('getDetail', {
          courseId
        }, app.globalData.token)
        .then(res => {
          console.log('课程详情', res.data.data.courseMain)
          that.setData({
            courseMain: res.data.data.courseMain
          })
        })
    } else {
      console.log("拼团")
      app.group.getGroupBuyById({
        groupId: JSON.parse(options.param).collageId,
        userId: app.globalData.userInfo.id,
      }, app.globalData.token).then(res => {
        console.log(res.data)
        that.setData({
          courseId: res.data.data.courseMain.id,
          courseMain: res.data.data.courseMain,
          groupBuyRule: res.data.data.groupBuyRule,
          groupPrice: res.data.data.groupBuyRule.price
        })
      })
    }


  },
  pay() {
    var that = this
    that.setData({
      disabled: "disabled"
    })
    wx.showLoading({
      title: '处理中',
    })
    console.log(1111)
    app.group.createCollagOrder({
        collageId: that.data.collageId,
        courseId: that.data.courseId,
        date: new Date()
      }, app.globalData.token, 'POST')
      .then(res => {
        console.log(res)
        if (res.data.success) {
          if (res.data.data.status == 0) {
            console.log(res.data.data.wechatOrderId)
            var wechatOrderId = res.data.data.wechatOrderId
            app.apis.order('createUnifyOrder', {
                wechatOrderId: wechatOrderId
              }, app.globalData.token, 'POST')
              .then(res => {
                if (res.data.success) {
                  app.wechat.requestPayment(res.data.data)
                    .then(res => {
                      wx.hideLoading()
                      console.log(res)
                      that.setData({
                        leavePay: false
                      })
                      console.log("离开页面弹窗不提示",that.data.leavePay)
                      wx.redirectTo({
                        url: '/pages/groupShare/groupShare?collageId=' + that.data.collageId + '&wechatOrderId=' + wechatOrderId + '&ispay=0',
                      })
                    })
                    .catch(res => {
                      wx.hideLoading()
                      wx.showToast({
                        title: '支付失败',
                        icon:'none'
                      })
                      that.setData({
                        disabled: ""
                      })
                    })
                } else {
                  wx.showToast({
                    icon: 'none',
                    title: res.data.message,
                    duration: 2000
                  })
                }
              })

          } else {
            wx.showToast({
              title: res.data.data.message,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }

      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.data.leavePay) {
      wx.showModal({
        title: '提示',
        content: '支付后即可开团',
        cancelText: '确认离开',
        confirmText: '继续支付',
        confirmColor: '#00B4B9',
        cancelColor: '#666666',
        success: function(res) {
          if (res.confirm) {
            console.log(param)
            wx.navigateTo({
              url: `/pages/groupPay/groupPay?param=${param}`,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
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

  },



})