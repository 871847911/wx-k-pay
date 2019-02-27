var app = getApp();
var that;
var verson = require('../../apis/version.js').complie
Page({
  data: {
    verson: verson,
   
    myNav2: [{
        name: '我的订单',
        url: 'myOrder',
        iconPath: '/images/Order-icon@2x.png'
      },
      {
        name: '我的订阅',
        url: 'myColumn2',
        iconPath: '/images/Subscribe-icon@2x.png'
      },

      {
        name: '我的咨询',
        url: 'myConsult',
        iconPath: '/images/Consultation-icon@2x.png'

      },
      {
        name: '我的团购',
        url: 'myGroupList',
        iconPath: '/images/Group_buy-icon@2x.png'
      },
      {
        name: '赠送记录',
        url: 'giftHistory',
        iconPath: '/images/Gift_record-icon@2x.png'
      }, {
        name: '我的分享',
        url: 'myShar',
        iconPath: '/images/my_share@2x.png'

      },

    ],
    myNav3: [{
        name: '会员中心',
        url: 'vipCenter2',
        iconPath: '/images/Member_Center@2x.png'
      },

    ],

    myNav4: [{
        name: '我的积分',
        url: 'integral',
        iconPath: '/images/My_points@2x.png'

      }

    ],

    myNav6: [{
      name: '联系我们',
      url: 'contactUs',
      iconPath: '/images/Contact_us-icon@2x.png'
    }, ],
    myNav7: [{
      name: '切换知识店铺',

      iconPath: '/images/myLittle.png'
    }, ],

    // 生产者列表
    myNav8: [{
      name: '返回个人中心',

      iconPath: '/images/my_column1@2x.png'
    }, ],

    myNav10: [{
        name: '店铺订单',
        url: 'storeOrder',
        iconPath: '/images/Order-icon@2x.png'
      },
      {
        name: '我的专栏',
        url: 'myColumn',
        iconPath: '/images/Subscribe-icon@2x.png'
      },
      {
        name: '资金管理',
        url: 'moneyManagement',
        iconPath: '/images/check_my_spending@2x.png'
      },
      {
        name: '银行卡管理',
        url: 'chosesBanks',
        iconPath: '/images/bank_card_management@2x.png',
      },
      {
        name: '提现管理',
        url: 'cashManagement',
        iconPath: '/images/present_management@2x.png'
      },
    ],

    userIdentity: '0',
    visible: false,
    actions: [{
        name: '取消'
      },
      {
        name: '呼叫',
        color: '#6CDDC7'
      }
    ],
    phoneNumber: app.globalData.customerPhone,
    userInfo: {},
    isRoleId: false,
    isAppaly: true,
  },
  onLoad: function(options) {
    that = this;
    // console.log("my", app.globalData.userInfo.roleId);
    if (app.globalData.userInfo.roleId == 3) {
      var myNav2 = this.data.myNav2;
      myNav2.splice(1, 1, {
        name: '我的订阅',
        url: 'myColumn2',
        iconPath: '/images/Subscribe-icon@2x.png'

      });
      this.setData({
        isAppaly: false,
        myNav2: myNav2
      })
    } else {
      this.getPayUserBalance();
      this.getLecturerIndex();
    }

    this.setData({
      phoneNumber: app.globalData.customerPhone
    })
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
    that.getStudentIndex()
    that.getIntegral();
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  
  edit() {
    wx.navigateTo({
      url: `/pages/myBasicSet/myBasicSet`,
    })
  },
  onClick(e) {
    console.log("aaa=>", e.currentTarget.dataset.param)
    var param = e.currentTarget.dataset.param;
    if (param == "message") {
      wx.switchTab({
        url: '../message/message',
      })
    } else {
      if (param == 'contactUs') {
        this.setData({
          visible: true
        });
        return
      }
      wx.navigateTo({
        url: `/pages/${param}/${param}`,
      })
    }
  },
  askFriend() {
    wx.navigateTo({
      url: `/pages/courseBuyed/courseBuyed`,
    })
  },
  handleClick({
    detail
  }) {
    const index = detail.index;
    var that = this
    if (index === 1) {
      wx.makePhoneCall({
        phoneNumber: that.data.phoneNumber
      })
    }
    this.setData({
      visible: false
    });
  },
  bindGetUserInfo(e) {
    this.setData({
      canIUse: true,
      userInfo: e.detail.userInfo
    })
    wx.setStorage({
      key: "userInfo",
      data: e.detail.userInfo
    })
  },
  //改变进入小店还是消费者模式
  changeModle: function() {
    that.setData({
      isRoleId: !that.data.isRoleId
    })
    if (that.data.isRoleId) {
      // that.getUserIncomeSummary();
    }
    console.log("isRoleId==>", that.data.isRoleId)
  },

  //获取积分详情
  getIntegral: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/score/getUserScoreInfo",
      data: {},
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("积分详情", res.data.data)
        that.setData({
          integral: res.data.data
        })
      }
    })
  },
  //进去申请入驻
  go_ruzhu: function() {
    wx.navigateTo({
      url: '../appAgreement/appAgreement',
    })
  },
  //跳转申请提现页面
  getMoney: function() {
    wx.navigateTo({
      url: '../requestWithdrawal/requestWithdrawal',
    })
  },
  //生产账户信息
  getPayUserBalance: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/userSettlement/getPayUserBalance",
      data: {

      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("账户详情", res.data.data)
        app.globalData.profit = res.data.data.profit
        that.setData({
          profit: res.data.data.profit
        })
      }
    })
  },
  //跳转已订阅课程
  goCourseBuyed: function() {
    wx.navigateTo({
      url: '../courseBuyed/courseBuyed',
    })
  },
  //跳转我的关注讲师列表
  golecturerList: function() {
    wx.navigateTo({
      url: '../mySub/mySub',
    })
  },
  //跳转提问我的问答页面
  goMyQuestios: function() {
    wx.navigateTo({
      url: '../questionAndAnswer/questionAndAnswer',
    })

  },
  goAskMyQuestios: function() {
    if (app.globalData.roleId == 3) {
      wx.navigateTo({
        url: '../questionAndAnswer/questionAndAnswer',
      })

    } else {
      wx.navigateTo({
        url: '../addQuestionForS/addQuestionForS',
      })
    }

  },
  //挑战讲师发布课程
  goMyCourse: function() {
    wx.navigateTo({
      url: '../myPublish/myPublish',
    })
  },
  //进入我的粉丝
  goMyFans: function() {
    wx.navigateTo({
      url: '../myFans/myFans',
    })
  },
  //获取学生首页信息
  getStudentIndex: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/user/studentIndex",
      data: {

      },
      header: {
        "userToken": app.globalData.token
      },
      method: "POST",
      success: function(res) {
        that.setData({
          student: res.data.data
        })
      }
    })
  },
  //获取老师首页信息
  getLecturerIndex: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/user/lecturerIndex",
      data: {

      },
      header: {
        "userToken": app.globalData.token
      },
      method: "POST",
      success: function(res) {
        that.setData({
          lecturer: res.data.data
        })
      }
    })
  }
})