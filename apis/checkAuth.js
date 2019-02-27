var app = getApp();
module.exports = function(callBack) {

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

                    this.apis.user('login3rd', {
                        storeId: storeId ? storeId : 96,
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
                          console.log("check==>", res);
                          // app.globalData.nickName = res.data.data.user.nickName
                          that.globalData.storeId = res.data.data.user.storeId;
                          that.globalData.token = res.data.data.token;
                          that.globalData.userInfo = res.data.data.user;
                          that.globalData.roleId = res.data.data.user.roleId;
                          that.globalData.userInfo.avatarUrl = avatarUrl;
                          that.globalData.userInfo.gender = gender;
                          that.globalData.userInfo.id = res.data.data.user.id;
                          that.globalData.phone = res.data.data.user.phone;
                          typeof callBack === 'function' ? callBack() : ''
                        } else { //处理后台信息配置报错
                          // console.log("fails", res)
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
}