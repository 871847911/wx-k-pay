// pages/myGroupList/myGroupList.js
const app = getApp()
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    list: [],
    page: 1,
    emptyJson: {
      imgUrl: '/images/group_purchase@2x.png',
      des: '暂无拼团'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.group.getMyGroupBuyList({
      page: page,
      size: 10,
      userId: app.globalData.userInfo.id
    }, app.globalData.token).then(res => {
      console.log(res.data.data.list)
      that.setData({
        list: res.data.data.list
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log(this.data.list)
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
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    app.group.getMyGroupBuyList({
      page: page,
      size: 10,
      userId: app.globalData.userInfo.id
    }, app.globalData.token).then(res => {
      wx.hideLoading();
      // 停止下拉动作  
      wx.stopPullDownRefresh();
      console.log(res.data.data.list)
      that.setData({
        list: res.data.data.list
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
    app.group.getMyGroupBuyList({
      page: page,
      size: 10,
      userId: app.globalData.userInfo.id
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
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  deletBtn(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除订单吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let params = {
            userId: app.globalData.userInfo.id,
            groupId: that.data.list[e.currentTarget.dataset.index].id
          }
          app.group.deleteGroupOrder(params, app.globalData.token).then(res => {
            console.log(res.data.data)
            if (res.data.data) {
              var status = 2
              if (that.data.index==3){
                status = 0
              }
              page = 1
              app.group.getMyGroupBuyList({
                page: page,
                size: 10,
                userId: app.globalData.userInfo.id,
                state: status
              }, app.globalData.token).then(res => {
                // 停止下拉动作  
                that.setData({
                  list: res.data.data.list
                })
              })
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000,
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goListDeatil(e) {
    var id = this.data.list[e.currentTarget.dataset.index].id
    var state = this.data.list[e.currentTarget.dataset.index].state
    wx.navigateTo({
      url: '/pages/orderDetailGroup/orderDetailGroup?id=' + id + '&state=' + state,
    })
  },
  groupShare(e) {
    console.log(e)
    var id = this.data.list[e.currentTarget.dataset.index].id
    wx.navigateTo({
      url: `/pages/groupShare/groupShare?collageId=${id}`
    })
  },
  clickTab(e) {
    var that = this
    var idx = e.currentTarget.dataset.idx;
    that.setData({
      index: idx
    })
    if (idx == 0) {
      page = 1
      app.group.getMyGroupBuyList({
        page: page,
        size: 10,
        userId: app.globalData.userInfo.id
      }, app.globalData.token).then(res => {
        console.log("全部", res.data.data.list)
        that.setData({
          list: res.data.data.list
        })
      })
    } else if (idx == 1) {
      page = 1
      app.group.getMyGroupBuyList({
        page: page,
        size: 10,
        state: 1,
        userId: app.globalData.userInfo.id
      }, app.globalData.token).then(res => {
        console.log("拼团中", res.data.data.list)
        that.setData({
          list: res.data.data.list
        })
      })
    } else if (idx == 2) {
      page = 1
      app.group.getMyGroupBuyList({
        page: page,
        size: 10,
        state: 2,
        userId: app.globalData.userInfo.id
      }, app.globalData.token).then(res => {
        console.log("已成团", res.data.data.list)
        that.setData({
          list: res.data.data.list
        })
      })
    } else if (idx == 3) {
      page = 1
      app.group.getMyGroupBuyList({
        page: page,
        size: 10,
        state: 0,
        userId: app.globalData.userInfo.id
      }, app.globalData.token).then(res => {
        console.log("已散团", res.data.data.list)
        that.setData({
          list: res.data.data.list
        })
      })
    }
  }
})