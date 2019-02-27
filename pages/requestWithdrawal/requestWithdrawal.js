// pages/requestWithdrawal/requestWithdrawal.js
var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    profit: 0,
    moneyNum: "0.00",
    firstBank: {
      name: "",
      num: "",
      id: ''
    },
    moreMoney: false,
    bankId: '', //银行id
    amount: 0, //提现金额
    // profit: app.globalData.profit
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    // this.setData({
    //   profit: app.globalData.profit
    // })
    if (options.profit == null){
      this.getPayUserBalance();
    }else{
      this.setData({
        profit: options.profit
      })
    }
    
    
    this.getBankList();
  },
  onShow: function() {
    that.getBankList();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //提交申请
  commit: function() {
    console.log(that.data.bankId + "+++++" + that.data.amount)
    if (that.data.moreMoney) {
      wx.showToast({
        title: '金额已超过最大提现金额',
        icon: "none"
      })
    } else if (that.data.bankId == "" || that.data.amount == 0) {
      if (that.data.bankId == "") {
        wx.showToast({
          title: '请正确选择银行',
          icon: "none"
        })
      } else if (that.data.amount == 0) {
        wx.showToast({
          title: '金额大于0',
          icon: "none"
        })
      }
    } else {
      wx.request({
        url: app.globalData.httpUrl + "/app/userSettlement/applyWithdraw",
        data: {
          bankId: that.data.bankId,
          amount: that.data.amount

        },
        header: {
          "userToken": app.globalData.token
        },
        method: "GET",
        success: function(res) {
          console.log("申请", res.data);
          if (res.data.success) {
            wx.navigateBack({

            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            })
          }
        }
      })
    }
  },
  bindNum: function(e) {
    var inputnam = e.detail.value
    var regStrs = [
      ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
      ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
      ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
      ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
    ];
    for (var i = 0; i < regStrs.length; i++) {
      var reg = new RegExp(regStrs[i][0]);
      inputnam = inputnam.replace(reg, regStrs[i][1]);
    }

    if (Number(inputnam) > Number(that.data.profit)) {
      that.setData({
        moreMoney: true
      })
    } else {
      that.setData({
        moneyNum: inputnam,
        amount: inputnam,
        moreMoney: false
      })
    }
  }, //银行卡列表
  getBankList: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/userSettlement/getUserBankList",
      data: {},
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        if (res.data.data.length != 0) {
          console.log("bank==>", res.data.data);
          var num = res.data.data[0].cardNumber
          num = num.substring(num.length - 4);
          var firstBank = {
            name: res.data.data[0].bankName,
            num: num,
            id: res.data.data[0].id
          };
          var newBankList = [];

          for (var i = 0; i < res.data.data.length; i++) {
            var newBank = {
              name: '',
              cardNumber: '',
              id: ''
            };
            newBank.name = res.data.data[i].bankName;
            newBank.cardNumber = (res.data.data[i].cardNumber).substring(res.data.data[i].cardNumber.length - 4);
            newBank.id = res.data.data[i].id;
            newBankList.push(newBank);
          }

          that.setData({
            bankList: res.data.data,
            firstBank: firstBank,
            newBankList: newBankList,
            bankId: res.data.data[0].id
          })
        }
      }
    })
  },
  //跳转新建银行卡
  newBank: function() {

    wx.navigateTo({
      url: '../newBank/newBank?newbank=' + true,
    })
  },

  //浮尘效果
  setModalStatus: function(e) {


    // console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export()
    })
    if (e.currentTarget.dataset.status == 1) {
      this.setData({
        showModalStatus: true,

      });
    }
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData({
          showModalStatus: false,

        });
      }
    }.bind(this), 200)


  },
  //确定银行卡
  sureBank: function(e) {
    console.log(e.currentTarget.dataset.id);
    var id = e.currentTarget.dataset.id
    console.log("bankId==>", that.data.newBankList[id]);
    var firstBank = {
      name: "",
      num: "",
      id: ''
    }
    firstBank.name = that.data.newBankList[id].name;
    firstBank.num = that.data.newBankList[id].cardNumber;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export()
    })
    if (e.currentTarget.dataset.status == 1) {
      this.setData({
        showModalStatus: true,

      });
    }
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {

        this.setData({
          showModalStatus: false,
          bankId: that.data.newBankList[id].id,
          firstBank: firstBank
        });
      }
    }.bind(this), 200)
  },
  //我都要
  allIGet: function() {
    that.setData({
      moneyNum: that.data.profit,
      amount: that.data.profit,
      moreMoney: false
    })
  },
  //聚焦时
  del0:function(){
    that.setData({
      moneyNum:""
    })
  },
  //生产账户信息
  getPayUserBalance: function () {
    wx.request({
      url: app.globalData.httpUrl + "/app/userSettlement/getPayUserBalance",
      data: {

      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function (res) {
        console.log("账户详情", res.data.data)
        that.setData({
          profit: res.data.data.profit
        })
      }
    })
  }
})