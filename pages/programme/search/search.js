// pages/programme/floor/floor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    floorList: [
      
    ],
    styleId: '',//风格ID
    brandId: '',//品牌ID
    phValue: '请输入要搜索的楼盘',//查询提示语
    inputVal: '',
    // inputShow:0,//聚焦时隐藏元素
    inputFixed: 0,
    houseName: '',
    cityname: '',
    start: 0,//开始
    height1: wx.getSystemInfoSync().windowWidth / 750 * 64,
    height2: wx.getSystemInfoSync().windowWidth / 750 * 94,
    focus: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    if (options.houseName) {
      this.setData({
        houseName: options.houseName
      })
    }
    if (options.cityname) {
      this.setData({
        cityname: options.cityname
      })
    }
    this.getData();
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
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    setTimeout(function () {
      wx.stopPullDownRefresh();
      that.onLoad(that.options);
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      strat: this.data.start + 1
    })
    this.getData();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPageScroll: function (e) {
   
  },
  //input值改变时触发的事件
  getSearchData: function (e) {
    this.setData({
      houseName: e.detail.value
    })
    this.getData();
  },
  //清楚内容
  clearData: function () {
    this.setData({
      inputVal: ''
    })
  },
  getData() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask: 'true'
    })
    wx.request({
      url: getApp().globalData.resUrl + 'queryHouseInfo',
      method: 'post' || 'get',
      data: {
        city: this.data.cityname || '杭州市',//城市
        houseName: this.data.houseName || '',//楼盘名称
        start: this.data.start,//开始
        length: (this.data.start + 1) * 10,//长度
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.retCode == 0) {
          that.setData({
            floorList: res.data.houseInfo
          })
        } else {
          let arr = []
          that.setData({
            floorList: arr
          })
        }
      }
    })
    // getApp().ajax("queryHouseInfo", data, 'POST', function (res) {
    //   console.log(res)
    //   if (res.data.retCode==0){
    //     that.setData({
    //       floorList: res.data.houseInfo
    //     })
    //   }else{

    //   }

    // })
  }

})