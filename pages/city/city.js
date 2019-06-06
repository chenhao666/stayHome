// pages/city/city.js
// let City = require('../../utils/allcity.js');
let bmap = require('../../utils/bmap-wx.min.js');
var wxMarkerData = []; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // city: [],
    config: {
      horizontal: true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
      animation: true, // 过渡动画是否开启
      search: true, // 是否开启搜索
    },
    defaultCity: '杭州',
    defaultCityPin:'HangZhou',
    rgcData: {},
    refreshShow:false,//定位刷新动画
    cityList:[],
    height1: wx.getSystemInfoSync().windowWidth / 750 * 91
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userBMap();
    // this.setData({
      // city: City,
      // refreshShow:true
    // })
  },
  userBMap:function(){
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'bLlaZ4IYQZSGO251iN9PuyWc9XIzemMP'
    });
    var fail = function (data) {
      // console.log(data)
    };
    var success = function (data) {
      // console.log(data)
      wxMarkerData = data.wxMarkerData;
      that.setData({
        defaultCity: data.originalData.result.addressComponent.city.replace('市', ''),
      });
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
    }); 
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
  onPullDownRefresh: function () {
    var that = this;
    setTimeout(function () {
      wx.stopPullDownRefresh();
      that.onLoad();
      that.onShow();
    }, 1000)
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
  onPageScroll(e) {
    //标题消失居中
    if (e.scrollTop >= this.data.height1) {
      wx.setNavigationBarTitle({
        title: '城市'
      })
    } else {
      wx.setNavigationBarTitle({
        title: ''
      })
    }
  },
  binddetail(e) {
    let that = this;
    that.setData({
      defaultCity: e.detail.detail.cityName,
      defaultCityPin:e.detail.detail.cityPin
    });
    wx.reLaunch({
      url: '/pages/index/index?cityname=' + e.detail.detail.cityName + '&cityPin=' + e.detail.detail.cityPin
    })
  },
  //获取当前位置的经纬度
  getLoaction:function(){
    this.userBMap();
  },
  jumpCity:function(e){
    wx.reLaunch({
      url: '/pages/index/index?cityname=' + this.data.defaultCity + '&cityPin='+this.data.defaultCityPin+''
    })
  },
  getData(){
    let that = this;
    getApp().ajax("queryCityList", {}, 'POST', function (res) {
      //解析数组
      var arr = res.data.cityList;
      var newList = getApp().formatList(arr, 'cityPin');

      // console.log(newList)
      // for (let i = 0; i < arr.length; i++) {
      //   let title = arr[i].cityPin.substr(0, 1);
      //   arr[i].title = arr[i].cityPin.substr(0, 1);
      //   arr[i].item = [{ name: arr[i].cityName, key: arr[i].cityPin.substr(0, 1), cityPin: arr[i].cityPin}]
      // }
      that.setData({
        cityList: newList
      })
    })
  }

})