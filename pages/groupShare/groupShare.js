// pages/groupShare/groupShare.js
import Poster from '../../components/miniprogram_dist/poster/poster';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    imgBoxShow: false,
    collagePrice: '',
    corrent: '',
    remain: '',
    courseName: '',
    courseUrl: '',
    status: '0',
    jdConfig: {},
    innerStatus: 1,
    // endTime: 100,
    collageId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getExtConfigSync().store_name ? wx.getExtConfigSync().store_name : '知识付费'
    })
    that.setData({
      collageId: options.collageId,
    })

    if (options.ispay == 0) {
      console.log("拼团")
      app.group.createPaidCollagOrder({
          collageId: options.collageId,
          wechatOrderId: options.wechatOrderId
        }, app.globalData.token, 'POST')
        .then(res => {
          console.log(res)
          if (res.data.success) {
            that.setData({
              collagePrice: res.data.data.collagePrice,
              corrent: res.data.data.corrent,
              remain: res.data.data.remain,
              courseName: res.data.data.courseName,
              courseUrl: res.data.data.courseUrl,
              status: res.data.data.status,
              courseId: res.data.data.courseId,
              collageId: res.data.data.groupId,
            })
            setTimeout(() => {
              this.addCode()
              that.setData({
                innerStatus: 0,
                endTime: res.data.data.endTime,
              })
            }, 100);
            if (res.data.data.status == 2) {
              that.setData({
                message: '查看课程',
              })
            } else if (res.data.data.status == 1) {
              that.setData({
                message: '参团成功，邀请好友拼团',
              })
            } else {
              that.setData({
                message: '邀请好友拼团',
              })
            }

          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.message,
              duration: 1500
            })
          }
        })
    } else {
      console.log("参团")
      app.group.queryByCollage({
          collageId: options.collageId,
        }, app.globalData.token, 'POST')
        .then(res => {
          if (res.data.success) {
            that.setData({
              collagePrice: res.data.data.collagePrice,
              corrent: res.data.data.corrent,
              remain: res.data.data.remain,
              courseId: res.data.data.courseId,
              courseName: res.data.data.courseName,
              courseUrl: res.data.data.courseUrl,
              status: res.data.data.status,
            })

            setTimeout(() => {
              this.addCode()
              that.setData({
                innerStatus: 0,
                endTime: res.data.data.endTime,
              })
            }, 100);
            if (res.data.data.status == 1) {
              that.setData({
                message: '参团成功，邀请好友拼团',
              })
            } else if (res.data.data.status == 2) {
              that.setData({
                message: '查看课程',
              })
            } else {
              that.setData({
                message: '参团成功，邀请好友拼团',
              })
            }
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.message,
              duration: 1500
            })
          }
        })
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
    // this.setData({
    //   innerStatus: 1
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // this.setData({
    //   innerStatus: 1
    // })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

    var that = this
    console.log(that.data.courseId)
    return {
      title: wx.getExtConfigSync().store_name ? wx.getExtConfigSync().store_name : '知识付费',
      path: 'pages/gropShareDeails/gropShareDeails?collageId=' + that.data.collageId + '&courseId=' + that.data.courseId, //这里设定都是以"/page"开头,并拼接好传递的参数
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
  addCode(a, b, c) {
    var that = this
    app.group.createGroupQrcode({
        collageId: that.data.collageId,
        courseId: that.data.courseId,
        width: 112
      }, app.globalData.token, 'POST')
      .then(res => {
        console.log(res)
        if (res.data.success) {
          var GroupQrcode = res.data.data
          console.log("GroupQrcode", GroupQrcode)
          wx.getUserInfo({
            success: res => {
              console.log(that.data.courseUrl)
              let courseUrl = that.data.courseUrl
              let headerImg = '../../components/groupImg/1.png'
              let {
                nickName,
                avatarUrl,
                country,
                province,
                city,
                language,
                gender
              } = res.userInfo
              that.setData({
                jdConfig: {
                  width: 686,
                  height: 968,
                  backgroundColor: '#fff',
                  debug: false,
                  zzr: false,
                  picUrl: '',
                  blocks: [{
                      width: 590,
                      height: 1,
                      x: 48,
                      y: 750,
                      borderWidth: 1,
                      borderColor: '#F1F1F1',
                    },
                    {
                      width: 590,
                      height: 70,
                      x: 48,
                      y: 145,
                      borderWidth: 1,
                      borderColor: '#F1F1F1',
                      backgroundColor: '#eee',
                      borderRadius: 30,
                    },
                  ],
                  texts: [{
                      x: 165,
                      y: 73,
                      baseLine: 'middle',
                      text: nickName,
                      fontSize: 32,
                      color: '#484848',
                    },
                    {
                      x: 213,
                      y: 178,
                      baseLine: 'middle',
                      text: '拼团享优惠，就差你了',
                      fontSize: 24,
                      color: '#999999',
                      zIndex: 100
                    },
                    {
                      x: 48,
                      y: 270,
                      width: 590,
                      baseLine: 'middle',
                      // textAlign: 'center',
                      text: that.data.courseName,
                      fontSize: 32,
                      color: '#484848',
                      lineNum: 1,
                      lineHeight: 48
                    },
                    {
                      x: 48,
                      y: 840,
                      baseLine: 'top',
                      text: wx.getExtConfigSync().store_name ? wx.getExtConfigSync().store_name : '知识付费',
                      fontSize: 32,
                      color: '#080808',
                    },
                    {
                      x: 578,
                      y: 920,
                      width: 210,
                      textAlign: 'center',
                      baseLine: 'middle',
                      text: '长按识别',
                      fontSize: 24,
                      color: '#666666',
                    }
                  ],
                  images: [{
                      width: 96,
                      height: 96,
                      x: 32,
                      y: 32,
                      borderRadius: 100,
                      url: avatarUrl,
                    },
                    // {
                    //   width: 590,
                    //   height: 98,
                    //   x: 48,
                    //   y: 110,
                    //   url: headerImg,
                    // },
                    {
                      width: 340,
                      height: 340,
                      x: 173,
                      y: 370,
                      borderRadius: 20,
                      url: courseUrl,
                    },
                    {
                      width: 112,
                      height: 112,
                      x: 525,
                      y: 780,
                      url: GroupQrcode,
                    },
                  ]
                },
              })
            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.message,
            duration: 1500
          })
        }
      })
  },
  // 上拉弹窗
  showModal: function() {
    if (this.data.status != 2) {
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
    } else {
      wx.navigateTo({
        url: `/pages/courseDetail/courseDetail?courseId=` + this.data.courseId,
      })
    }
    // 显示遮罩层

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

  onPosterSuccess(e) {
    this.hideModal()
    const {
      detail
    } = e;
    console.log(e)
    this.setData({
      imgBoxShow: true,
      picUrl: e.detail,
      zzr: true,
    })
    // wx.previewImage({
    //   current: detail,
    //   urls: [detail]
    // })
  },
  onPosterFail(err) {
    console.error(err);
  },

  /**
   * 异步生成海报
   */
  // onCreatePoster() {
  //   Poster.create();
  // },
  dowload() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.picUrl,
      success: function(res) {
        wx.showToast({
          title: '保存成功',
        })
        that.setData({
          imgBoxShow: false
        })
      },
      fail: function(err) {
        wx.showToast({
          icon: "none",
          title: '保存失败',
        })
      }
    })

  },
  toIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})