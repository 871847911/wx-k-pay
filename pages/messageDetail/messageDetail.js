// pages/messageDetail/messageDetail.js
const utils = require('../../utils/util.js')
const app = getApp()
var that;
Page({
  data: {
    index: '',
    courseId: '',
    messageDetail: {},
    consultDetail: '',
    consultId: null,
    inputValue: '',
    courseDetail: {},
    date: '',
    headUrl: "",
    scrolltop: 10000000,
  },
  onLoad: function(options) {
    that = this;
    // wx.showLoading({ title: '拼命加载中...' })
    console.log('options', options)
    // that.refresh(options.messageId);
    const {
      messageId = 0, courseId = "", createConsult = "", consultId
    } = options || 0;
    this.setData({
      index: options.type,
      courseId: options.courseId,
      createConsult,
      // headUrl: options.headUrl,
      consultId: options.consultId == null ? '' : options.consultId
    }, () => {
      console.log('this.data', this.consultId)

      if (courseId != "") {
        //获取课程信息
        app.apis.course('getDetail', {
          courseId
        }, app.globalData.token).then(res => {
          console.log("获取课程信息", res)
          if (res.data.success) {
            this.setData({
              courseDetail: res.data.data.courseMain,
              isType: app.globalData.userInfo.id == res.data.data.courseMain.userId ? 2 : 1
            })
          }
        })
      }


      //根据不同的type显示不同的消息详情
      if (options.type == 'message_0') {
        wx.setNavigationBarTitle({
          title: '讲师咨询',
        })

        //非第一次进入该课程的咨询 => 获取消息记录
        // if (this.data.consultId && this.data.consultId != 'null') {
        //   console.log('非第一次进入', this.data.consultId)
        this.initData()
        // }

      } else if (options.type == 'message_1') {
        wx.setNavigationBarTitle({
          title: '消息',
        })

        //获取系统消息并标记已读
        app.apis.message.getAndRead({
          messageId
        }, app.globalData.token).then(res => {
          console.log('消息详情', res);
          var types = res.data.data.type;
          var title;
          if (types == 11 || types == 12) {
            title = "入驻审核通知"
          } else {
            if (types == 21 || types == 22) {
              title = "课程审核通知"
            } else {
              title = "课程下架通知"

            }
          }
          this.setData({
            title: title,
            bizId: res.data.data.bizId
          })
          this.setData({
            messageDetail: res.data.data
          }, () => {

            //更新未读消息数量
            app.apis.message.countUnread({
              storeId: app.globalData.userInfo.storeId,
              userId: app.globalData.userInfo.storeId
            }, app.globalData.token)
          })
        })
      }

    })
    //第一次进入咨询
    if (createConsult == "createConsult") {

    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var myDate = new Date()
    this.setData({
      date: myDate.getHours() + ':' + myDate.getMinutes()
    })
  },

  initData() {
    var param = {}
    if (this.data.consultId) {
      param.consultId = this.data.consultId
    }
    if (this.data.courseId) {
      param.courseId = this.data.courseId
    }

    app.apis.consult('listChat', param, app.globalData.token)
      .then(res => {
        console.log("讲师信息", res)
        if (this.data.headUrl == "") {
          this.setData({
            headUrl: res.data.data.lecturer.headUrl,
            consultId: res.data.data.consultId
          })

        }
        this.setData({
          consultDetail: res.data.data
        })
        wx.createSelectorQuery().selectViewport("#react").boundingClientRect(function(rect) {
          console.log(rect)
          wx.pageScrollTo({
            scrollTop: 10000,
            duration: 0
          })
        }).exec()
      })
  },
  //qvkong
  clean: function(m) {
    while ((m.length > 0) && (m.charAt(0) == ' '))
      m = m.substring(1, m.length);
    while ((m.length > 0) && (m.charAt(m.length - 1) == ' '))
      m = m.substring(0, m.length - 1);
    return m;
  },
  sendMes(e) {
    let that = this
    var inputValue = this.clean(e.detail.value.input);
    console.log("inputValue==>", inputValue)
    if (inputValue != "") {
      that.setData({
        inputValue: e.detail.value.input
      }, () => {
        //第一发送
        if (!this.data.consultId || this.data.consultId === 'null') {
          app.apis.consult('createConsult', {
              courseId: that.data.courseId,
              content: e.detail.value.input
            }, app.globalData.token, 'POST')
            .then(res => {
              if (res.data.success) {
                that.setData({
                  consultId: res.data.data
                }, () => {
                  that.initData()
                  that.reset()
                })
              }
            })
        } else {
          app.apis.consult('createChat', {
              consultId: that.data.consultId,
              chatType: that.data.isType,
              content: e.detail.value.input
            }, app.globalData.token, 'POST')
            .then(res => {
              if (res.data.success) {
                that.initData()
                that.reset()

              }
            })
        }
        // this.pageScrollToBottom();
      })
    }
  },
  reset(e) {
    // console.log('form发生了reset事件',e)
    this.setData({
      inputValue: ''
    })
  },
  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function() {
    wx.createSelectorQuery().select('#react').boundingClientRect(function(rect) {
      // rect.id      // 节点的ID
      // rect.dataset // 节点的dataset
      // rect.left    // 节点的左边界坐标
      // rect.right   // 节点的右边界坐标
      // rect.top     // 节点的上边界坐标
      // rect.bottom  // 节点的下边界坐标
      // rect.width   // 节点的宽度
      console.log('xxxxxxxxxxxxxxzzzzzzzzzz-------', rect);
      wx.pageScrollTo({
        scrollTop: rect.height,
        duration: 100
      })
      // rect.height  // 节点的高度
    }).exec()
  },
  goCourseDetail: function() {
    wx.navigateTo({
      url: '../courseDetail/courseDetail?courseId=' + that.data.bizId +"&page=courseBuyed",
    })
  },
  refresh: function(subscribeId) {
    wx.request({
      url: app.globalData.httpUrl + "/app/subscribe/refresh",
      data: {
        subscribeId: subscribeId
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "POST",
      success: function(res) {
        console.log("刷新", res)
      }
    })
  }


})