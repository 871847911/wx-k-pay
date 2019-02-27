// pages/couseDetail.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
var that;
var timerNum = 0
var timer
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    index: 0,
    idx: 0,
    visible1: false,
    actions1: [{
        name: '我要提问',
        icon: 'kefuzixunhui',
      },
      {
        name: '讲师咨询',
        icon: 'shangkezhuanhuan',
      }
    ],
    actions2: [{
      name: '确定',
      color: '#007AFF',
    }],
    visible2: false,
    visible3: false,
    actions3: [{
      name: '确定',
      color: '#007AFF',
    }],
    isFixed_Detail: false,
    isFixed_Preview: false,
    fromPage: '',
    t_5: 5,
    is_detailPage: true,
    status_checked: '',
    courseDetail: {},
    isEdit: false,
    subUrl: '',
    subName: '',
    context: '',
    myVideo: "myVideo",
    myAudio: "myAudio",
    subType: 0,
    id: '',
    isBuy: false,

    isFree: true,
    idxs: 1,
    noChat: true,
    fenxiangzheid: 88,
    fxcourseId: '',
    optionsUserId: '',
    userId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    timerNum = 0
    that = this;
    console.log(options)
    that.setData({
      userId: options.userId,
      courseId: options.courseId
    })
    if (options.userId) {
      wx.showLoading({
        title: '请稍等',
      })
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            //getUserInfo
            wx.getUserInfo({
              success: res => {
                console.log(res)
                let {
                  nickName,
                  avatarUrl,
                  country,
                  province,
                  city,
                  language,
                  gender
                } = res.userInfo;
                let encryptedData = res.encryptedData;
                let iv = res.iv;
                //login
                wx.login({
                  success: res => {
                    if (res.code) {
                      if (wx.getExtConfig) {
                        var storeId = wx.getExtConfigSync().store_id
                        console.log("getExtConfigSync==>", wx.getExtConfigSync())
                        wx.setNavigationBarTitle({
                          title: wx.getExtConfigSync().store_name ? wx.getExtConfigSync().store_name : '知识付费'
                        })
                        app.apis.user('login3rd', {
                          storeId: storeId ? storeId : 25,
                            nickName,
                            avatarUrl,
                            country,
                            province,
                            city,
                            language,
                            gender,
                            code: res.code,
                            encryptedData,
                            iv
                          }, '', 'POST')
                          .then(res => {
                            console.log("check====>", res);
                            if (res.data.success == true) {
                              console.log("check==>", res);
                              app.globalData.token = res.data.data.token;
                              app.globalData.userInfo = res.data.data.user;
                              app.globalData.roleId = res.data.data.user.roleId;
                              app.globalData.userInfo.avatarUrl = avatarUrl;
                              app.globalData.userInfo.gender = gender;
                              app.globalData.userInfo.id = res.data.data.user.id;
                              console.log("courseId", options.courseId,)
                              console.log("initiatorId", options.userId, )
                              console.log("RecipientOpenId", res.data.data.user.id, )
                              typeof callBack === 'function' ? callBack() : '';
                              wx.request({
                                url: app.globalData.httpUrl+"/app/shareCourse/insertRule",
                                method: "POST",
                                header: {
                                  'content-type': 'application/json',
                                  userToken: res.data.data.token
                                },
                                data: {
                                  "courseId": options.courseId,
                                  "initiatorId": options.userId,
                                  "recipientOpenId": res.data.data.user.id
                                },
                                success: function(res) {
                                  wx.redirectTo({
                                    url: '/pages/courseDetail/courseDetail?userId=' + options.userId + '&courseId=' + options.courseId,
                                  })
                                  console.log("分享次数+1", res.data);
                                }
                              })
                            } else { //处理后台信息配置报错
                              wx.hideLoading()
                              wx.showModal({
                                title: '错误提示',
                                content: res.data.message,
                                showCancel: false,
                                success: function(res) {
                                  if (res.confirm) {
                                    console.log('用户点击确定')
                                  }
                                }
                              })
                            }

                          })
                      }
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  }
                })
              }
            })
          } else {
            wx.hideLoading()

            that.setData({
              visibleqw: true
            })
            //未授权=> 去授权页
          }
        },
        fail: res => {
          console.log(res)
        }
      })

    } else {
      that.Countdown()
    }
    let {
      courseId
    } = options

    this.setData({
      optionsUserId: options,
      fxcourseId: courseId,
      fromPage: options.page || ''
    })
    console.log("options", options)

    if (options.page == 'myPublish') {
      this.setData({
        fromPage: 'myPublish'
      })
    } else if (options.page == 'courseManage') {
      this.setData({
        fromPage: 'courseManage',
        is_detailPage: false,
        status_checked: 'check_passed'
      })
    }

    console.log("courseId", courseId)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearTimeout(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearTimeout(timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */


  //授权弹窗取消
  handleCancelqw(res) {
    console.log('用户点击了取消按钮')
    wx.showToast({
      title: '您取消授权',
      icon: 'none'
    })
    that.setData({
      visibleqw: false
    })
    wx.redirectTo({
      url: '/pages/shareUserLogin/shareUserLogin?userId=' + that.data.userId + '&courseId=' + that.data.courseId,
    })

  },
  //授权弹窗确定
  handleClickOk(res) {
    console.log(111)
    that.setData({
      visibleqw: false
    })
  },
})