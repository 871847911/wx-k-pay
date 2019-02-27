// pages/producerDetail/producerDetail.js
const app = getApp()
 var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    tab:["课程","专栏"],
    showData: '',
    readMore: false,
    isOrder: false,
    actions2: [{
      name: '确定',
      color: '#FE3B2F'
    }],
    producerDetail: [],
    isMore: false,
    contentH: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    that=this;
    var {
      lecturerId
    } = options


    app.apis.lecturer('detail', {
      lecturerId
    }, app.globalData.token).then(res => {
      console.log('讲师详情', res)
      this.setData({
        producerDetail: res.data.data,
        columnList: res.data.data.columnList
      }, () => {

        // var string = (this.data.producerDetail.lecturer.introduce).substring(0, 66) + '...'
        var introduce = this.data.producerDetail.lecturer.introduce
        this.setData({
          showData: introduce ? introduce :'学主有点儿懒，未介绍自己~'
        })
        //获取节点高度
        wx.createSelectorQuery().select('.user-intr').boundingClientRect(function (rect) {
          if (rect.height > 63) {
            that.data.isMore = true
          }
          that.setData({
            contentH: rect.height,
            isMore: that.data.isMore
          })
          console.log(that.data.contentH)
        }).exec()

      })
    })
  },
  //选择tab
  changeTab:function(e){
    console.log("change", e.currentTarget.dataset.id)
    that.setData({
      id: e.currentTarget.dataset.id
    })
  },
  read2() {
    console.log('点击了阅读更多')
    this.setData({
      readMore: !this.data.readMore
    })
    // if(this.data.readMore){
    this.setData({
      isMore: !this.data.isMore
    })
    // }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  order() {
    //订阅
    if (this.data.producerDetail.lecturer.id == app.globalData.userInfo.id){
     wx.showToast({
       title: '这是你自己',
       icon:'none'
     })
    }else{
      if (!this.data.producerDetail.subscribed) {
        app.apis.subscribe('subscribe', {
          lecturerId: this.data.producerDetail.lecturer.id
        }, app.globalData.token, 'POST')
          .then(res => {
            console.log('res', res)
            this.setData({
              'producerDetail.subscribed': !this.data.producerDetail.subscribed
            })
          })
      } else {
        this.setData({
          visible2: true
        })
      }
    }
  },
  read() {
    console.log('readMore')
    this.setData({
      readMore: !this.data.readMore
    })
    if (this.data.readMore) {
      this.setData({
        showData: this.data.producerDetail.lecturer.introduce
      })
    } else {
      var string = (this.data.producerDetail.lecturer.introduce).substring(0, 66) + '...'
      this.setData({
        showData: string
      })
    }
  },
  goDetail(e) {
    var Type = e.currentTarget.dataset.listtype;
    // this.triggerEvent('goDetail', detail)
    // wx.navigateTo({
    //   url: '/pages/courseDetail/courseDetail'
    // })
    wx.navigateTo({
      url: `/pages/${e.detail.type}/${e.detail.type}?courseId=${e.detail.courseId}`
    })
  },
  handleOpen2() {
    this.setData({
      visible2: true
    });
  },
  handleCancel2() {
    this.setData({
      visible2: false
    });
  },
  handleClickItem2() {
    app.apis.subscribe('cancel', { lecturerId: this.data.producerDetail.lecturer.id }, app.globalData.token, 'POST').then(res => {
        console.log('res', res)
        // 取消订阅
        this.setData({
          visible2: false,
          'producerDetail.subscribed': false
        })
      })
  },
  //t跳转专栏详情
  goColumDetali:function(e){
    console.log("跳转专栏", e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../payColumnDetail/payColumnDetail?columnId=' + that.data.columnList[e.currentTarget.dataset.id].id,
    })
  }
})