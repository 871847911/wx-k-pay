// pages/myBasicSet/myBasicSet.js
const app = getApp()
const utils = require('../../utils/util.js')
var that;
Page({
  data: {
    date: '2017-05-01',
    region: ['','',''],
    userInfo: {},
    ifShow: false,
    phone: '',
    checkNumber: '',
    isSend: false,
    t: 60,
    captcha: '',
    phoneNumber: app.globalData.phone
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("phone",app.globalData.phone)
    var phoneNumber ="";
    if (app.globalData.phone!=null){
      phoneNumber = app.globalData.phone;
    }
    
    that = this;
    this.setData({
      userInfo: app.globalData.userInfo,
      phoneNumber: phoneNumber
    })
    app.apis.user('getInfo', {}, app.globalData.token).then(res => {
      if (res.data.success) {
        this.setData({
          date: res.data.data.birthday,
          region: [res.data.data.province, res.data.data.city, res.data.data.district]
        })

      }
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
    this.updateInfo()
  },
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
    this.updateInfo()
  },
  updateInfo() {
    app.apis.user('updateInfo', {
      birthday: this.data.date,
      province: this.data.region[0],
      city: this.data.region[1],
      district: this.data.region[2]
    }, app.globalData.token, 'POST').then(res => {
      if (res.data.success) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  //绑定手机号弹出框
  bindPhone: function() {
    that.setData({
      ifShow: true
    })
  },
  //取消弹窗
  cancel: function() {
    that.setData({
      ifShow: false
    })
  },

  //获得手机号
  getPhone: function(e) {
    console.log("手机号", e.detail.value);
    that.setData({
      phone: e.detail.value
    })
  },
  //获得输入验证码
  getCode: function(e) {
    console.log("验证码", e.detail.value);
    that.setData({
      captcha: e.detail.value
    })
  },

  //验证手机号格式
  check() {
    console.log("点击发送", that.data.isSend)
    if (this.data.phone.length == 0 || !utils.reg_phone(this.data.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return
    }  
    if (!this.data.isSend) {
      app.apis.lecturer('sendCaptcha', {
          phone: this.data.phone
        }, app.globalData.token, 'POST')
        .then(res => {
          console.log("checkNumber", res.data.data)
          if (res.data.success) {
            this.setData({
              checkNumber: res.data.data,
              isSend: true
            }, () => {
              wx.showToast({
                title: '发送成功',
                icon: 'success',
                duration: 2000
              })
               console.log("状态改变", that.data.isSend)
              var time = setInterval(() => {
                var next = this.data.t - 1
                console.log("倒计时",next);
                this.setData({
                  t: next
                })
              }, 1000)
              setTimeout(() => {
                clearInterval(time)
                this.setData({
                  t: 60,
                  isSend: false
                })
              }, 60000)
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        })
    }
  },
  //传给后台绑定手机号
  sureBind: function() {
    if (that.data.captcha !='') {
      wx.request({
        url: app.globalData.httpUrl + "/app/user/bindPhone",
        data: {
          phone: that.data.phone,
          captcha: that.data.captcha
        },
        header: {
          "userToken": app.globalData.token,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function(res) {
          console.log("绑定", res, "phone", that.data.phone, "captcha", that.data.captcha)
          app.globalData.phone = that.data.phone
          if (res.data.success) {
            that.setData({
              ifShow: false,
              phoneNumber: that.data.phone
            })
            wx.showToast({
              title: '绑定成功',
              icon: 'success'
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
            })
          }

        }
      })
    }else{
      wx.showToast({
        title: '验证码不为空',
      })
    }
  }
})