// pages/groupList/groupList.js
const app = getApp()
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOk:false,
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无拼团，快去逛逛吧'
    },
    list: [],
    list2: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    app.group.getAppGroupBuyList({
      page: page,
      size: 10,
      storeId: app.globalData.userInfo.storeId,
    }, app.globalData.token).then(res => {
      console.log(res)
      that.setData({
        list: res.data.data.list
      },res =>{//数据加载成功回调后在进行页面展示渲染
        that.setData({
          isOk:true
        })
        wx.hideLoading();
      })
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
    page = 1
    var that = this
    app.group.getAppGroupBuyList({
      page: page,
      size: 10,
      storeId: app.globalData.userInfo.storeId,
    }, app.globalData.token).then(res => {
      
      console.log(res)
      that.setData({
        list: res.data.data.list,
        isOk:true,
        
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '加载中',
    })
    // 页数+1 
    page = page + 1;
    app.group.getAppGroupBuyList({
      page: page,
      size: 10,
      storeId: app.globalData.userInfo.storeId,
    }, app.globalData.token).then(res => {
      wx.hideLoading();
      // 停止下拉动作  
      console.log(res.data.data.list)
      var list = that.data.list
      for (var i = 0; i < res.data.data.list.length; i++) {
        list.push(res.data.data.list[i]);
      }
      that.setData({
        list: list
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  gogroupPin(e) {
    console.log(e.currentTarget.dataset.index)
    var collageId = this.data.list[e.currentTarget.dataset.index].id
    var status = this.data.list[e.currentTarget.dataset.index].isState
    if (status == 0) {
      var param = JSON.stringify({
        collageId: collageId
      })
      console.log(param)
      wx.navigateTo({
        url: `/pages/groupPay/groupPay?param=${param}`,
      })
    }
  },

})