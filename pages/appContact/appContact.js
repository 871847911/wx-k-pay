// pages/appContact/appContact.js

const app = getApp()
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    checkNumber: '',
    email: '',
    qq: '',
    isSend: false,
    t: 60,
    fontParams: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)

    // this.setData({ fontParams: JSON.parse(options.param) })
  },
  formSubmit: function(e) {
    var detail = e.detail.value;
    if (this.data.phone.length == 0 || !utils.reg_phone(this.data.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
      return
    }

    // if (detail.checkNumber.length == 0) {
    //   wx.showToast({
    //     title: '验证码错误',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return
    // }

    if (detail.email.length == 0 || !utils.reg_email(detail.email)) {
      wx.showToast({
        title: '邮箱格式错误',
        icon: 'none',
        duration: 1000
      })
      return
    }
    app.applyForm.mail = e.detail.value.email;
    app.applyForm.qq = e.detail.value.qq;
    app.applyForm.phone = this.data.phone;
    app.applyForm.captcha = e.detail.value.checkNumber;
    app.apis.lecturer('apply', app.applyForm, app.globalData.token, 'POST')
      .then(res => {
        if (res.data.success) {
          wx.showLoading({
            title: '提交成功',
            duration: 2000,
            mask: true,
            complete: function() {
              setTimeout(function() {
                wx.switchTab({
                  url: '/pages/index/index'
                })
                wx.hideToast()
              }, 2000)
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        }
      })
  },
  check() {
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
          if (res.data.success) {
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000
            })

            this.setData({
              checkNumber: res.data.data,
              isSend: true
            }, () => {
              var time = setInterval(() => {
                var next = this.data.t - 1
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
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  }
})