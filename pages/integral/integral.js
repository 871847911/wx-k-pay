// pages/integral/integral.js
var app = getApp();
var that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:["全部","获取","支出"],
    tabId:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that= this;
    this.getIntegral();
   
    wx.request({
      url: app.globalData.httpUrl + "/app/score/pageRecord",
      data: {
        page: 1,
        size: 1000,
      
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data.data.list
        })
      }
    })
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  //获取积分详情
  getIntegral: function () {
    wx.request({
      url: app.globalData.httpUrl + "/app/score/getUserScoreInfo",
      data: {},
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function (res) {
        console.log("积分详情", res.data.data)
        that.setData({
          integral: res.data.data
        })
      }
    })
  },
  //获取积分收入支出情况
   getIntegralRecord:function(type){
     wx.request({
       url: app.globalData.httpUrl + "/app/score/pageRecord",
       data: {
         page:1,
         size:1000,
         type: type
       },
       header: {
         "userToken": app.globalData.token
       },
       method: "GET",
       success: function (res) {
        console.log(res.data.data);
        that.setData({
          list: res.data.data.list
        })
       }
     })
   },
   //切换
  changeTab:function(e){
    
    that.setData({
      tabId: e.currentTarget.dataset.id
    })
    if (this.data.tabId == 0) {
      wx.request({
        url: app.globalData.httpUrl + "/app/score/pageRecord",
        data: {
          page: 1,
          size: 1000
        
        },
        header: {
          "userToken": app.globalData.token
        },
        method: "GET",
        success: function (res) {
          console.log(res.data.data.list);
          that.setData({
            list: res.data.data.list
          })
        }
      })
    } else {
      this.getIntegralRecord(e.currentTarget.dataset.id);
    }
  },
  goTastList:function(){
    wx.navigateTo({
      url: '../missionCenter/missionCenter',
    })
  }
})