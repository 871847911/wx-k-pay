// pages/appPersonalIntr/appPersonalIntr.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},
    formSubmit: function(e) {
        app.applyForm.introduce = e.detail.value.intr;
      wx.navigateTo({
        url: `/pages/appContact/appContact`,
      })
    }
})