// pages/allClass/allClass.js
var app = getApp();
var that;
var page = 1;
var tabid;
var onlickCounts = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [{
      name: "类型",
      imgurl: ['312068266341847675.png', '282940987480353887.png']
    }, {
      name: "综合排序",
      imgurl: ['312068266341847675.png', '282940987480353887.png']
    }, {
      name: "筛选",
      imgurl: ['493326471934407972.png', "541148862929864785.png"]
    }, ],

    list: ["", "", "", "", "", "", "", "", ""],
    sort: ["人气最高", "最新发布"],
    courseTitle: ['全部', '公开', '精选'],
    ifshow: false,
    ifshow1: false,
    ifshow2: false,
    ifshow3: false,
    tabid: 0,
    itemid: -1,
    sortid: -1,
    id: -1,
    typeid: -1,
    courseList: [],
    hasNextPage: true,
    titleList: [], //一级分类列表,
    secondList: [], //二级分类,
    catalogId: '', // 一级id
    catalogSecondId: '', //二级id,
    isFree: "", //是否免费 0付费，1免费,
    orderType: '', //排序方式 (1人气最高 2最新发布)


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    page = 1;
    that = this;
    console.log("options", options)
    if (options.catalogId == null){
      this.getCourse("", "", 1, "", "");
    }else{
      this.getCourse(options.catalogId, options.catalogSecondId, 1, "", "");
     var tab  = this.data.tab;
      tab[0].name = options.secondIdName;
      this.setData({
        tab: tab
      })
    }
    this.getListCatalog("type", "1");
    
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
    console.log("aaa")
    if (that.data.hasNextPage) {
      page = page + 1;
      that.getCourse(that.data.catalogId, that.data.catalogSecondId, page, that.data.isFree, that.data.orderType);
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //点击分类
  chose_bt: function(e) {
    onlickCounts = onlickCounts + 1;
    console.log("onlickCounts", onlickCounts);
    console.log("tab", e.currentTarget.dataset.tabid);
    if (tabid != e.currentTarget.dataset.tabid) {
      tabid = e.currentTarget.dataset.tabid;
      onlickCounts = 1;
    } else {
      if (onlickCounts % 2 == 0) {
        that.cancleShow();
        return;
      }
    }

    if (tabid == 0) {
      that.setData({
        ifshow: true,
        ifshow1: true,
        ifshow2: false,
        ifshow3: false,
        tabid: tabid
      })
    } else if (tabid == 1) {
      that.setData({
        ifshow: true,
        ifshow1: false,
        ifshow2: true,
        ifshow3: false,
        tabid: tabid
      })
    } else if (tabid == 2) {
      that.setData({
        ifshow: true,
        ifshow1: false,
        ifshow2: false,
        ifshow3: true,
        tabid: tabid
      })
    }


  },
  //选择一级并查询出二级
  choese_type: function(e) {
    console.log("一级类选择", e.currentTarget.dataset.id);
    that.setData({
      id: e.currentTarget.dataset.id
    })
    var name = that.data.titleList[e.currentTarget.dataset.id].name;
    var parentId = that.data.titleList[e.currentTarget.dataset.id].id;
    console.log("一级id", parentId)
    this.getSecondListCatalog(parentId);

    that.setData({

      catalogId: parentId
    })
  },
  //选择二级并查询课程
  chose_item: function(e) {
    that.setData({
      hasNextPage: true
    })
    that.sureOnlickChoese();
    console.log("二级分类选择", e.currentTarget.dataset.itemid);
    var secondList = that.data.secondList;
    var catalogSecondId = secondList[e.currentTarget.dataset.itemid].id
    console.log("2级id", secondList);
    var list = [];
    var tab = that.data.tab;
    tab[0].name = secondList[e.currentTarget.dataset.itemid].name

    that.setData({
      courseList: list,
      tab: tab
    })
    that.getCourse(that.data.catalogId, catalogSecondId, 1, that.data.isFree, that.data.orderType);
    that.setData({
      itemid: e.currentTarget.dataset.itemid,
      catalogSecondId: catalogSecondId
    })
  },
  //选择排序方式
  choese_sort: function(e) {
    that.setData({ //清空
      courseList: [],
      hasNextPage: true
    })
    var tab = that.data.tab;
    tab[1].name = that.data.sort[e.currentTarget.dataset.sortid]
    that.setData({
      sortid: e.currentTarget.dataset.sortid,
      orderType: e.currentTarget.dataset.sortid + 1,
      tab: tab
    })
    that.getCourse(that.data.catalogId, that.data.catalogSecondId, 1, that.data.isFree, e.currentTarget.dataset.sortid + 1);
    that.sureOnlickChoese();
  },
  //选择课程类型全部免费付费
  choese_typeid: function(e) {
    that.setData({ //清空
      courseList: [],
      hasNextPage: true
    })

    var tab = that.data.tab;
    tab[2].name = that.data.courseTitle[e.currentTarget.dataset.typeid]
    that.setData({
      tab: tab
    })
    if (e.currentTarget.dataset.typeid == 0) {
      that.getCourse(that.data.catalogId, that.data.catalogSecondId, 1, "", that.data.orderType);
      that.setData({
        isFree: ""
      })

    } else if (e.currentTarget.dataset.typeid == 1) {
      that.getCourse(that.data.catalogId, that.data.catalogSecondId, 1, 1, that.data.orderType);
      that.setData({
        isFree: 1
      })
    } else {
      that.getCourse(that.data.catalogId, that.data.catalogSecondId, 1, 0, that.data.orderType);
      that.setData({
        isFree: 0
      })
    }
    that.setData({
      typeid: e.currentTarget.dataset.typeid
    })
    that.sureOnlickChoese();
  },
  //点在空白区域
  cancleShow: function() {

    that.sureOnlickChoese();
  },

  //完成点击消失蒙层
  sureOnlickChoese: function() {
    onlickCounts = 0;
    that.setData({
      ifshow: false,
      ifshow1: false,
      ifshow2: false,
      ifshow3: false,
    })
  },
  //查询全部课程
  getCourse: function(catalogId, catalogSecondId, page, isFree, orderType) {
    wx.request({
      url: app.globalData.httpUrl + "/app/course/pageCourse",
      data: {
        page: page,
        size: 10,
        catalogId: catalogId,
        catalogSecondId: catalogSecondId,
        status: 40,
        isFree: isFree,
        orderType: orderType
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

        // console.log('课程列表', res)
        that.setData({
          courseList: newCourseList,
          hasNextPage: res.data.data.hasNextPage
        })
      }
    })
  },
  //获取一级分类
  getListCatalog: function(key, value) {
    var key = key;
    wx.request({
      url: app.globalData.httpUrl + "/app/course/listCatalog",
      data: {
        type: value,
        showCatalog: 1
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("一级分类", res)
        that.setData({
          titleList: res.data.data
        })
      }
    })
  },
  //获取二级分类
  getSecondListCatalog: function(parentId) {

    wx.request({
      url: app.globalData.httpUrl + "/app/course/listCatalog",
      data: {
        parentId: parentId,
        showCatalog: 1
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("二级分类", res)
        var list = [{
          name: "全部",
          id: ''
        }]

        for (var i = 0; i < res.data.data.length; i++) {
          list.push(res.data.data[i]);

        }


        that.setData({
          secondList: list
        })
      }
    })
  },
  //查询二级全部课程
  getSecondCourse: function(catalogSecondId) {
    wx.request({
      url: app.globalData.httpUrl + "/app/course/pageCourse",
      data: {
        page: 1,
        size: 10,
        catalogSecondId: catalogSecondId,
        status: 40
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

        that.setData({
          courseList: newCourseList,
          hasNextPage: res.data.data.hasNextPage
        })
      }
    })
  },
  //跳转课程详情页
  goCourseDtail: function(e) {

    var id = that.data.courseList[e.currentTarget.dataset.id].id
    wx.navigateTo({

      url: '../courseDetail/courseDetail?courseId=' + id,
    })
  }
})