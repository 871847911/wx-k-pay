//轮播组件

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    attrs: {
      type: Object,
      value: {},
    },
    carouselArray: {
      type: Array,
      value: []
    },
    bindgo: {
      type: String,
      value: '',
    },
  },
  data: {
    // list: {
    //   height: 480,
    //   images:[
    //     { url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522814546.jpg'},
    //     { url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2522417650.jpg'},
    //     { url: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2517753454.jpg'}
    //   ]
    // }
    
  },
  attached: function () {
    // 可以在这里发起网络请求获取插件的数据
  },
  methods: {
    bindtimeupdate () {
      console.log(new Date())
    }
  },
  go:function(e){
    console.log("linkValue",e.currentTarget.dataset.linkValue);
    console.log("linkValue", e.currentTarget.dataset.linkType);
    this.triggerEvent('goDetail', e.currentTarget.dataset.linkValue)
  }
})