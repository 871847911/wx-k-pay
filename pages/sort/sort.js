// pages/sort/sort.js
var app = getApp();
var that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifshow: false,
    ifshow1: false,
    ifshow2: false,
    ifshow3: false,
    tabid: 0,
    itemid: -1,
    sortid: -1,
    id: 0,
    typeid: -1,
    courseList: [],
    hasNextPage: true,
    titleList: [], //一级分类列表,
    secondList: [], //二级分类,
    catalogId: '', // 一级id
    catalogSecondId: '', //二级id,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     that = this;
    this.getListCatalog("type", "1");
 
  },

  //获取一级分类
  getListCatalog: function (key, value) {
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
      success: function (res) {
        console.log("一级分类", res)
        var titleList =res.data.data;
        that.setData({
          titleList: titleList,
          catalogId: titleList[0].id
        },res=>{
          console.log("2", titleList)
          that.getSecondListCatalog(titleList[0].id)
        })
      }
    })
  },
  //获取二级分类
  getSecondListCatalog: function (parentId) {

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
      success: function (res) {
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

  //选择一级并查询出二级
  choese_type: function (e) {
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
  //选择二级跳转allclass页面
  chose_item: function (e) {
    that.setData({
      hasNextPage: true
    })
    console.log("二级分类选择", e.currentTarget.dataset.itemid);
    var secondList = that.data.secondList;
    var catalogSecondId = secondList[e.currentTarget.dataset.itemid].id
    var secondIdName = secondList[e.currentTarget.dataset.itemid].name
    console.log("2级id", secondList);
    wx.navigateTo({
      url: '../allClass/allClass?catalogId=' + that.data.catalogId + "&catalogSecondId=" + catalogSecondId + "&secondIdName=" + secondIdName
    })
  },
})