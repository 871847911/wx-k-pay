// pages/orderDetail/orderDetail.js
const app = getApp();
const {
  $Message
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    visible: false,
    actions: [{
      name: '取消'
    },
    {
      name: '删除',
      color: '#6CDDC7',
      loading: false
    }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const {
      orderId
    } = options;
    this.setData({
      orderId
    })
    app.apis.order('get', {
      orderId
    }, app.globalData.token).then(res => {

      this.setData({
        courseDetails: res.data.data,

      })
    })
  },
  handDelOrderClick(e) {
    this.setData({
      visible: true
    });
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  confimDelOrder({
    detail
  }) {
    let orderId = this.data.orderId
    if (detail.index === 0) {
      this.setData({
        visible: false
      });
    } else {
      const action = [...this.data.actions];
      action[1].loading = true;
      this.setData({
        actions: action
      });
      app.apis.courses('order/delete', {
        orderId
      }, app.globalData.token, 'POST')
        .then(res => {

          if (res.data.success) {

            this.init()
            wx.navigateBack({
              delta: 2
            })
            action[1].loading = false;
            this.setData({
              visible: false,
              actions: action
            });
            setTimeout(() => {
              $Message({
                content: '删除成功！',
                type: 'success'
              });
            }, 1000);
          }

        }).catch(res => {
          $Message({
            content: res.message,
            type: 'success'
          });
        })
      // setTimeout(() => {

      // }, 2000);
    }
  },
  pay(e) {
    app.apis.order('createUnifyOrder', {
      wechatOrderId: this.data.courseDetails.wechatOrderId
    }, app.globalData.token, 'POST')
      .then(res => {
        console.log("res==>", res)
        if (res.data.success) {

          app.wechat.requestPayment(res.data.data)
            .then(res => {
              wx.redirectTo({
                url: '/pages/orderDetail/orderDetail?orderId=' + this.data.orderId,
              })


            })
            .catch(res => {
              wx.showToast({
                title: '交易失败',
                icon: "none"
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
  }
})