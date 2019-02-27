// pages/income/income.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    income: [],
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无收入，快去逛逛吧'
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.setData({
      incometime: options.incometime
    },res=>{
      that.getList(1);
    })
    switch (options.incometime) {
      case "1":
        wx.setNavigationBarTitle({
          title: '今日收入'
        })
        break;
      case "2":
        wx.setNavigationBarTitle({
          title: '本月收入'
        })
        break;
      case "3":
        wx.setNavigationBarTitle({
          title: '累计收入'
        })
        break;
    }
  },
  getList: function(page) {
    wx.request({
      url: app.globalData.httpUrl + "/app/userSettlement/getUserIncomeList",
      data: {
        incomeTime: that.data.incometime,
        page: page,
        pageSize: 100
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log(res.data.data.list)
        that.setData({
          income: res.data.data.list
        })
      }
    })
  }
})