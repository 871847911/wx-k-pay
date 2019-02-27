// pages/cashRecord/cashRecord.js
var app = getApp();
var that;
var page =1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: [],
    hasNextPage:true,
    list:[],
    emptyJson: {
      imgUrl: '/images/mycloumn.png',
      des: '暂无信息'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    console.log(options);
  
    if (options.withdrawType ==2){
      wx.setNavigationBarTitle({
        title: '提现记录',
      })
    }
    if (options.withdrawType == 1) {
      wx.setNavigationBarTitle({
        title: '提现冻结',
      })
    }
   
    this.setData({
      withdrawType: options.withdrawType
    })
    this.getList(options.withdrawType,1)
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (that.hasNextPage){
      page = page+1;
      that.getList(that.data.withdrawType, page);
    }else{
      wx.showToast({
        title: '已加载全部课程',
        icon:'none'
      })
    }
  },

  getList: function (withdrawType, page) {
    wx.request({
      url: app.globalData.httpUrl + "/app/userSettlement/getUserWithdrawList",
      data: {
        withdrawType: withdrawType,
        page: page,
        pageSize: 10
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("！！",res.data.data)
        that.setData({
          list: res.data.data.list,
          hasNextPage: res.data.data.hasNextPage
        })
      }
    })
  },
  goDetails:function(e){
    console.log(e.currentTarget.dataset.id);
    var list =that.data.list
    var item = list[e.currentTarget.dataset.id];
    var intent = JSON.stringify({
      amount: item.amount,
      bankName: item.bankName,
      cardNumber: item.cardNumber,
      createTime: item.createTime,
      finishTime: item.finishTime,
      userName: item.userName,
      withdrawType: that.data.withdrawType

    })
    wx.navigateTo({
      url: '../cashDetails/cashDetails?intent=' + intent,
    })
  }

})