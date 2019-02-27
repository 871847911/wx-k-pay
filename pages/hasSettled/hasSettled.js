// pages/hasSettled/hasSettled.js
var app = getApp();
var that;
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    income: [],
    tab: ["课程","专栏"],
    tabIndex: 0,
    hasNextPage: true,
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无结算'
    }
  },
  onLoad: function(options) {
    that = this;
    this.getList(1,1);
  },
  changeTab: function(e) {
    console.log(e.currentTarget.dataset.id);
    switch (e.currentTarget.dataset.id){
      case 0:
      page = 1
        this.getList(1, 1);
      break;
      case 1:
        page = 1
      this.getList(1,2)
      break;
    }
    this.setData({
      tabIndex: e.currentTarget.dataset.id
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (that.data.hasNextPage) {
      page = page + 1;
      that.getList(page, that.data.tabIndex+1)
    } else {
      wx.showToast({
        title: '已全部加载',
        icon: 'none'
      })
    }

  },

  onShareAppMessage: function() {

  },
  getList: function (page, productType) {
    wx.request({
      url: app.globalData.httpUrl + "/app/userSettlement/getSettlementDetailList",
      data: {
        productType: productType,
        page: page,
        pageSize: 10
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log(res)
        that.setData({
          income: res.data.data.list,
          hasNextPage: res.data.data.hasNextPage
        })
      }
    })
  }
})