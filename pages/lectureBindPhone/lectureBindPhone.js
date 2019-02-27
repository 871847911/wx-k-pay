// pages/lectureBindPhone/lectureBindPhone.js
const app = getApp()
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    isSend: false,
    t: 60,
    btn_state: true,
    captcha: null,
    lectureId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var arr = [];
      arr = scene.split(",");
      this.setData({
        lectureId: arr[0],
      })



      this.getPhone()
    }



  },
  pageLogin() {
    wx.getSetting({
      success: (res) => {
        // console.log(res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
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
              wx.login({
                success: (res) => {
                  if (res.code) {
                    if (wx.getExtConfig) {
                      let storeId = wx.getExtConfigSync().store_id
                      app.apis.user('login3rd', {
                        storeId: storeId ? storeId : 25,
                        nickName,
                        avatarUrl,
                        country,
                        province,
                        city,
                        language,
                        gender,
                        code: code,
                        encryptedData,
                        iv
                      }, '', 'POST')
                        .then(res => {
                          if (res.data.success == true) {
                            app.globalData.token = res.data.data.token;
                            app.globalData.userInfo = res.data.data.user;
                            app.globalData.roleId = res.data.data.user.roleId;
                            app.globalData.userInfo.id = res.data.data.user.id;
                          } else { //处理后台信息配置报错
                            wx.hideLoading()
                            wx.showModal({
                              title: '错误提示',
                              content: res.data.message,
                              showCancel: false,
                              success: function (res) {
                                if (res.confirm) {
                                  // console.log('用户点击确定')
                                }
                              }
                            })
                          }

                        })
                    }
                  } else {
                    // console.log('登录失败！' + res.errMsg)
                  }
                }
              })
            }
          })
        } else {
          //未授权=> 去授权页
          wx.navigateTo({
            url: '/pages/userAuthPage/userAuthPage',
          })
        }
      }
    })
  },
  getPhone() {

    app.lecture.getLecturerPhone({
      lectureId: this.data.lectureId
    }, app.globalData.token).then(res => { //根据讲师ID获取 web绑定的手机号
      console.log(res)
      if (res.data.success) {
        this.setData({
          phone: res.data.data.phone,
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          success: function () {
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 3000)

          },
        })
      }

    }).catch(res => {
      console.log(res)
    })
  },
  check: function () {
    let that = this
    if (!this.data.isSend) {
      app.apis.lecturer('sendCaptcha', {
        phone: this.data.phone
      }, app.globalData.token, 'POST').then(res => {
        if (res.data.success) {
          wx.showToast({
            title: '发送成功',
            icon: 'none'
          })
          that.getyzm()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            success: function () {
              that.setData({
                isSend: false
              })
              return
            },
          })
        }
      })

    }
  },
  getyzm() {
    let that = this
    that.setData({
      isSend: true
    })
    clearInterval(control)
    var control = setInterval(() => {
      let time = that.data.t - 1
      that.setData({
        t: time
      })
      if (that.data.t == 0) {
        clearInterval(control)
        that.setData({
          isSend: false,
          t: 60
        })
        return
      }
    }, 1000)
  },
  getVcode(e) {
    this.setData({
      captcha: e.detail.value
    })
    if (this.data.captcha.length == 6) {
      this.setData({
        btn_state: false
      })
    } else {
      this.setData({
        btn_state: true
      })
    }
  },
  bind_submit() {
    let that = this
    app.lecture.lecturerBindPhone({
      lectureId: parseInt(that.data.lectureId),
      phone: that.data.phone,
      captcha: that.data.captcha
    }, app.globalData.token, 'POST').then(res => {

      if (res.data.message == null) {
        wx.showToast({
          title: '正在提交..',
          icon: 'none',
          success: function () {
            setTimeout(() => {
              wx.navigateTo({
                url: `/pages/bindPage/bindPage?phone=${that.data.phone}&state=1`,
              })
            }, 2000)
          },
        })

      } else {
        if (res.data.message.indexOf('验证码') != -1) {
          wx.showToast({
            title: '验证码错误!',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            success: function () {
              setTimeout(() => {

                wx.navigateTo({
                  url: `/pages/bindPage/bindPage?phone=${that.data.phone}&state=0`,
                })
              }, 2000)
            },
          })
        }
      }


    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.pageLogin()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }


})