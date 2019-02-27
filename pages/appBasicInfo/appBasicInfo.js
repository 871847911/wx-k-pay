  // pages/appBasicInfo/appBasicInfo.js
  var utils = require("../../utils/util")
  const app = getApp()
  Page({

    /**
     * 页面的初始数据
     */
    data: {
      photoUrl: '',
      realName: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      this.setData({
        imgPath: app.globalData.imgPath
      })

    },
    choosePic() {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          that.setData({
            photoUrl: tempFilePaths[0]
          })
          app.apis.store('getUploadToken', {}, app.globalData.token).then(res => {
            console.log("Request URL", res)
            that.setData({
              temp: tempFilePaths[0]
            })
            if (res.data.success) {
              var uploadToken = res.data.data.uptoken
              utils.upDataKey(tempFilePaths[0]).then(rest => {
                console.log("upDataKey==>", rest)
                wx.uploadFile({
                  url: 'https://up.qbox.me',
                  filePath: tempFilePaths[0],
                  name: 'file',
                  formData: {
                    'token': uploadToken,
                    'accept': 'text/plain',
                    'key': rest
                  },
                  success: function(res) {
                    that.setData({
                      photoUrls: rest
                    })
                    console.log("success",res);
                  },
                  fail: function(res) {
                    console.log("fail",res)
                  }
                })
                // 
              })
            } else {
              console.log('获取令牌失败')
            }
          })
        }
      })
    },
    next() {
      if (this.data.realName == '') {
        wx.showToast({
          title: '未填写姓名',
          icon: 'none',
          duration: 1000
        })
        return
      }
      if (this.data.photoUrl == '') {
        wx.showToast({
          title: '未上传照片',
          icon: 'none',
          duration: 1000
        })
        return
      }

      app.applyForm.photoUrl = this.data.photoUrls;
      app.applyForm.realName = this.data.realName;
      if (this.data.photoUrl != '' && this.data.realName != '') {
        wx.navigateTo({
          url: `/pages/appIdAuth/appIdAuth`,
        })
      }
    },
    updateInput(e) {
      this.setData({
        realName: e.detail.value
      })
    }
  })