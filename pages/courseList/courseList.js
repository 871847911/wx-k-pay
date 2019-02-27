// pages/courseList/courseList.js

const app = getApp()
var that;
var page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    courseList: [],
    newCourseList: [],
    emptyJson: {
      imgUrl: '/images/no_order_icon@2x.png',
      des: '暂无课程'
    },
    catalogId: '',
    lecturerId: '',
    payCrtl: true,
    isIOS: app.globalData.isIOS,
    course: ['全部', '公开', '精选'],
    hasNextPage: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    page = 1;
    that = this;
    console.log(options)

    var {
      catalogId = "", lecturerId = "", isFree = "", index = 0,date=""
    } = options
    console.log("catalogId==>", app.globalData.payCtrl)
    this.setData({
      payCrtl: app.globalData.payCrtl,
      catalogId: options.catalogId == null ? '':options.catalogId,
      lecturerId: options.lecturerId == null ? '' : options.lecturerId,
      date: options.date == null ? '' : options.date,
      index
    }, () => {
      this.getCourse(page, this.data.catalogId, this.data.lecturerId, (index == 0 ? '' : (index == 1 ? 1 : 0)),this.data.date)

    })

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (that.data.hasNextPage) {
      if (that.data.index == 0) {
        page = page + 1;
        this.getCourse(page, this.data.catalogId, this.data.lecturerId, "")

      } else if (that.data.index == 1) {
        page = page + 1;
        this.getCourse(page, this.data.catalogId, this.data.lecturerId, 1)
      } else if (that.data.index == 2) {
        page = page + 1;
        this.getCourse(page, this.data.catalogId, this.data.lecturerId, 0)
      }
    } else {
      wx.showToast({
        title: '已经全部加载',
        icon:'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  clickTab(e) {

    page = 1;
    that.setData({
      courseList: []
    })
    console.log("clickTab", page)
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      index: idx
    })
    if (idx == 0) {
      this.getCourse(page, this.data.catalogId, this.data.lecturerId, "")

    } else if (idx == 1) {

      this.getCourse(page, this.data.catalogId, this.data.lecturerId, 1)
    } else if (idx == 2) {

      this.getCourse(page, this.data.catalogId, this.data.lecturerId, 0)
    }
  },
  goDetail(e) {
    console.log('eeee', e)
    wx.navigateTo({
      url: `/pages/${e.detail.type}/${e.detail.type}?courseId=${e.detail.courseId}`
    })
  },
  //查询课程
  getCourse: function (page, catalogId, lecturerId, isFree, minOnDate) {
    wx.request({
      url: app.globalData.httpUrl + "/app/course/pageCourse",
      data: {
        page: page,
        size: 10,
        catalogId: catalogId,
        lecturerId: lecturerId,
        isFree: isFree,
        status: 40,
        minOnDate: minOnDate == null ? '' : minOnDate
    
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        var newCourseList = that.data.courseList;
        var courseList = res.data.data.list;
        for (var i = 0; i < courseList.length; i++) {
          newCourseList.push(courseList[i]);
        }
        console.log("课程列表", page)
        console.log('课程列表', res)
        that.setData({
          courseList: newCourseList,
          hasNextPage:res.data.data.hasNextPage
        })
      }
    })
  }
})