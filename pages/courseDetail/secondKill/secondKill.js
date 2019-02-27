Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: Number,
      value: '',
    },
    innerHour: {
      type: Number,
      value: 0,
    },
    innerStatus: {
      type: Number,
      value: 0,
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  ready: function () {
    this.customMethod()
  },
  methods: {
    timeFormat: function (param) { //小于10的格式化函数
      return param < 10 ? '0' + param : param;
    },
    // 这里是一个自定义方法
    customMethod: function () {
      var that = this
      if (that.data.innerStatus == 0) {
        var newTime = new Date().getTime();
        // 对结束时间进行处理渲染到页面
        var endTime = that.data.innerText + that.data.innerHour * 60 * 60 * 1000;
        var obj = null;
        // 如果活动未结束，对时间进行处理 
        if (endTime - newTime > 0) {
          var time = (endTime - newTime) / 1000;
          // 获取天、时、分、秒
          var day = parseInt(time / (60 * 60 * 24));
          var hou = parseInt(time % (60 * 60 * 24) / 3600);
          var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
          var sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
          var srd = parseInt((time * 1000) % (60 * 60 * 24 * 1000) % 3600 % 60);
          day = day,
            hou = that.timeFormat(hou),
            min = that.timeFormat(min),
            sec = that.timeFormat(sec),
            srd = that.timeFormat(srd)
        } else { //活动已结束，全部设置为'00'
          day = '0',
            hou = '00',
            min = '00',
            sec = '00',
            srd = '00'
        }
        var timeDown = day + '天' + hou + ':' + min + ':' + sec + ':' + srd
        that.setData({
          zzr: timeDown
        })
        if (endTime - newTime > 0) {
          setTimeout(() => {
            that.customMethod()
          }, 100)
        }
        // setTimeout(this.customMethod, 10);

      }
    }
    //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组

  }

})