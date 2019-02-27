Component({
  data: {
    list: [],
    showRemove: true,
    inputTxt:''
  },
  properties:{
    searchAttrs: {
      type: Object,
      value: {},
    }
  },
  attached: function () {
    // 可以在这里发起网络请求获取插件的数据
    
  },
  methods: {
    //聚焦时触发->点击后打开搜索页面
    clickInput (e) {
      // console.log('xxx', e)
      this.triggerEvent('clickInput')
    },
    //失去焦点，点击搜索 无结果保留searchBar
    clickSearch () {
      // var detail = { detail: this.data.inputTxt }
      this.triggerEvent('clickSearch', this.data.inputTxt )
    },
    //清除搜索框内容
    clearInput () {
      this.setData({ 
        inputTxt: '',
        showRemove: true
      })
    },
    watchInput (e) {
      var len = e.detail.value.length
      // console.log(e.detail.value,'xxx');
      if (len > 0) {
        this.setData({ 
          showRemove: false,
          inputTxt: e.detail.value
        })
      }
    }
  }
})