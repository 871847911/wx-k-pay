const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userLogin : false,
        collageId : null,
        courseId : null,
        courseData : {}
        

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        if(options.collageId){
            console.log(options)
            this.setData({
                collageId: options.collageId,
                courseId: options.courseId
            })
        } else if (options.scene){
            var scene = decodeURIComponent(options.scene);
            var arr = [];
            arr = scene.split(",");
            this.setData({
                collageId: arr[0],
                courseId: arr[1]
            })
        }
        // this.pageLogin();
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.pageLogin();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    pageLogin(){
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: (res) => {
                            let { nickName, avatarUrl, country, province, city, language, gender } = res.userInfo;
                            let encryptedData = res.encryptedData;
                            let iv = res.iv;
                            wx.login({
                                success: (res) => {
                                    if (res.code) {
                                        if (wx.getExtConfig) {
                                            let storeId = wx.getExtConfigSync().store_id
                                            app.apis.user('login3rd', {
                                              storeId: storeId ? storeId : 25,
                                                nickName,
                                                avatarUrl,
                                                country,
                                                province,
                                                city,
                                                language,
                                                gender,
                                                code: res.code,
                                                encryptedData,
                                                iv
                                            }, '', 'POST')
                                                .then(res => {
                                                    if (res.data.success == true) {
                                                        app.globalData.token = res.data.data.token;
                                                        app.globalData.userInfo = res.data.data.user;
                                                        app.globalData.roleId = res.data.data.user.roleId;
                                                        app.globalData.userInfo.id = res.data.data.user.id;
                                                        this.getGroupShareDetail();
                                                    } else { //处理后台信息配置报错
                                                        wx.hideLoading()
                                                        wx.showModal({
                                                            title: '错误提示',
                                                            content: res.data.message,
                                                            showCancel: false,
                                                            success: function (res) {
                                                                if (res.confirm) {
                                                                    // console.log('用户点击确定')
                                                                }
                                                            }
                                                        })
                                                    }

                                                })
                                        }
                                    } else {
                                        // console.log('登录失败！' + res.errMsg)
                                    }
                                }
                            })
                        }
                    })
                } else {
                    //未授权=> 去授权页
                    wx.navigateTo({
                        url: '/pages/userAuth/userAuth',
                    })
                }
            }
        })
    },
    // 获取分享详情
    getGroupShareDetail() {
        app.question.groupShareDetail({
            collageId: this.data.collageId,
            courseId: this.data.courseId
        }, app.globalData.token, 'POST')
        .then(res => {
            console.log(res.data)
            if (res.data.success) {
                wx.setNavigationBarTitle({
                    title: res.data.data.storeName
                })
                this.setData({
                    courseData: res.data.data
                })
            } else {
                wx.showModal({
                    title: '错误提示',
                    content: res.data.message,
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            // console.log('用户点击确定')
                        }
                    }
                })
            }
        })
    },
    // 跳转支付
    addGroup(){
        let param = {
            collageId: this.data.collageId,
            courseId: this.data.courseId,
            groupPrice: this.data.courseData.collagePrice
        }
        wx.navigateTo({
            url: `/pages/groupPay/groupPay?param=` + JSON.stringify(param)
        })
    },
    // 跳转详情页
    toCourseDetail(){
        wx.navigateTo({
            url: `/pages/courseDetail/courseDetail?courseId=` + this.data.courseId
        }) 
    },
    // 去首页
    toIndex() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    getUserInfo(){

    }
})