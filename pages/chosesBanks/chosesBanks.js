// pages/chosesBanks/chosesBanks.jsvar
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.getBankList();
  },
  onShow: function() {
    this.getBankList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //银行卡列表
  getBankList: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/userSettlement/getUserBankList",
      data: {},
      method: "GET",
      header: {
        "userToken": app.globalData.token
      },
      success: function(res) {
        console.log("bank==>", res.data.data);
        that.setData({
          bankList: res.data.data
        })
      }
    })
  },
  //跳转新建银行卡
  newBank: function() {
    
    wx.navigateTo({
      url: '../newBank/newBank?newbank=' + true,
    })
  },
  //跳转修改银行卡
  wirteBank: function (e) {
    console.log("wirteBank", e.currentTarget.dataset.id);
    var index = e.currentTarget.dataset.id;
    var bank = that.data.bankList[index];
    
    wx.navigateTo({
      url: '../newBank/newBank?userName=' + bank.userName + "&bankName=" + bank.bankName + "&cardNumber=" + bank.cardNumber + "&openBankName=" + bank.openBankName + "&id=" + bank.id,
    })
  }
})