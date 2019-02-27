// pages/myOrder/myOrder.js
const app = getApp()
const {
  $Message
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    orderDetail: {},
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无订单，快去逛逛吧'
    },
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
    handOrderId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
  },
  clickTab(e) {
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      index: idx
    }, () => {
      this.init()
    })
  },
  init() {
    var idx = this.data.index;
    app.apis.user('pageOrder', {
      page: 1,
      size: 10,
      status: idx + 1
    }, app.globalData.token).then(res => {
      console.log('我的訂單', res)
      this.setData({
        orderDetail: res.data.data
      })
    })

  },
  handDelOrderClick(e) {
    this.setData({
      visible: true,
      handOrderId: e.detail.orderId
    });
  },
  confimDelOrder({
    detail
  }) {
    let orderId = this.data.handOrderId
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
          if (res.data.success)
            this.init()
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
  handClickOrder({
    detail
  }) {
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?orderId=${detail.orderId}`,
    })
  },
  onShow: function() {
    this.init()
  }
})