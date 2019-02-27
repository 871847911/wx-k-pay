Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pic_attr: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPic: false,
    picUrl: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    uploadPic() {
      var that = this;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          
          var tempFilePaths = res.tempFilePaths
          console.log(res)
          that.setData({ 
            showPic: true,
            picUrl: tempFilePaths
          })
          
          // that.triggerEvent('chooseImg', detail)
        }
      })
    }
  }
})
