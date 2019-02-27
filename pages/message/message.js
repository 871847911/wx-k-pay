const app = getApp()
var that;
const utils = require('../../utils/util.js')
Page({
  data: {
    index: 0,
    message_index: 'message_0',
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无相关信息'
    },
    list: [],
    items: [],
    page: 1,
    size: 6,
    pages: 1 //总页数
  },
  onLoad: function() {
    that = this;

  },
  onShow: function() {
    var e = {
      currentTarget: {
        dataset: {
          idx: this.data.index
        }
      }
    }
    this.clickTab(e)
  },
  clickTab(e) {
    var that = this
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      items: [],
      list: [],
      page: 1,
      pages: 1,
      index: idx,
      message_index: 'message_' + idx
    })
    if (idx == 0) {
      that.pageConsult()
    } else if (idx == 1) {
      that.systemMessage()
    } else if (idx == 2) {
      that.noticeMessage()
    }
  },
  pageConsult() { //咨询反馈
    var that = this
    app.apis.user('pageConsult', {
      page: that.data.page,
      size: that.data.size
    }, app.globalData.token).then(res => {
      var lists = that.data.list
      that.setData({
        items: res.data.data.list,
        page: that.data.page + 1,
        pages: res.data.data.pages
      })
      lists = lists.concat(that.data.items)
      that.setData({
        list: lists
      })
    })
  },
  systemMessage() { //系统消息
    var that = this
    app.apis.message.page({
      page: that.data.page,
      size: that.data.size
    }, app.globalData.token).then(res => {
      var lists = that.data.list
      that.setData({
        items: res.data.data.list,
        page: that.data.page + 1,
        pages: res.data.data.pages
      })
      lists = lists.concat(that.data.items)
      that.setData({
        list: lists
      })
    })
  },
  noticeMessage() { //关注通知
    var that = this
    app.apis.subscribe('pageNotice', {
      page: that.data.page,
      size: that.data.size
    }, app.globalData.token).then(res => {
      var lists = that.data.list
      that.setData({
        items: res.data.data.list,
        page: that.data.page + 1,
        pages: res.data.data.pages
      })
      lists = lists.concat(that.data.items)
      that.setData({
        list: lists
      })
    })
  },
  goDetail(e) {
    console.log("消息通知-------", e)
    const Type = e.detail.type;
    if (Type == 'message_0') {
      wx.navigateTo({
        url: `/pages/messageDetail/messageDetail?type=${Type}&consultId=${e.detail.consultId}&courseId=${e.detail.courseId}`
      })
    } else if (Type == 'message_1') {
      wx.navigateTo({
        url: `/pages/messageDetail/messageDetail?type=${Type}&messageId=${e.detail.messageId}`
      })
    } else {
      that.refresh(e.detail.subscribeid, e)
      console.log(e.detail)
     
    }
  },
  onReachBottom() {
    var e = {
      currentTarget: {
        dataset: {
          idx: this.data.index
        }
      }
    }
    if (this.data.page <= this.data.pages) //当前将获取的页码不超过总页数		        
    {
      if (this.data.index == 0) {
        this.pageConsult()
      } else if (this.data.index == 1) {
        this.systemMessage()
      } else if (this.data.index == 2) {
        this.noticeMessage()
      }
    }
  },
  refresh: function(subscribeId,e) {
    wx.request({
      url: app.globalData.httpUrl + "/app/subscribe/refresh",
      data: {
        subscribeId: subscribeId
      },
      header: {
      'content-type': 'application/x-www-form-urlencoded' 
      },
      method: "POST",
      success: function(res) {
        console.log(res);
        wx.navigateTo({
          url: `/pages/courseList/courseList?lecturerId=${e.detail.lecturerId}&subscribeid=${e.detail.subscribeid}&date=${e.detail.date}`
        })
      }
    })
  }
})