// pages/orderDetailGroup/orderDetailGroup.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupId: '', //团ID
    courseId: '', //课程ID
    needNums: '', //还需拼团人数
    groupData: {}, //请求回来的数据data 
    groupOrder:'',//订单编号过滤数据
    state:'',// 0参团 1退款中 2退款
    ismask:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 第一步 由我的拼团 传参 团id options.id
    //不能传 假如订单在点击进来的瞬间成团了 显示拼团信息错误 
    wx.showLoading({ mask: true, title: '生成中' })
    this.setData({
      groupId: options.id,
    })
    this.getOrder()
  },
  getOrder() {
    let that = this
    let params = {
      userId: app.globalData.userInfo.id,//80
      groupId: that.data.groupId,
    }

    // 拼团订单详情
    app.group.getAppGroupOrderDTO(params, app.globalData.token).then(res => {
      if (res.data.success && !!res.data.data) {
        let {
          addNum,
          participateNum,
          courseId,
          modifyDate,
          state,
          groupOrder,
        } = res.data.data
        this.setData({
          groupData: res.data.data,
          needNums: addNum - participateNum, //差几人成团
          modifyDate: modifyDate.slice(0, -5), //下单时间
          courseId, //课程id
          state,//订单的状态1、参团 2、退款中 3、已退款 拼团中根据人数来判断
          groupOrder:groupOrder.length >20?groupOrder.slice(10):groupOrder,
          ismask:false
        })
        wx.hideLoading()
      }
    })
  },
  del(e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除订单吗？',
      success: function (res) {
        if (res.confirm) {
          let params = {
            userId: app.globalData.userInfo.id,//80
            groupId: that.data.groupId
          }
          app.group.deleteGroupOrder(params, app.globalData.token).then(res => {
            if (res.data) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000,
                success: () => {
                  setTimeout(() => {
                    wx.navigateTo({
                      url: '/pages/myGroupList/myGroupList'
                    })
                  }, 2000)
                }
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
  goList_addFriend(e) {
    if (this.data.state == 0 && this.data.needNums > 0) {
      console.log('邀请好友 this', this)
      wx.navigateTo({
        url: `/pages/groupShare/groupShare?collageId=${this.data.groupId}&courseId=${this.data.courseId}`
      })
    } else {
      console.log('再去逛逛 this', this)
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  copyOrder(e) {
    console.log('复制=>', e)
    let data = this.data.groupData.groupOrder
    wx.setClipboardData({
      data: data,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onShareAppMessage: function () {}
})