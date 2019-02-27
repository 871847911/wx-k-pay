import {
  $init,
  $digest
} from '../../utils/common.util'
const app = getApp()
var utils = require("../../utils/util")
Page({

  data: {
    titleCount: 0,
    contentCount: 0,
    title: '',
    content: '',
    images: [],
    title: "",
    time: "",
    name: "",
    contant: "",
    more: true,
    showTitle: true,
    issub: false,
    contant: '',
    answerId: ''
  },

  onLoad(options) {
    console.log(options)
    var that = this
    that.setData({
      answerId: options.answerId,
      createUser: options.createUser,
      id: options.id,
    })

    app.apis.store('getUploadToken', {}, app.globalData.token).then(res => {
      that.setData({
        token: res.data.data,
        temp: res.data.data.tempDomain
      })
      console.log(that.data.token)
    });

    app.question.queryById({
      id: options.id,
      userId: app.globalData.userInfo.id
    }, app.globalData.token).then(res => {
      console.log(res)
      this.setData({
        title: res.data.data.questionAndAnswerDto.title,
        contant: res.data.data.questionAndAnswerDto.questionDesc,
        time: res.data.data.questionAndAnswerDto.createDate,
        name: res.data.data.questionAndAnswerDto.questionerName,
        contantImg: res.data.data.questionUrl,
        anonymity: res.data.data.questionAndAnswerDto.anonymity
      })
    });
    $init(this)
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    if (this.data.contentCount > 20) {
      this.data.issub = true
    } else {
      this.data.issub = false
    }

    $digest(this)

  },

  choosePic() {
    var that = this;
    console.log(that.data.images.length)
    if (that.data.images.length >= 3) {
      wx.showToast({
        title: '图片最多只能上传三张',
        icon: "none"
      })
    } else {
      wx.chooseImage({
        count: 3 - that.data.images.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          var tempFilePaths = res.tempFilePaths
          for (var i = 0; i < tempFilePaths.length; i++) {
            that.uploadImg(tempFilePaths, i)
          }
        }
      })

    }

  },
  bindfocus() {
    this.setData({
      showTitle: false
    })
    console.log(this.data.showTitle)
  },
  hidTextarea() {
    this.setData({
      showTitle: true
    })
  },
  uploadImg(tempFilePaths, i) {
    var that = this
    utils.upDataKey(tempFilePaths[i]).then(rest => {
      wx.uploadFile({
        url: 'https://up.qbox.me',
        filePath: tempFilePaths[i],
        name: 'file',
        formData: {
          'token': that.data.token,
          'accept': 'text/plain',
          'key': rest
        },
        success: function(res) {
          that.data.images.push(that.data.temp + rest)
          $digest(that)
        },
        fail: function(res) {}
      })
    })
  },
  more() {
    this.setData({
      more: !this.data.more
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  submitForm(e) {

    var content = this.data.content
    var contentCount = this.data.contentCount
    var that = this
    console.log(app.globalData.userInfo.id)
    console.log(content)
    console.log(that.data.id)
    console.log(app.globalData.userInfo.storeId)
    console.log(that.data.images)
    console.log(that.data.createUser)
    if (contentCount == 0 || content == '') {
      wx.showToast({
        title: '回答不能为空',
        icon: "none",
        duration: 1500
      })
    } else if (contentCount < 20) {
      wx.showToast({
        title: '回答不能少于20个字',
        icon: "none",
        duration: 1500
      })
    } else {

      wx.showModal({
        title: '提示',
        content: '是否确认提交您的回复？',
        success: function(res) {
          if (res.confirm) {
            app.question.addAnswerAndPics({
                answererId: app.globalData.userInfo.id,
                answer: content.trim(),
                questionId: that.data.id,
                storeId: app.globalData.userInfo.storeId,
                picUrls: that.data.images,
                createUser: that.data.createUser
              }, app.globalData.token)
              .then(res => {
                console.log('提交', res.data.success)
                if (res.data.success == true) {
                  // app.question.updateQuestion({
                  //   id: that.data.id,
                  //   status: 1,
                  //   }, app.globalData.token)
                  //   .then(res => {
                  //     console.log('改状态', res)
                  //     if (res.data.success == true) {
                  //       wx.redirectTo({
                  //         url: '/pages/questionDetail/questionDetail?id=' + that.data.id
                  //       })
                  //     } else {
                  //       wx.showToast({
                  //         title: res.data.message,
                  //         icon: "none"
                  //       })
                  //     }
                  //   })
                  wx.redirectTo({
                    url: '/pages/questionDetail/questionDetail?id=' + that.data.id
                  })
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: "none"
                  })
                }

              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  }

})