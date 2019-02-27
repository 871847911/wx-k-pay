Component({
  data: {
    isArrow: false, //是否有右箭头
    imgPath: ''
  },
  properties: {
    listInfo: {
      type: String,
      value: '',
    },
    storeDetail: {
      type: Object,
      value: {},
    },
    courseList: {
      type: Object,
      value: {},
    },
    lecturerList: {
      type: Object,
      value: {},
    },
    systemMessage: {
      type: Array,
      value: [],
    },
    orderList: {
      type: Array,
      value: [],
    },
    consultMessage: {
      type: Array,
      value: [],
    },
    consultHeadData: {
      type: Object,
      value: {},
    },
    noticeMessage: {
      type: Array,
      value: [],
    },
    lessonList: {
      type: Array,
      value: [],
    },
    spellingLessonList: {
      type: Array,
      value: [],
    },
   
    bindgoDetails: {
      type: String,
      value: '',
    },
    bindgoprogress: {
      type: String,
      value: '',
    },
    bindgo: {
      type: String,
      value: '',
    },
    isIOS: {
      type: Boolean,
      value: false
    }
  },
  attached: function() {
    // 可以在这里发起网络请求获取插件的数据,组件生命周期函数，在组件实例进入页面节点树时执行
    this.setData({
      imgPath: wx.getStorageSync('imgPath')
    })
  },
  methods: {
    clickRoute() {
      this.triggerEvent()
    },
    bindgoDetails(e) {
      wx.navigateTo({
        url: `/pages/sharingProgress/sharingProgress?courseId=${e.currentTarget.dataset.courseid}`,
      })
    },
    bindgoprogress(e) {
      wx.navigateTo({
        url: `/pages/courseDetail/courseDetail?courseId=${e.currentTarget.dataset.courseid}`,
      })
    },
    goDetail(e) {
      console.log('eeeeeeeeeeeeeeeeee', e.currentTarget.dataset)
      var detail = {
        type: e.currentTarget.dataset.listtype,
        courseId: e.currentTarget.dataset.courseid,
        lecturerId: e.currentTarget.dataset.lecturerid,
        messageId: e.currentTarget.dataset.messageid,
        consultId: e.currentTarget.dataset.consultid,
        subscribeid: e.currentTarget.dataset.subscribeid,
        date: e.currentTarget.dataset.date
      }
      this.triggerEvent('goDetail', detail)
    },
    payOrder(e) {
      var detail = e.currentTarget.dataset.orderinfo;
      const app = getApp();
      app.apis.order('createUnifyOrder', {
          wechatOrderId: detail.wechatOrderId
        }, app.globalData.token, 'POST')
        .then(res => {
          if (res.data.success) {
            app.wechat.requestPayment(res.data.data)
              .then(res => {
                wx.redirectTo({
                  url: '/pages/orderDetail/orderDetail?orderId=' + detail.id,
                })
              })
              .catch(res => {
                wx.showToast({
                  title: '交易失败',
                  icon: "none"
                })

              })
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.message,
              duration: 2000
            })
          }
        })
    },
    delOrder(e) {
      console.log('payOrderlist', e)
      var orderId = e.currentTarget.dataset.orderinfo.id
      this.triggerEvent('delOrder', {
        orderId
      })
    },
    handClickOrder(e) {
      console.log(e)
      var orderId = e.currentTarget.dataset.orderinfo.id
      this.triggerEvent('handClickOrder', {
        orderId
      })
    },
    goIndex() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})