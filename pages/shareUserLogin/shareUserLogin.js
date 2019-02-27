// pages/userAuth/userAuth.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    courseId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userId: options.userId,
      courseId: options.courseId
    })
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
    // 查看是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          // app.checkAuth()
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            //getUserInfo
            wx.getUserInfo({
              success: res => {
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
                              app.globalData.userInfo.avatarUrl = avatarUrl;
                              app.globalData.userInfo.gender = gender;
                              app.globalData.userInfo.id = res.data.data.user.id;
                              typeof callBack === 'function' ? callBack() : ''
                              wx.request({
                                url: app.globalData.httpUrl + "/app/shareCourse/insertRule",
                                method: "POST",
                                header: {
                                  'content-type': 'application/json',

                                },
                                data: {
                                  "courseId": that.data.courseId,
                                  "initiatorId ": that.data.userId,
                                  "RecipientOpenId": res.data.data.user.id
                                },
                                success: function(res) {
                                  wx.redirectTo({
                                    url: '/pages/courseDetail/courseDetail?userId=' + that.data.userId + '&courseId=' + that.data.courseId
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
            //未授权=> 去授权页
            wx.redirectTo({
              url: '/pages/shareUserLogin/shareUserLogin?userId=' + that.data.userId + '&courseId=' + that.data.courseId,
            })
          }
        },
        fail: res => {
          console.log(res)
        }
      })

    } else {
      wx.hideLoading()
      wx.showToast({
        title: '您取消授权',
        icon: 'none'
      })
      // wx.redirectTo({
      //   url: '/pages/shareUserLogin/shareUserLogin?userId=' + that.data.userId + '&courseId=' + that.data.courseId,
      // })
    }
    wx.navigateBack({
      delta: 0
    })
  }
})