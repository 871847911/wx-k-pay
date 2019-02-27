// pages/columDetalisByStudent/columDetalisByStudent.js
var app = getApp();
var that;
var columnId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ['专栏简介', '专栏目录'],
    tabId:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that= this;
    columnId = options.columnId
    this.setData({
      columnId: columnId
    })
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.getMsg(that.data.columnId);
    that.getList(that.data.columnId);
  },

 
  //选择标签
  change:function(e){
    console.log(e.currentTarget.dataset.id);
    that.setData({
      tabId: e.currentTarget.dataset.id
    })
  },
  //获取简介
  getMsg: function (columnId){
    wx.request({
      url: app.globalData.httpUrl + "/app/column/get",
      data: {
        columnId: columnId

      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function (res) {
        console.log("专栏简介",res)
        var introduction = res.data.data.column.introduction;
        introduction = introduction.replace(/<img /g, '<img style="max-width:100%;height:auto" ')
        var all= res.data.data;
        switch (Number(all.column.updateType)){
          case 1:
            all.column.updateType ="每日";
            break;
          case 2:
            all.column.updateType = "每";
            break;
          case 3:
            all.column.updateType = "每月";
            break;
        }
       
        that.setData({
          all: res.data.data,
          introduction: introduction
        })
      }
    })
  },
  //获取专栏目录
  getList: function (columnId){
    wx.request({
      url: app.globalData.httpUrl + "/app/column/pageContentByStudent",
      data: {
        page:1,
        size:10,
        columnId: columnId

      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function (res) {
        console.log("获取专栏目录",res)
        that.setData({
          list:res.data.data.list
        })
      }
      })
  },//跳转
  goIssue: function () {
    wx.navigateTo({
      url: '../issue/issue?columnId=' + columnId,
    })
  },
  goDeatalis:function(e){
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../issue1/issue1?contentId=' + that.data.list[e.currentTarget.dataset.id].id ,
    })
  }
})