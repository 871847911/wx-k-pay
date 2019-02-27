// pages/couseDetail.js
var WxParse = require('../../wxParse/wxParse.js');
import {
  audio
} from '../../utils/playAudio.js';
const app = getApp()
var that;
var timerNum = 0
var timer
var newTimer;
var backgroundAudioManager;
Page({

  data: {
    currentPosition: 0,
    sliderValue: 0,
    duration: "",
    clock: '',
    imgUrls: [

    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,

    clock: '',
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
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
    introduction: '',
    isFree: true,
    idxs: 1,
    noChat: true,
    fenxiangzheid: 88,
    fxcourseId: '',
    isIOS: app.globalData.isIOS,
    actions1Num: 1,
    sendGiftNum: '',
    giftDilong: false,
    groupStatus: false,
    grouplist: '',
    groupBuyRule: '',
    isgroup: false,
    isHave: false,
    innerStatus: 0,
    validOrderId: "", //是否已经下单
    stopDate: 0,
    isPlay: false,
    durations: "00:00",
    isNoBuy: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var x;
    var y = 0;
    var page = getCurrentPages();
    this.setData({
      isIOS: app.globalData.isIOS,
      courseId: options.courseId,
      innerStatus: 0
    })
    timerNum = 0
    that = this;
    this.musicMsg()

    if (options.page == "courseBuyed") {
      this.setData({
        isNoBuy: true
      })
    }
    if (options) {
      app.group.getGroupBuyById({
        userId: app.globalData.userInfo.id,
        courseId: options.courseId,
      }, app.globalData.token).then(res => {
        console.log('团信息', res)
        if (res.data.data.appGroupStateDTO.state == 0) {
          var stopDate = res.data.data.groupBuyRule.stopDate,
            stopDate = stopDate.replace(/-/g, '/');
          that.setData({
            groupStatus: true,
            groupBuyRule: res.data.data.groupBuyRule,
            sumNum: res.data.data.sumNum,
            stopDate: new Date(stopDate).getTime(),
          })
          app.group.getAppGroupBuyList({
            page: 1,
            size: 2,
            courseId: options.courseId,
            userId: app.globalData.userInfo.id,
          }, app.globalData.token).then(res => {
            console.log('团列表', res)
            that.setData({
              grouplist: res.data.data.list
            })
          })
        } else if (res.data.data.appGroupStateDTO.state == -3) {
          var stopDate = res.data.data.groupBuyRule.stopDate,
            stopDate = stopDate.replace(/-/g, '/');
          app.group.getAppGroupBuyList({
            page: 1,
            size: 2,
            courseId: options.courseId,
            userId: app.globalData.userInfo.id,
          }, app.globalData.token).then(res => {
            console.log('团列表', res.data.data.list)
            that.setData({
              grouplist: res.data.data.list
            })
          })
          that.setData({
            groupStatus: true,
            groupBuyRule: res.data.data.groupBuyRule,
            stopDate: new Date(res.data.data.groupBuyRule.stopDate).getTime(),
            sumNum: res.data.data.sumNum,
            isgroup: true,
            groupBuyInfo: res.data.data.groupBuyInfo
          })
        } else if (res.data.data.appGroupStateDTO.state == -2) {
          that.setData({
            isHave: true
          })
        } else {
          that.setData({
            groupStatus: false,

          })
        }

      })
    }
    if (options.userId) {

    } else {
      if (!that.data.isIOS) {
        that.Countdown()
      }

    }

    let {
      courseId
    } = options
    console.log(app.globalData.userInfo.id)
    this.setData({
      fenxiangzheid: app.globalData.userInfo.id,
      fxcourseId: courseId,
      fromPage: options.page || ''
    })
    console.log("options", options)

    if (options.page == 'myPublish') {
      this.setData({
        fromPage: 'myPublish'
      })
    } else if (options.page == 'courseManage') {
      this.setData({
        fromPage: 'courseManage',
        is_detailPage: false,
        status_checked: 'check_passed'
      })
    }

    console.log("courseId", courseId)

    app.apis.course('getDetail', {
        courseId
      }, app.globalData.token)
      .then(res => {

        var imgUrl = [];
        if (res.data.data.courseMain.courseUrlFirst != null) {
          imgUrl.push(res.data.data.courseMain.courseUrlFirst);
        }
        if (res.data.data.courseMain.courseUrlSecond != null && res.data.data.courseMain.courseUrlSecond != "") {
          imgUrl.push(res.data.data.courseMain.courseUrlSecond);
        }
        if (res.data.data.courseMain.courseUrlThird != null && res.data.data.courseMain.courseUrlSecond != "") {
          imgUrl.push(res.data.data.courseMain.courseUrlThird);
        }
        var introduction;
        if (res.data.data.courseMain.introduction != null) {
          introduction = res.data.data.courseMain.introduction.replace(/<img /g, '<img style="max-width:100%;height:auto" ')

        }
        var idss = 0;
        for (var i = 0; i < res.data.data.courseSubList.length; i++) {
          var suburl = res.data.data.courseSubList[i].subUrl;
          if (suburl == app.globalData.audioUrl) {
            idss = i
          }
        }
        this.setData({
          imgUrls: imgUrl,
          courseDetail: res.data.data,
          introduction: introduction,
          validOrderId: res.data.data.validOrderId,
          idxs: res.data.data.courseSubList.length != 0 ? res.data.data.courseSubList[idss].id : "",
          subType: res.data.data.courseSubList.length != 0 ? res.data.data.courseSubList[idss].subType : '',
          subUrl: res.data.data.courseSubList.length != 0 ? res.data.data.courseSubList[idss].subUrl : '',
          //   id: res.data.data.courseSubList[0].id,
          //   isFree: res.data.data.courseMain.price == 0 ? true : false,
          //   idxs: res.data.data.courseSubList[0].id
        })
        console.log("onload", "audioUrl", app.globalData.audioUrl, "audioUrl", that.data.subUrl)
        if (audio.ifAudioUrlSame(app.globalData.audioUrl, that.data.subUrl)) {
          var backgroundAudioManager = wx.getBackgroundAudioManager();
          console.log("播放状态", backgroundAudioManager.paused)
          if (backgroundAudioManager.paused == false) {
            that.setData({
              isPlay: true
            })
          }
        } else {
          console.log("oblad butong ")
        }
        if (res.data.data.isBuy) {
          this.setData({
            actions1: [{
              name: '提问讲师',
              icon: 'shangkezhuanhuan',
            }, {
              name: '咨询讲师',
              icon: 'kefuzixunhui',
            }],
            actions1Num: 2
          })
        } else {
          this.setData({
            actions1: [{
              name: '咨询讲师',
              icon: 'kefuzixunhui',
            }],
            actions1Num: 1
          })
        }
        // that.getSamePerson(options.courseId);


      })
    console.log("length", this.data.actions1Num)
    this.checkGiftShare()
    //

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("onhow", app.globalData.audioUrl, that.data.introduction.audioUrl)
    if (audio.ifAudioUrlSame(app.globalData.audioUrl, that.data.introduction.audioUrl)) {
      var backgroundAudioManager = wx.getBackgroundAudioManager();
      console.log("播放状态", backgroundAudioManager.paused)
      if (backgroundAudioManager.paused == false) {
        that.setData({
          isPlay: true
        })
      }
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearTimeout(timer);
    clearTimeout(newTimer);
    // this.setData({
    //   innerStatus:1
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearTimeout(timer);
    clearTimeout(newTimer);
    // this.setData({
    //   innerStatus: 1
    // })
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
  onShareAppMessage: function() {
    console.log("share")
    return {
      title: '课程详情',
      path: 'pages/shareDetail/shareDetail?userId=' + this.data.fenxiangzheid + '&courseId=' + this.data.fxcourseId, //这里设定都是以"/page"开头,并拼接好传递的参数
      success: function(res) {
        // 转发成功
        console.log(res);
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 1500
        })
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          duration: 1500
        })
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  // onPageScroll: function (e) {
  //   console.log("onPageScroll", e.scrollTop)
  //   if (e.scrollTop >= 300) {
  //     this.setData({
  //       isFixed_Detail: true

  //     })
  //     console.log("大于250", that.data.isFixed_Detail);
  //   } else {
  //     this.setData({
  //       isFixed_Detail: true
  //     })
  //     console.log("小于250", that.data.isFixed_Detail);
  //   }
  //   if (e.scrollTop > 200) {

  //     this.setData({
  //       isFixed_Preview: true
  //     })
  //     console.log("大于209", that.data.isFixed_Preview);
  //   } else {
  //     this.setData({
  //       isFixed_Preview: true
  //     })
  //     console.log("小于209", that.data.isFixed_Preview);
  //   }
  // },
  share() {

  },

  // 上拉弹窗
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  shareruleBtn: function() {
    wx.navigateTo({
      url: `/pages/sharingRules/sharingRules?courseId=` + this.data.fxcourseId,
    })
  },
  groupShare() {
    wx.navigateTo({
      url: `/pages/groupShare/groupShare?collageId=${this.data.groupBuyInfo.id}`
      // url: `/pages/groupShare/groupShare?collageId=34`
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
          subUrl: this.data.courseDetail.courseSubList[0].subUrl,
          subName: this.data.courseDetail.courseSubList[0].subName,
          context: all == null ? '' : all,
          isCharge: this.data.courseDetail.courseSubList[0].isCharge
        })
      })
    }
  },
  buy() {
    if (that.data.validOrderId != null) { //如果订单已下ze
      if (!that.data.isHave) {
        wx.redirectTo({
          url: '../orderDetail/orderDetail?orderId=' + that.data.validOrderId,
        })
      }

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
  groupBuy() {
    var param = JSON.stringify({
      price: this.data.courseDetail.courseMain.price,
      groupPrice: this.data.groupBuyRule.price,
      courseId: this.data.courseDetail.courseMain.id,
      collageId: -1
    })
    console.log(param)
    wx.navigateTo({
      url: `/pages/groupPay/groupPay?param=${param}`,
    })
  },
  gogroupPin(e) {
    var collageId = this.data.grouplist[e.currentTarget.dataset.index].id
    var status = this.data.grouplist[e.currentTarget.dataset.index].isState
    if (status == 0) {
      var param = JSON.stringify({
        collageId: collageId
      })
      console.log(param)
      wx.navigateTo({
        url: `/pages/groupPay/groupPay?param=${param}`,
      })
    }

  },
  join() {
    console.log("join")
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
            'isHave': true,
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
  //分享课程免费加入
  joinShareCourse(){
    wx.showLoading({
      title: '',
    })
    var that = this
    wx.request({
      url: app.globalData.httpUrl + "/app/course/order/createOrder",
      data: {
        productId: this.data.courseDetail.courseMain.id,
        score: '',
        discountType: 2
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function (res) {
        console.log("创建订单", res.data.data.status)
        if (res.data.data.status==2){
          wx.hideLoading()
          that.setData({
            'isHave': true,
            'courseDetail.isBuy': true
          }, () => {
            wx.showToast({
              title: '加入课程成功',
              icon: 'success',
              duration: 1000
            })
          })
        }
      }
    })
  },
  ask() {
    if (that.data.courseDetail.lecturer != null) { //有讲师
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
    } else {
      wx.showToast({
        title: '暂无讲师咨询',
        icon: 'none'
      })
    }

  },
  handleOpen1() {
    this.setData({
      visible1: true
    })
  },
  handleCancel1() {
    this.setData({
      visible1: false
    })
  },
  //讲师咨询
  handleClickItem1({
    detail
  }) {
    const index = detail.index;
    this.handleCancel1()
    console.log(index)
    if (this.data.actions1Num == 2) {
      if (index == 0) {
        wx.navigateTo({
          url: `/pages/addQuestionTitle/addQuestionTitle?lecturerId=` + this.data.lecturerId + `&lecturerName=` + this.data.nickName + `&courseId=` + this.data.fxcourseId
        })
      } else if (index == 1) {
        wx.navigateTo({
          url: `/pages/messageDetail/messageDetail?type=message_0&courseId=${this.data.courseDetail.courseMain.id}`
        })
      }
    } else {
      wx.navigateTo({
        url: `/pages/messageDetail/messageDetail?type=message_0&courseId=${this.data.courseDetail.courseMain.id}`
      })
    }


    return
    //判断是否是第一次进入咨询

  },
  soldOut() {
    var that = this;
    app.apis.course('updateStatus', {
        courseId: this.data.courseDetail.courseMain.id,
        status: 50
      }, app.globalData.token, 'POST')
      .then(res => {
        if (res.data.success) {
          this.setData({
            visible2: true,
            t_5: 5
          })
          var time = setInterval(() => {
            var t = parseInt(that.data.t_5) - 1;
            console.log("soldOut", that.data)
            if (t == 0) {
              clearInterval(time)
              that.handleClose2()
            }
            that.setData({
              t_5: t
            })
          }, 1000)

        }
      })
  },
  //上架
  soldUp() {
    if (this.data.courseDetail.courseMain.status == 40) {
      wx.showToast({
        title: '该课程已上架',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/courseManage/courseManage',
        })
      }, 2000)
    } else {
      app.apis.course('updateStatus', {
          courseId: this.data.courseDetail.courseMain.id,
          status: 40
        }, app.globalData.token, 'POST')
        .then(res => {

          if (res.data.success) {
            wx.showToast({
              title: '上架成功',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/courseManage/courseManage',
            })
          }, 2000)
        })
    }
  },
  handleClose2(time) {
    if (time === 'function') {
      clearInterval(time)
    }
    this.setData({
      visible2: false
    })
    wx.navigateTo({
      url: '/pages/myPublish/myPublish',
    })
  },
  submitCheck() {
    app.apis.course('updateStatus', {
        courseId: this.data.courseDetail.courseMain.id,
        status: 20
      }, app.globalData.token, 'POST')
      .then(res => {
        this.setData({
          visible3: true
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/courseManage/courseManage',
          })
        }, 2000)
      })
  },
  handleClose3() {
    this.setData({
      visible3: false,
      status_checked: 'checking'
    })
  },
  updateName() {
    app.apis.course('updateName', {
        courseId: this.courseDetail.courseMain.id,
        name: courseDetail.courseMain.courseName
      }, app.token, 'POST')
      .then(res => {
        console.log('修改标题', res)
        this.setData({
          isEdit: true
        })
      })
  },

  changeCourseName({
    detail
  }) {
    this.setData({
      isEdit: false,
      'courseDetail.courseMain.courseName': detail.value
    })
  },
  //选择课程
  chooseCourse(e) {

    console.log("chooseCourse", this.data.idxs);
    that.setData({
      isFixed_Detail: false,
      isFixed_Preview: false
    })

    if (this.data.isFree && !this.data.courseDetail.isBuy) {
      wx.showModal({
        title: '提示',
        content: '请购买课程',
        showCancel: false,
        confirmColor: '#6CDDC7'
      })
      return false
    }
    if (e.currentTarget.dataset.item) {
      const innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.stop();

      var one = e.currentTarget.dataset.item;
      console.log("章节内容 ", e.currentTarget.dataset.item.subUrl == null, e.currentTarget.dataset.item.subUrl == "");
      if (e.currentTarget.dataset.item.subUrl == null || e.currentTarget.dataset.item.subUrl == "") {
        // var two = e.currentTarget.dataset.item.context.replace(/<img/g, '<img style="max-width:100%;height:auto" ');
        // one.context = two;

        var {
          subUrl,
          subName,
          context,
          subType
        } = one;
        this.setData({
          subUrl,
          subName,
          context,
          subType
        })
        // console.log("innerAudioContext==>", context)
        this.setData({
          idxs: e.currentTarget.dataset.index
        })

        wx.navigateTo({
          url: '../imgTextDeatils/imgTextDeatils?subId=' + this.data.idxs
        })
      } else { //视频音频
        console.log("subName==>", subName);
        var {
          subUrl,
          subName,
          context,
          subType
        } = one;
        this.setData({
          subUrl,
          subName,
          context,
          subType
        })
        if (subType == 2) {
          console.log("innerAudioContext==>", subUrl, subName, context, subType)
          if (audio.ifAudioUrlSame(app.globalData.audioUrl, that.data.subUrl)) {
            console.log("相同", audio.ifAudioUrlSame(app.globalData.audioUrl, that.data.subUrl))

          } else {
            console.log("不相同", audio.ifAudioUrlSame(app.globalData.audioUrl, that.data.subUrl))
            that.setData({
              isPlay: false,
              currentPosition: "00:00",
              durations: "00:00"

            })
            var backgroundAudioManager = wx.getBackgroundAudioManager();
            backgroundAudioManager.title = that.data.subName;
            backgroundAudioManager.src = that.data.subUrl;
            audio.SaveAudioUrl(that.data.subUrl);
            backgroundAudioManager.onTimeUpdate(() => {
              var backgroundAudioManager = wx.getBackgroundAudioManager();
              var durations = backgroundAudioManager.duration
              var sliderValue = Math.floor(backgroundAudioManager.currentTime * 100 / durations)
              if (backgroundAudioManager.src == that.data.subUrl) {
                that.setData({
                  currentPosition: that.stotime(backgroundAudioManager.currentTime),
                  sliderValue: sliderValue,
                  durations: that.stotime(durations) == '' ? "00:00" : that.stotime(durations)
                })
                if (sliderValue == 100 || that.data.currentPosition == that.data.durations) {
                  that.setData({
                    currentPosition: "00:00",
                    sliderValue: 0,
                    durations: "00:00",
                    isPlay: false
                  })
                }
              }
            })

          }
          that.setData({
            isPlay: true
          })
        }
        this.setData({
          idxs: e.currentTarget.dataset.index
        })
      }
    }

  },
  audioPlay(e) {
    if (this.data.isFree && !this.data.courseDetail.isBuy) {
      console.log("audioPlay")
      const innerAudioContext = wx.createAudioContext(e.currentTarget.id)
      innerAudioContext.pause();
      wx.showModal({
        title: '提示',
        content: '请购买课程',
        showCancel: false,
        confirmColor: '#6CDDC7'
      })
    }
  },
  videoPlay(e) {
    console.log("视频")
    var audio = wx.getBackgroundAudioManager();
    if (audio.paused == false) {
      console.log("adudio.paused", audio.paused)
      audio.stop();
    }
    if (this.data.isFree && !this.data.courseDetail.isBuy) {
      var createVideoContext = wx.createVideoContext(e.currentTarget.id)
      createVideoContext.pause();
      wx.showModal({
        title: '提示',
        content: '请购买课程',
        showCancel: false,
        confirmColor: '#6CDDC7'
      })
    }
  },
  //获取讲师与用户信息
  getSamePerson: function(courseId) {
    console.log("listChat==>", courseId)
    app.apis.consult('listChat', {
        courseId: courseId
      }, app.globalData.token)
      .then(res => {
        console.log('获取讲师与用户信息', res);
        var lecturer = res.data.data.lecturer.code;
        var student = res.data.data.student.code;
        var lecturerId = res.data.data.lecturer.id;
        var nickName = res.data.data.lecturer.nickName
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
  //授权弹窗取消
  handleCancelqw: function(res) {
    console.log('用户点击了取消按钮')
    that.setData({
      visibleqw: false
    })
  },
  //授权弹窗确定
  bindGetUserInfo: function(res) {
    if (res.detail.userInfo) {
      console.log('用户点击了授权按钮')
    } else {
      console.log('用户点击了取消按钮')
    }
  },
  //计时器
  Countdown: function() {
    timer = setTimeout(function() {
      if (timerNum == 60) {
        clearTimeout(timer);
        wx.showModal({
          title: '信息提示',
          content: "分享课程即可获取优惠",
          confirmText: "立即分享",
          confirmColor: '#6CDDC7',
          success: function(res) {
            if (res.confirm) {
              that.showModal()
            }
          }
        })
      } else {
        timerNum++
        that.Countdown()
      }
    }, 1000)
  },

  checkGiftShare() {
    var that = this
    app.gift.checkGiftShare({
      courseId: that.data.fxcourseId,
      userId: app.globalData.userInfo.id,
    }, app.globalData.token).then(res => {
      console.log('aaaa', res)
      if (res.data.success == true) {
        that.setData({
          sendGiftNum: res.data.data
        })
        console.log('sendGiftNum', that.data.sendGiftNum)
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getShareNum() {
    this.checkGiftShare()
    if (this.data.sendGiftNum.number > 0 && this.data.sendGiftNum.status == 0) {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(350).step()
      this.setData({
        animationData: animation.export(),
        giftDilong: true
      })
      setTimeout(function() {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    } else {
      wx.showToast({
        title: this.data.sendGiftNum.message,
        icon: 'none',
        duration: 2000
      })
    }
  },

  hideGiftDilong() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(350).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        giftDilong: false
      })
    }.bind(this), 200)
  },

  toCreatGiftOrder() {
    this.hideGiftDilong()
    wx.navigateTo({
      url: '/pages/creatGigeOrder/creatGigeOrder?courseId=' + this.data.fxcourseId,
    })
  },

  goGroupList() {
    wx.navigateTo({
      url: '/pages/groupList/groupList?courseId=' + this.data.fxcourseId,
    })
  },
  //询问客服创建订单
  createOrder: function() {
    this.createrOrder();
  },
  //创建订单
  createrOrder: function() {
    wx.request({
      url: app.globalData.httpUrl + "/app/course/order/createOrder",
      data: {
        productId: that.data.courseId,
        discountType: 1
      },
      header: {
        "userToken": app.globalData.token
      },
      method: "GET",
      success: function(res) {
        console.log("创建订单", res)
        // that.setData({
        //   id: res.data.data.id
        // })
        // that.createUnifyOrder(res.data.data.wechatOrderId)
      }
    })
  },
  //音乐播放信息
  musicMsg: function() {

  },
  playmusic: function() {

    backgroundAudioManager = wx.getBackgroundAudioManager();
    var durations = backgroundAudioManager.duration
    backgroundAudioManager.onTimeUpdate(() => {
      var backgroundAudioManager = wx.getBackgroundAudioManager();
      if (backgroundAudioManager.src == that.data.subUrl || backgroundAudioManager.src == null) {
        backgroundAudioManager.title = that.data.subName;
        var durations = backgroundAudioManager.duration
        var sliderValue = Math.floor(backgroundAudioManager.currentTime * 100 / durations)
        that.setData({
          currentPosition: that.stotime(backgroundAudioManager.currentTime),
          sliderValue: sliderValue,
          durations: that.stotime(durations) == '' ? "00:00" : that.stotime(durations)
        })
        that.palyStop()
      }

    })

    if (backgroundAudioManager.src == null) {
      if (this.data.isFree && !this.data.courseDetail.isBuy) {
        wx.showModal({
          title: '提示',
          content: '请购买课程',
          showCancel: false,
          confirmColor: '#6CDDC7'
        })

      } else {
        var backgroundAudioManager = wx.getBackgroundAudioManager();
        backgroundAudioManager.title = that.data.subName;
        backgroundAudioManager.src = that.data.subUrl;
        audio.SaveAudioUrl(that.data.subUrl);
      }

    } else {
      // console.log("地址==》", backgroundAudioManager.src, that.data.subUr)
      if (this.data.isFree && !this.data.courseDetail.isBuy) {
        wx.showModal({
          title: '提示',
          content: '请购买课程',
          showCancel: false,
          confirmColor: '#6CDDC7'
        })
      } else {
        if (backgroundAudioManager.src != that.data.subUrl) { //切换并储存url
          backgroundAudioManager.title = that.data.subName;
          backgroundAudioManager.src = that.data.subUrl
          audio.SaveAudioUrl(that.data.subUrl);
        } else {
          backgroundAudioManager.play();
        }
      }

    }



    if (this.data.isFree && !this.data.courseDetail.isBuy) {
      that.setData({
        isPlay: false,
        durations: that.stotime(durations) == '' ? "00:00" : that.stotime(durations)
      })
    } else {
      that.setData({
        isPlay: true,
        durations: that.stotime(durations) == '' ? "00:00" : that.stotime(durations)
      })
    }

  },
  pausemusic: function() {
    backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.pause();
    that.setData({
      isPlay: false
    })
  },
  onReady: function() { //在这里进行


    // let currentPosition = backgroundAudioManager.currentTime
    // let durations = backgroundAudioManager.duration
    // that.setData({
    //   durations: that.stotime(duration)
    // })
    // backgroundAudioManager.pause();

    // console.log("currentPosition-------------------==>", currentPosition, "duration==>", durations)
  },
  stotime: function(s) { //转换分秒
    let t = '';
    if (s > -1) {
      let min = Math.floor(s / 60) % 60;
      let sec = Math.ceil(s % 60);
      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
  },
  //拉动进度条放歌
  bindSliderchange: function(e) {

    let value = e.detail.value
    var backgroundAudioManager = wx.getBackgroundAudioManager();
    if (backgroundAudioManager.src == null) {
      backgroundAudioManager.title = that.data.subName;
      backgroundAudioManager.src = that.data.subUrl
      let durations = backgroundAudioManager.duration
      //拖动后的总时间


      backgroundAudioManager.onTimeUpdate(() => {
        console.log("拖动")
        durations = backgroundAudioManager.duration
        var sliderValue = Math.floor(backgroundAudioManager.currentTime * 100 / durations)
        if (sliderValue == 0) {
          that.setData({
            currentPosition: that.stotime(value * durations / 100),
            durations: that.stotime(durations)
          })
          backgroundAudioManager.seek(Math.floor(value * durations / 100));
          audio.SaveAudioUrl(that.data.subUrl);

        }
        that.setData({
          sliderValue: sliderValue
        })
        that.settime();
        that.palyStop()

      })

    } else {

      let durations = backgroundAudioManager.duration
      that.setData({
        currentPosition: that.stotime(value * durations / 100)
      })
      backgroundAudioManager.play();
      backgroundAudioManager.seek(Math.floor(value * durations / 100));
      that.settime();
    }

    that.setData({
      isPlay: true
    })

  },
  //changing
  changing: function() {
    var backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.onTimeUpdate(function() {})
  },
  setDuration() {
    var backgroundAudioManager = wx.getBackgroundAudioManager();
    let currentPosition = backgroundAudioManager.currentTime
    // let duration = backgroundAudioManager.duration
    currentPosition = that.stotime(currentPosition)

    // that.duration = that.stotime(duration)
    // that.sliderValue = Math.floor(currentPosition * 100 / duration)
    that.setData({
      currentPosition: currentPosition,

    })
  },
  settime() { //设置时间
    let that = this
    let timer = setInterval(function() {
      that.setDuration(that)
    }, 1000)
    that.timer = timer
  },
  clearTime() { //清空时间
    let that = this
    clearInterval(that.timer)
    that.timer = null
  },
  palyStop() {
    var backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.onEnded(res => {
      that.setData({
        currentPosition: "00:00",
        sliderValue: 0,
        durations: "00:00",
        isPlay: false
      })
    })
  }
})