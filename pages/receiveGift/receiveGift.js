// pages/receiveGift/receiveGift.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {  
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
    hasToken: true,
    giftInfo: {},
    id: 75
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({ id: options.id })
    console.log(options.id)
    this.getUserToken()
  },

  bindGetUserInfo(e) {
    console.log(e);
    this.getUserToken()
  },

  getUserToken() {
    var that = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {


          //login
          wx.login({
            success: res => {
              if (res.code) {
                let code = res.code
                if (wx.getExtConfig) {
                  var storeId = wx.getExtConfigSync().store_id
                  //getUserInfo
                  wx.getUserInfo({
                    success: res => {
                      // console.log("用户信息", res);
                      let {
                        nickName,
                        avatarUrl,
                        country,
                        province,
                        city,
                        language,
                        gender
                      } = res.userInfo
                      let encryptedData = res.encryptedData;
                      let iv = res.iv;

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
                            wx.hideLoading()
                            // console.log("check==>", res);
                            // app.globalData.nickName = res.data.data.user.nickName
                            app.globalData.storeId = res.data.data.user.storeId;
                            app.globalData.token = res.data.data.token;
                            app.globalData.userInfo = res.data.data.user;
                            app.globalData.roleId = res.data.data.user.roleId;
                            app.globalData.userInfo.avatarUrl = avatarUrl;
                            app.globalData.userInfo.gender = gender;
                            app.globalData.userInfo.id = res.data.data.user.id;
                            app.globalData.phone = res.data.data.user.phone;
                            typeof callBack === 'function' ? callBack() : '';
                            that.checkGetGift()
                          } else { //处理后台信息配置报错
                            // console.log("fails", res)
                            wx.hideLoading()
                            wx.showModal({
                              title: '错误提示',
                              content: res.data.message,
                              showCancel: false,
                              success: function (res) {
                                if (res.confirm) {

                                }
                              }
                            })
                          }

                        })
                    }
                  })




                }
              } else {

              }
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

      }
    })
  },

  checkGetGift() {
    var that = this
    let params = {
      userId: app.globalData.userInfo.id,
      // userId: 126,
      orderId: that.data.id
    }
    app.gift.checkGetGift(params, app.globalData.token).then(res => {
      console.log(res.data)
      if (res.data.success == true){
        switch (res.data.data.status) {
          case 0:
            res.data.data.message = '非常感谢，我就收下啦~';
            break;
          case 1:
            res.data.data.message = '您已经拥有了这个课程，无法领取';
            break;
          case 2:
            res.data.data.message = '课程已被领取';
            break;
          case 3:
            res.data.data.message = '您正在拼团该课程，无法领取';
            break;
        }
        that.setData({ giftInfo: res.data.data })        
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  
  receiveCourse() {
    var that = this
    console.log(this.data.giftInfo.status)
    let params = {
      userId: app.globalData.userInfo.id,
      // userId: 1,
      storeId: app.globalData.userInfo.storeId,
      orderId: that.data.id
    }
    app.gift.receiveGift(params, app.globalData.token).then(res => {
      console.log(res.data)
      if (res.data.success == true) {
        wx.showToast({
          title: '领取成功',
          icon: 'none',
          duration: 2000
        })
        that.checkGetGift()
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  toIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})