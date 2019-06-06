Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    programmeIndex: {
      type: String,
      value: '0',
    }
  },
  data: {
   
  },
  attached: function () {
    var that=this;
    that.onChange();
  },
  methods: {
    onChange: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('changeHeight', myEventDetail, myEventOption)
    }
  }
})