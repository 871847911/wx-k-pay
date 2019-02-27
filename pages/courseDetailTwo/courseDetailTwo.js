// pages/couseDetail.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
var that;
var timerNum = 0
var timer;

Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    index: 0,
    idx: 0,
    visible1: false,
    actions1: [{
        name: '我要提问',
        icon: 'kefuzixunhui',
      },
      {
        name: '讲师咨询',
        icon: 'shangkezhuanhuan',
      }
    ],
    actions2: [{
      name: '确定',
      color: '#007AFF',
    }],
    visible2: false,
    visible3: false,
    actions3: [{
      name: '确定',
      color: '#007AFF',
    }],
    isFixed_Detail: false,
    isFixed_Preview: false,
    fromPage: '',
    t_5: 5,
    is_detailPage: true,
    status_checked: '',
    courseDetail: {},
    isEdit: false,
    subUrl: '',
    subName: '',
    context: '',
    myVideo: "myVideo",
    myAudio: "myAudio",
    subType: 0,
    id: '',
    isBuy: false,

    isFree: true,
    idxs: 1,
    noChat: true,
    fenxiangzheid: 88,
    fxcourseId: '',
    optionsUserId: '',
    userId: '',
    d:{c:1}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var sence = decodeURIComponent(options.sence);
    console.log("sence==>",sence)
    timerNum = 0
    that = this;
  
    that.setData({

      courseId: options.sence
    })
    
  
    if (options.sence) {
      
      // wx.showLoading({
      //   title: '请稍等',
      // })
      app.checkAuth(() => {
        app.apis.course('getDetail', {
            courseId: that.data.courseId
          }, app.globalData.token)
          .then(res => {
            console.log('课程详情', res.data)
            var imgUrl = [];
            if (res.data.data.courseMain.courseUrlFirst != null) {
              imgUrl.push(res.data.data.courseMain.courseUrlFirst);
            }
            if (res.data.data.courseMain.courseUrlSecond != null) {
              imgUrl.push(res.data.data.courseMain.courseUrlSecond);
            }
            if (res.data.data.courseMain.courseUrlThird != null) {
              imgUrl.push(res.data.data.courseMain.courseUrlThird);
            }
            var introduction;
            if (res.data.data.courseMain.introduction != null) {
              introduction = res.data.data.courseMain.introduction.replace(/<img/g, '< img style="max-width:100%;height:auto" ')
              console.log("introduction===>", introduction);
            }
            this.setData({
              imgUrls: imgUrl,
              courseDetail: res.data.data,
              introduction: introduction,
              idx: res.data.data.courseSubList[0].id ? res.data.data.courseSubList[0].id:0,
              subType: res.data.data.courseSubList[0].subType,
              subUrl: res.data.data.courseSubList[0].subUrl,
              id: res.data.data.courseSubList[0].id ? res.data.data.courseSubList[0].id : 0,
              isFree: res.data.data.courseMain.price == 0 ? true : false,
              idxs: res.data.data.courseSubList[0].id ? res.data.data.courseSubList[0].id : 0
            })

            that.getSamePerson(that.data.courseId);


          })


      })


    } else {
      wx.hideLoading()

      that.setData({
        visibleqw: true
      })
      //未授权=> 去授权页
    }


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
    clearTimeout(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearTimeout(timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */


  //授权弹窗取消
  handleCancelqw(res) {
    console.log('用户点击了取消按钮')
    wx.showToast({
      title: '您取消授权',
      icon: 'none'
    })
    that.setData({
      visibleqw: false
    })
    // wx.redirectTo({
    //   url: '/pages/shareUserLogin/shareUserLogin?userId=' + that.data.userId + '&courseId=' + that.data.courseId,
    // })

  },
  //授权弹窗确定
  handleClickOk(res) {
    console.log(111)
    that.setData({
      visibleqw: false
    })
  },
  //获取讲师与用户信息
  getSamePerson: function(courseId) {
    console.log("listChat==>", courseId)
    app.apis.consult('listChat', {
        courseId: that.data.courseId
      }, app.globalData.token)
      .then(res => {
        console.log('获取讲师与用户信息', res);
        var lecturer = res.data.data.lecturer.code;
        var student = res.data.data.student.code;
        var lecturerId = res.data.data.student.id;
        var nickName = res.data.data.student.nickName
        wx.hideLoading();
        if (lecturer != null && student != null && lecturer == student) {
          that.setData({
            noChat: false,
            lecturerId: lecturerId,
            nickName: nickName
          })
        }
        that.setData({
          lecturerId: lecturerId,
          nickName: nickName
        })
      })
  },
  setIndex(e) {
    console.log("setIndex", e)
    if (this.data.index != e.currentTarget.dataset.idx) {
      this.setData({
        index: e.currentTarget.dataset.idx
      }, () => {
        //设置课程详情的资源文件
        var article = this.data.courseDetail.courseSubList[0].subType == 1 ? this.data.courseDetail.courseSubList[0].context : '';
        console.log("article==>", article);
        //WxParse.wxParse('article', 'html', article, that, 16);
        var context = this.data.courseDetail.courseSubList[0].subType == 1 ? this.data.courseDetail.courseSubList[0].context : '';
        if (context != null) {
          var all = context.replace(/<img/g, '<img style="max-width:100%;height:auto" ')
          console.log("all===>", all);
        }

        this.setData({
          sourceUrl: this.data.courseDetail.courseSubList[0].subUrl,
          subName: this.data.courseDetail.courseSubList[0].subName,
          context: all,
          isCharge: this.data.courseDetail.courseSubList[0].isCharge
        })
      })
    }
  },
  join() {
    if (this.data.courseDetail.isBuy) {
      return
    }
    //加入课程接口
    app.apis.course('joinFreeCourse', {
        courseId: this.data.courseDetail.courseMain.id
      }, app.globalData.token, 'POST')
      .then(res => {
        console.log("加入课程接口", res)
        if (res.data.success) {
          this.setData({
            'courseDetail.isBuy': true
          }, () => {
            wx.showToast({
              title: '加入课程成功',
              icon: 'success',
              duration: 1000
            })
          })
        }
      })
  },
  ask() {
    if (that.data.noChat == true) {
      console.log('xxx')
      this.setData({
        visible1: true
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '这是您自己',
      })
    }
  },
  //返回首页：
  returnFirst:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  buy() {
    if (that.data.validOrderId != null) { //如果订单已下ze
      wx.navigateTo({

        url: '../orderDetail/orderDetail?orderId=' + that.data.validOrderId,
      })
    } else {
      if (this.data.courseDetail.isBuy) {
        return
      }
      var discountType = 2;
      if (this.data.courseDetail.courseMain.shareDiscount == null) {
        discountType = 1
      }
      var param = JSON.stringify({
        price: this.data.courseDetail.courseMain.discountPrice,
        img: this.data.courseDetail.courseMain.courseUrlFirst,
        title: this.data.courseDetail.courseMain.courseName,
        courseId: this.data.courseDetail.courseMain.id,
        discountType: discountType
      })
      wx.navigateTo({
        url: `/pages/payPage/payPage?param=${param}`,
      })
    }
  },
})