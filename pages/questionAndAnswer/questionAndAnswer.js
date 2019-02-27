
const app = getApp()
Page({
  data: {
    idx: 0,
    roleId: '',
    emptyJson: {
      imgUrl: '/issue@2x.png',
      des: '暂无相关信息'
    },
    questionDataUser: [
      {
        name: '我的提问',
        url: '/images/my_question.png'
      },
      {
        name: '精选问答',
        url: '/images/star_question.png'
      },
      {
        name: '问题市场',
        url: '/images/all_question.png'
      }
    ],
    questionDataOwner: [
      {
        name: '提问我的',
        url: '/images/question_for_me.png'
      },
      {
        name: '精选问答',
        url: '/images/star_question.png'
      },
      {
        name: '问题市场',
        url: '/images/all_question.png'
      }
    ],
    emptyJson: {
      imgUrl: '/images/issue@2x.png',
      des: '暂无相关信息'
    },
    pageNum: 1,
    questionList: [],
    starQuestion: [],
    total: '',
    showAdd: false,
    showMy: false,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ roleId: app.globalData.roleId })
    // this.setData({ roleId: 2 })
    // this.queryMyQuestion()
    console.log(this.data.roleId)
    switch (this.data.roleId) {
      case 1:
        this.askMeQuestionWX()
        break;
      case 2:
        this.askMeQuestionWX()
        break;
      case 3:
        this.MyQuestionWX()
        this.setData({ showAdd: true })
        break;
    }
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageNum++;
    if (this.data.idx == 0 && this.data.roleId == 3) {
      //上拉加载我的提问
      if (Math.ceil(this.data.total / 10) > (this.data.pageNum - 1)) {
        this.MyQuestionWX()
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 1000
        })
      }
    } else if (this.data.idx == 2) {
      // 上拉加载问题市场
      if (Math.ceil(this.data.total / 10) > (this.data.pageNum - 1)) {
        this.queryAllQuestion()
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 1000
        })
      }
    } else if (this.data.idx == 0 && this.data.roleId != 3) {
      //上拉加载提问我的
      if (Math.ceil(this.data.total / 10) > (this.data.pageNum - 1)) {
        console.log(this.data.pageNum)
        this.askMeQuestionWX()
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none', 
          duration: 1000
        })
      }
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //消费者选项卡
  changeIndex(e) {
    this.setData({ idx: e.currentTarget.dataset.index })
    this.setData({ questionList: [] })
    this.setData({ pageNum: 1 })
    this.setData({ showAdd: true })
    switch (this.data.idx) {
      case 0:
        this.MyQuestionWX()
        break;
      case 1:
        this.queryStarQuestions()
        break;
      case 2:
        this.queryAllQuestion()
        break;
    }
  },

  //生产者选项卡
  changeOwnerIndex(e) {
    console.log(e)
    this.setData({ idx: e.currentTarget.dataset.index })
    this.setData({ questionList: [] })
    this.setData({ pageNum: 1 })
    switch (this.data.idx) {
      case 0:
        this.askMeQuestionWX()
        this.setData({ showMy: false })
        break;
      case 1:
        this.queryStarQuestions()
        this.setData({ showMy: false })
        break;
      case 2:
        this.queryAllQuestion()
        this.setData({ showMy: true })
        break;
    }
  },


  toAddQuestion() {
    wx.navigateTo({
      url: '/pages/lecturerList/lecturerList'
    })
  },

  //提问我的
  askMeQuestionWX() {
    var that = this;
    let params = {
      storeId: app.globalData.userInfo.storeId,
      // questionerId: app.globalData.userInfo.id,
      // storeId: 80,
      // lecturerId: 112,
      lecturerId: app.globalData.userInfo.id,
      pageNum: that.data.pageNum,
      pageSize: 10
    }
    app.question.askMeQuestionWX(params, app.globalData.token).then(res => {
      console.log(res.data)
      var a = that.data.questionList
      // that.setData({ questionList: a.concat(res.data.rows) })
      if (that.data.pageNum == 1) {
        that.setData({ questionList: res.data.data.list })
      } else {
        that.setData({ questionList: a.concat(res.data.data.list) })
      }
      that.setData({ total: res.data.data.total })
    })
  },

  //我的提问
  MyQuestionWX() {
    var that = this;
    let params = {
      storeId: app.globalData.userInfo.storeId,
      questionerId: app.globalData.userInfo.id,
      // storeId: 80,
      // questionerId: 112,
      pageNum: that.data.pageNum,
      pageSize: 10
    }
    app.question.MyQuestionWX(params, app.globalData.token).then(res => {
      console.log(res.data)
      var a = that.data.questionList
      // that.setData({ questionList: a.concat(res.data.rows) })
      if (that.data.pageNum == 1) {
        that.setData({ questionList: res.data.data.list })
      } else {
        that.setData({ questionList: a.concat(res.data.data.list) })
      }
      that.setData({ total: res.data.data.total })
    })
  },

  // 精选问答
  queryStarQuestions() {
    var that = this;
    let params = {
      storeId: app.globalData.userInfo.storeId,
      // storeId: 80,
    }
    app.question.queryStarQuestions(params, app.globalData.token).then(res => {
      console.log("精选问答",res)
      that.setData({ questionList: res.data.data })
      // console.log(that.data.data.questionList)
    })
  },

  //问题市场
  queryAllQuestion() {
    var that = this;
    let params = {
      storeId: app.globalData.userInfo.storeId,
      // storeId: 80,
      pageNum: that.data.pageNum,
      pageSize: 10,
    }
    app.question.queryQuestion(params, app.globalData.token).then(res => {
      console.log(res.data)
      var a = that.data.questionList
      // that.setData({ questionList: a.concat(res.data.rows) })
      if (that.data.pageNum == 1) {
        that.setData({ questionList: res.data.data.list })
      } else {
        that.setData({ questionList: a.concat(res.data.data.list) })
      }
      that.setData({ total: res.data.data.total })
    })
  },



  toQuestionDetail(e) {
    let questionIndex = e.currentTarget.dataset.index
    let questionId = this.data.questionList[questionIndex].id
    let answerId = this.data.questionList[questionIndex].lecturerId
    let createUser = this.data.questionList[questionIndex].questionerName
    // wx.navigateTo({
    //   url: '/pages/questionDetail/questionDetail?' + 'id=' + questionId,
    // })
    console.log(questionIndex)
    console.log(this.data.questionList[questionIndex].questionStatus)
    if (this.data.roleId != 3 && this.data.idx == 0) {
      if (this.data.questionList[questionIndex].questionStatus == 0) {
        wx.navigateTo({
          url: '/pages/answer/answer?' + 'id=' + questionId + '&answerId=' + answerId + '&createUser=' + createUser,
        })
      } else if (this.data.questionList[questionIndex].questionStatus == 1) {
        wx.navigateTo({
          url: '/pages/questionDetail/questionDetail?' + 'id=' + questionId,
        })
      }
    }else {
      wx.navigateTo({
        url: '/pages/questionDetail/questionDetail?' + 'id=' + questionId,
      })
    }
  },

  toAnswew() {
    console.log('answer')
  },

  toQuestionSearch() {
    wx.navigateTo({
      url: '/pages/questionSearch/questionSearch'
    })
  },

  toAddQuestionForS() {
    wx.navigateTo({
      url: '/pages/addQuestionForS/addQuestionForS'
    })
  }

})