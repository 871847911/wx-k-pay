const app = getApp()
Component({
  externalClasses: ['i-class'],

  properties: {
    // default, primary, ghost, info, success, warning, error
    type: {
      type: String,
      value: '',
    },
    optionsuserId: {
      type: String,
      value: '',
    },
    optionscourseId: {
      type: String,
      value: '',
    },
    // default, large, small
    size: {
      type: String,
      value: '',
    },
    // circle, square
    shape: {
      type: String,
      value: 'square'
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    long: {
      type: Boolean,
      value: false
    },
    openType: String,
    appParameter: String,
    hoverStopPropagation: Boolean,
    hoverStartTime: {
      type: Number,
      value: 20
    },
    hoverStayTime: {
      type: Number,
      value: 70
    },
    lang: {
      type: String,
      value: 'en'
    },
    sessionFrom: {
      type: String,
      value: ''
    },
    sendMessageTitle: String,
    sendMessagePath: String,
    sendMessageImg: String,
    showMessageCard: Boolean,
    bindgetuserinfo: String
  },

  methods: {
    handleTap() {
      if (this.data.disabled) return false;
      this.triggerEvent('click');
    },
    bindgetuserinfo(e) {
      wx.showLoading({
        title: '正在加载',
      })
      var that = this;
      console.log(e.detail.userInfo)
      if (e.detail.userInfo) {
        console.log('000')
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
                                console.log("111", that.data.optionsuserId)
                                console.log("111", that.data.optionscourseId)
                                
                                wx.request({
                                  url: app.globalData.httpUrl + "/app/shareCourse/insertRule",
                                  method: "POST",
                                  header: {
                                    'content-type': 'application/json',
                                    userToken: res.data.data.token
                                  },
                                  data: {
                                    "courseId": that.data.optionscourseId,
                                    "initiatorId": that.data.optionsuserId,
                                    "recipientOpenId": res.data.data.user.id
                                  },
                                  success: function(res) {
                                    wx.redirectTo({
                                      url: '/pages/courseDetail/courseDetail?userId=' + that.data.optionsuserId + '&courseId=' + that.data.optionscourseId
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
              wx.navigateTo({
                url: '/pages/userAuth/userAuth',
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
        wx.redirectTo({
          url: '/pages/shareUserLogin/shareUserLogin?userId=' + that.data.optionsuserId + '&courseId=' + that.data.optionscourseId,
        })
      }
    }
  }
});