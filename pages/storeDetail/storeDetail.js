// pages/storeDetail/storeDetail.js
const app = getApp()
var that;
var showData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attr: {
      height: 416,
      bor: 0
    },
    simpleData: '国立艺术职业学校。1933-1945年间学校也不可避免地处于纳粹独裁之下，并遭受了严重的战争破坏。1955年学校重建，30年来没有实现的愿望终于付诸实施，学校增设了建筑系并终于由地方性的艺术学校扩建为国立美术学院。现设有建筑、雕塑、舞台背景设计、工业设计、产品设计、印刷、电影、摄影、绘画、视觉艺术、艺术教育等专业并终于由地方性的艺术学校扩建为国立美术学院。现设有建筑、雕塑、舞台背景设计、工业设计、产品设计、印刷、电影、摄影、绘画、视觉艺术、艺术教育等专业并终于由地方性的艺术学校扩建为国立美术学院。现设有建筑、雕塑、舞台背景设计、工业设计、产品设计、印刷、电影、摄影、绘画、视觉艺术、艺术教育等专业。',
    showData: '',
    readMore: false,
    carouselData: [],
    storeDetail: '',
    lecturerList: [],
    isMore: false,
    contentH: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    showData = options.information
    console.log("storeDetail==>", options)
    this.setData({
      name: options.name,

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
    Promise.all([
      app.apis.advertisement('list', {
        type: 2
      }, app.globalData.token),
      app.apis.lecturer('page', {
        page: 1,
        size: 10
      }, app.globalData.token),
    ]).then(res => {
      console.log(res)
      this.setData({
        // storeDetail: JSON.parse(options.param),
        carouselData: res[0].data.data,
        lecturerList: res[1].data.data,
      }, () => {
        this.setData({
          // storeDetail: JSON.parse(options.param)
        }, () => {
          //var string = (this.data.storeDetail.store.information).substring(0, 72) + '...'
          // var string = this.data.storeDetail.store.information
          this.setData({
            showData: showData
          })
          //获取节点高度
          wx.createSelectorQuery().select('.content').boundingClientRect(function(rect) {
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
    })
  },

  ad() {
    console.log('xxx')
    this.setData({
      readMore: !this.data.readMore
    })
    if (this.data.readMore) {
      this.setData({
        showData: this.data.storeDetail.store.information
      })
    } else {
      var string = (this.data.storeDetail.store.information).substring(0, 72) + '...'
      this.setData({
        showData: string
      })
    }
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
  goDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/${e.detail.type}/${e.detail.type}?lecturerId=${e.detail.lecturerId}`
    })
  },

  go_lunbo: function(e) {

    if (e.currentTarget.dataset.linktype == 1) { //课程
      wx.navigateTo({
        url: '../courseDetail/courseDetail?courseId=' + e.currentTarget.dataset.linkvalue,
      })
    } else if (e.currentTarget.dataset.linktype == 2) { //讲师
      wx.navigateTo({
        url: '../producerDetail/producerDetail?lecturerId=' + e.currentTarget.dataset.linkvalue,
      })
    } else if (e.currentTarget.dataset.linktype == 3) { //营销
      if (e.currentTarget.dataset.linkvalue == 1) { //拼团
        wx.navigateTo({
          url: '../lessTimeGroup/lessTimeGroup',
        })
      }
      if (e.currentTarget.dataset.linkvalue == 2) { //分享
        wx.navigateTo({
          url: '../shareList/shareList',
        })
      }
    } else if (e.currentTarget.dataset.linktype == 4) { //专栏
      wx.navigateTo({
        url: '../payColumnDetail/payColumnDetail?columnId=' + e.currentTarget.dataset.linkvalue,
      })
    }
  },
})