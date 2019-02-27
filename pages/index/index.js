const app = getApp();
var that;
Page({
  data: {
    searchAttrs: {
      isFocus: false,
      isDis: true
    },
    listCatalog: [{
        name: '全部课程',
        imgurl: '/images/curriculum1@2x.png',
        url: 'allClass'

      },
      {
        name: '大咖专栏',
        imgurl: '/images/special_column@2x.png',
        url: "payColumnList"
      },
      {
        name: '限时拼课',
        imgurl: '/images/Time_limit@2x.png',
        url: "lessTimeGroup"
      },
      {
        name: '咨询问答',
        imgurl: '/images/question_and_answer@2x.png',
        url: "questionAndAnswer"
      },
      {
        name: '名人课堂',
        imgurl: '/images/Lecturer_list@2x.png',
        url: 'storeDetail'
      },
      {
        name: '分享免费',
        imgurl: '/images/share_list.png',
        url: 'shareList'
      },

    ],
    listCatalog2: '',
    carouselData: [],
    freeList: [],
    choiceList: [],
    storeDetail: {},
    isIOS: app.globalData.isIOS
  },
  onLoad: function() {
    that = this;
    this.setData({
      isIOS: app.globalData.isIOS
    })
    wx.showLoading({
      title: '加载中...',
    })


  },
  onShow: function() {
    if (wx.getExtConfig) {
      wx.getExtConfig({
        success: function(res) {}
      })
    }

    if (that.data.choiceList.length == 0) {

      app.checkAuth(() => {
        Promise.all([

            app.apis.advertisement('list', {
              type: 1
            }, app.globalData.token),
            app.apis.course('listCollageIndex', {}, app.globalData.token),
            app.apis.store('getWithCount', {}, app.globalData.token)

          ])
          .then(res => {
            // console.log("Promise", res);
            wx.setNavigationBarTitle({

              title: (res[2].data.data.store && res[2].data.data.store.name) ? res[2].data.data.store.name : "知识付费",
            })
            app.globalData.customerPhone = res[2].data.data.store ? res[2].data.data.store.customerPhone : '';
            // console.log("storeDetail==>", res)
            this.setData({
              carouselData: res[0].data.data,
              freeList: res[1].data.data.freeList,
              choiceList: res[1].data.data.choiceList,
              storeDetail: res[2].data.data
            }, () => {

              app.globalData.payCrtl = wx.getExtConfigSync().payCrtl ^ res[2].data.data.store.payCrtl;

              app.globalData.imgPath = `http://${this.data.storeDetail.store.bucketDomain}`
              // wx.setStorageSync('imgPath', `http://${this.data.storeDetail.store.bucketDomain}`)
              wx.hideLoading()
              app.apis.message.countUnread({
                // storeId: app.globalData.userInfo.storeId,
                // userId: app.globalData.userInfo.storeId
              }, app.globalData.token)
              that.getCourseNew();
              that.getCourseHot();
            })
          })
      })
    }


  },
  enterType(e) {
    if (e.currentTarget.dataset.catalogid == "storeDetail") {
      wx.navigateTo({
        url: '../storeDetail/storeDetail?name=' + that.data.storeDetail.store.name + "&information=" + that.data.storeDetail.store.information
      })
    } else {
      wx.navigateTo({
        url: '/pages/' + e.currentTarget.dataset.catalogid + '/' + e.currentTarget.dataset.catalogid
      })

    }


  },
  clickSearch() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    if (!url.includes('index')) {} else {}
  },
  clickInput() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    if (url.includes('index')) {
      wx.navigateTo({
        url: '/pages/searchPage/searchPage'
      })
    } else {}
  },
  getMore(e) {
    wx.navigateTo({
      url: `/pages/courseList/courseList?index=${e.currentTarget.dataset.index}`
    })
  },
  goDetail(e) {
    console.log(e.detail.type)
    if (e.detail.type == "storeDetail") {
      wx.navigateTo({
        url: `/pages/${e.detail.type}/${e.detail.type}?param=${JSON.stringify(this.data.storeDetail)}`
      })
    } else {
      wx.navigateTo({
        url: `/pages/${e.detail.type}/${e.detail.type}?courseId=${e.detail.courseId}`
      })
    }
  },
  onPullDownRefresh() {

    Promise.all([

        app.apis.advertisement('list', {
          type: 1
        }, app.globalData.token),
        app.apis.course('listCollageIndex', {}, app.globalData.token),
        app.apis.store('getWithCount', {}, app.globalData.token)

      ])
      .then(res => {
        // console.log("Promise", res);
        wx.setNavigationBarTitle({
          title: res[2].data.data.store.name ? res[2].data.data.store.name : "知识付费",
        })
        // console.log("storeDetail==>", res)
        this.setData({
          carouselData: res[0].data.data,
          freeList: res[1].data.data.freeList,
          choiceList: res[1].data.data.choiceList,
          storeDetail: res[2].data.data
        }, () => {

          app.globalData.payCrtl = wx.getExtConfigSync().payCrtl ^ res[2].data.data.store.payCrtl;

          app.globalData.imgPath = `http://${this.data.storeDetail.store.bucketDomain}`
          // wx.setStorageSync('imgPath', `http://${this.data.storeDetail.store.bucketDomain}`)
          wx.hideLoading()
          wx.stopPullDownRefresh();
          app.apis.message.countUnread({
            // storeId: app.globalData.userInfo.storeId,
            // userId: app.globalData.userInfo.storeId
          }, app.globalData.token)

        })
      })

  },
  go_lunbo: function(e) {
    console.log("data-linkType", e.currentTarget.dataset.linktype);
    console.log("data-linkvalue", e.currentTarget.dataset.linkvalue);
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
  //查询热门
  getCourseHot: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/course/pageCourse",
      data: {
        page: 1,
        size: 3,
        catalogId: "",
        catalogSecondId: '',
        status: 40,
        isFree: '',
        orderType: 1
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        that.setData({
          hotList: res.data.data.list
        })
      }
    })
  },
  //查询最新
  getCourseNew: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/course/pageCourse",
      data: {
        page: 1,
        size: 3,
        status: 40,
        orderType: 2
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        that.setData({
          newList: res.data.data.list
        })
      }
    })
  },

  // goBind(){
  //   wx.navigateTo({
  //     url: '/pages/lectureBindPhone/lectureBindPhone',
  //   })
  // },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})