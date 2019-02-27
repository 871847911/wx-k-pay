// pages/newBank/newBank.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newbank: false,
    userName: "",
    bankName: "",
    cardNumber: "",
    openBankName: "",
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    console.log(options)
    if (options.newbank) { //s是否有修改
      that.setData({
        newbank: true
      })
    }
    if (options.userName) { //从修改传值
      this.setData({
        userName: options.userName,
        bankName: options.bankName,
        cardNumber: options.cardNumber,
        openBankName: options.openBankName,
        id: options.id
      })
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //输入姓名
  bindUserName: function(e) {
    that.setData({
      userName: e.detail.value
    })
  },
  //输入银行
  bindBankName: function(e) {
    that.setData({
      bankName: e.detail.value
    })
  },
  //输入卡号
  bindCardNumber: function(e) {
    that.setData({
      cardNumber: e.detail.value
    })
  },
  //输入开户行
  bindOpenBankName: function(e) {
    that.setData({
      openBankName: e.detail.value
    })
  },
  //保存信息区分新建和修改
  saveBank: function() {
    if (that.data.newbank) { //新建
      if (that.data.userName != "" && that.data.bankName != "" && that.data.cardNumber != "" && that.data.openBankName != "") {
        wx.request({
          url: app.globalData.httpUrl + "/app/userSettlement/addUserBank",
          data: {
            userName: that.data.userName,
            bankName: that.data.bankName,
            cardNumber: that.data.cardNumber,
            openBankName: that.data.openBankName
          },
          header: {
            "userToken": app.globalData.token
          },
          method: "GET",
          success: function(res) {
            console.log("savebank==>", res.data.data);
            wx.navigateBack({

            })
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            })

          }
        })
      } else {
        wx.showToast({
          title: '信息不为空',
          icon: 'none',
          duration: 1000
        })
      }
    } else { //修改
      if (that.data.userName != "" && that.data.bankName != "" && that.data.cardNumber != "" && that.data.openBankName != "") {
        wx.request({
          url: app.globalData.httpUrl + "/app/userSettlement/updateUserBank",
          data: {
            id: that.data.id,
            userName: that.data.userName,
            bankName: that.data.bankName,
            cardNumber: that.data.cardNumber,
            openBankName: that.data.openBankName
          },
          header: {
            "userToken": app.globalData.token
          },
          method: "GET",
          success: function(res) {
            console.log("changebank==>", res);
            wx.navigateBack({

            })
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000
            })

          }
        })
      } else {
        wx.showToast({
          title: '信息不为空',
          icon: 'none',
          duration: 1000
        })
      }
    }
  },
  //删除银行
  delBank: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/userSettlement/deleteUserBank",
      data: {
        id: that.data.id,
        
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("delbank==>",res)
        wx.navigateBack({

        })
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  }
})