const app = getApp()
var that;
Page({
  data: {
    searchAttrs: {
      isFocus: true,
      isDis: ''
    },
    pageInfo: ['综合', '课程', '讲师'],
    index: 0,
    isRes: false,
    isEmpty: false,
    listSearchHistory: ['人工智能'],
    courseList: [],
    lecturerList: []
  },
  onLoad: function(options) {
    that = this;
    // Do some initialize when page load.
    app.apis.search('listSearchHistory', {}, app.globalData.token)
      .then(res => {
        console.log('查询搜索历史', res)
        this.setData({
          listSearchHistory: Object.assign(this.data.listSearchHistory, res.data.data)
        })
      })
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
    // Do something when page show.
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function() {
    // return custom share data when user share.
  },
  onPageScroll: function() {
    // Do something when page scroll
  },
  onTabItemTap(item) {
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
  // Event handler.
  clickSearch(e) {
    const keywords = e.detail;
    if (e.detail.length == 0) {
      return
    }
    console.log('点击搜索clickSearch', e)
    // app.apis.search('searchAll', {
    // 杭州首页搜索 
    that.setData({
      keywords: keywords
    })
    app.apis.search('searchCollageAll', {
        keywords: keywords
      }, app.globalData.token)
      .then(res => {
        this.setData({
          isRes: true
        })
        if (res.data.data.courseList.length == 0 && res.data.data.lecturerList.length == 0) {
          this.setData({
            isEmpty: true
          })
        } else {
          this.setData({
            courseList: res.data.data.courseList,
            lecturerList: res.data.data.lecturerList
          })

        }
        console.log('searchAll', res)
      })
  },
  //点击切换tab页
  clickTab(e) {
    var idx = e.currentTarget.dataset.idx;
    console.log(idx)
    this.setData({
      index: idx
    }, () => {
      if (idx == 1) {
        app.apis.search('searchCoursePage', {
            page: 1,
            keywords: that.data.keywords
          }, app.globalData.token)
          .then(res => {
            console.log('分页查询课程', res.data.data.list)
            that.setData({
              courseList: res.data.data.list
            })
          })
      } else if (idx == 2) {
        app.apis.search('searchLecturerPage', {
            page: 1,
            keywords: that.data.keywords
          }, app.globalData.token)
          .then(res => {
            console.log('分页查询讲师')
            that.setData({
              lecturerList: res.data.data.list
            })
          })
      }
    })
  },
  cancel() {
    this.setData({
      isRes: false,
      isEmpty: false
    })
  },
  clearHis() {
    this.setData({
      listSearchHistory: []
    })
  },
  getHistory(e) { //历史
    var e = {
      detail: e.currentTarget.dataset.item
    }
    this.clickSearch(e)
  },
  getMore(e) {
    console.log(e.currentTarget.dataset.index)
    var e = {
      currentTarget: {
        dataset: {
          idx: e.currentTarget.dataset.index
        }
      }
    }
    this.clickTab(e)
  },
  goDetail(e) {
    console.log("跳转详情", e)
    if (e.type == "goDetail") {
      wx.navigateTo({
        url: `/pages/${e.detail.type}/${e.detail.type}?courseId=${e.detail.courseId}`
      })
    } else {
      wx.navigateTo({
        url: `/pages/${e.detail.type}/${e.detail.type}?lecturerId=${e.detail.lecturerId}`
      })
    }
  },

})