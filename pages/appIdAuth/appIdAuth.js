// pages/appIdAuth/appIdAuth.js
const utils = require('../../utils/util.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tempFilePaths_0: '',
        tempFilePaths_1: '',
        date: '2017-05-01',
        region: ['北京市', '北京市', '东城区'],
        fontParams: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            imgPath: app.globalData.imgPath
        })
    },
    choosePic(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                var url = 'tempFilePaths_' + index
                    // that.setData({
                    //     [url]: tempFilePaths[0]
                    // }, () => {
                    //获取token -> 上传图片
                app.apis.store('getUploadToken', {}, app.globalData.token).then(res => {
                        if (res.data.success) {
                          that.setData({
                            temp: res.data.data.tempDomain
                          })

                            utils.upDataKey(tempFilePaths[0]).then(rest => {
                                wx.uploadFile({
                                        url: 'https://up.qbox.me',
                                        filePath: tempFilePaths[0],
                                        name: 'file',
                                        formData: {
                                          'token': res.data.data.uptoken,
                                            'accept': 'text/plain',
                                            'key': rest
                                        },
                                        success: function(res) {
                                            that.setData({
                                                [url]: rest
                                            })
                                        },
                                        fail: function(res) {}
                                    })
                                    // 
                            })
                        } else {
                            console.log('获取令牌失败')
                        }
                    })
                    // })

            }
        })
    },
    formSubmit: function(e) {
        var detail = e.detail.value;
        if (!this.data.tempFilePaths_0) {
            wx.showToast({
                title: '身份证正面为空',
                icon: 'none',
                duration: 1000
            })
            return
        }
        if (!this.data.tempFilePaths_1) {
            wx.showToast({
                title: '身份证反面为空',
                icon: 'none',
                duration: 1000
            })
            return
        }
        if (!utils.reg_idCard(detail.idCard)) {
            wx.showToast({
                title: '身份格式错误',
                icon: 'none',
                duration: 1000
            })
            return
        }

        app.applyForm.idCardFrontUrl = this.data.tempFilePaths_0;
        app.applyForm.idCardBackUrl = this.data.tempFilePaths_1;
        app.applyForm.idCardNum = e.detail.value.idCard;
        app.applyForm.address = e.detail.value.address;
        app.applyForm.province = this.data.region[0];
        app.applyForm.city = this.data.region[1];
        app.applyForm.district = this.data.region[2];

        wx.navigateTo({
          url: `/pages/appPersonalIntr/appPersonalIntr`,
        })
    },
    bindRegionChange(e) {
        this.setData({
            region: e.detail.value
        })
    }
})