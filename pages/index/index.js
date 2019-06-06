// pages/index/index.js
let bmap = require('../../utils/bmap-wx.min.js');
let pinyin = require('../../utils/pinyin.js');
var wxMarkerData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    homeList: [],
    indicatorDots: false,
    interval: 2000,
    currentSwiper: 0,
    current: 0,
    videoShow: "none", //视频的显示与隐藏
    height: 0, //手机可视窗口高度
    url: '', //视频播放路径
    cityname: '杭州',
    cityPinYin: "HangZhou",
    weather: {},
    greetMessage: '',
    scrollFlag: false, //滑动标识
    scrollHeight: wx.getSystemInfoSync().windowWidth / 750 * 66,
    stylePaiList: [],
    goodsList: [],
    totalNum: 0,
    currentIndex: 1,
    cityList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('indexData')) {
      this.setData(wx.getStorageSync('indexData'));
    }
    if (this.options) {
      if (this.options.cityname && this.options.cityPin) {
        this.setData({
          cityname: this.options.cityname,
          cityPinYin: this. options.cityPin
        })
        this.getSinaWeather();
      }
    }
    if (getApp().globalData.loactionFlag) {
      getApp().globalData.loactionFlag = false;
      this.userBMap();
    }
    this.queryCityHouseName(); //楼盘列表
    this.queryBanners(); //获取banner图
    this.getNowTime(); //获取时间
    this.getListStyle(); //风格派列表
    this.getGoodsList(); //窝给你选列表
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    setTimeout(function() {
      wx.stopPullDownRefresh();
      that.onLoad();
      that.onShow();
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //跳转到风格派
  jumpInfo(e) {
    let index = e.currentTarget.dataset.index
    let uuid = this.data.stylePaiList[index].uuid;
    let stylePaiCode = this.data.stylePaiList[index].stylePaiCode;
    wx.navigateTo({
      url: '/pages/stylePai/styleInfo/styleInfo?uuid=' + uuid + '&cityname=' + stylePaiCode
    })
  },
  swiperChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  homeDeatal: function(e) {
    //点击的第几个
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/programme/house/house?houseId=' + this.data.homeList[index].houseId + '&cityname=' + this.data.cityname + '&houseName=' + this.data.homeList[index].houseName + ''
    })
  },
  videoPlay: function() {
    let that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        // 获取可使用窗口高度
        let clientHeight = res.windowHeight;
        // 获取可使用窗口宽度
        let clientWidth = res.windowWidth;
        // 算出比例
        let ratio = 750 / clientWidth;
        // 算出高度(单位rpx)
        let height = clientHeight * ratio;
        // 设置高度
        that.setData({
          height: height,
          videoShow: "block",
          url: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
        });
      }
    });
  },
  videoHidden: function() {
    this.setData({
      videoShow: "none",
      url: ''
    })
  },
  // 滑动事件
  onPageScroll: function(e) {
    if (e) {
      if (e.scrollTop > 0) {
        this.setData({
          scrollFlag: true,
        })
      } else {
        this.setData({
          scrollFlag: false,
        })
      }
    }
  },
  jumpCity: function() {
    wx.navigateTo({
      url: '/pages/city/city'
    })
  },
  //你家在哪儿？ 列表数据
  queryCityHouseName: function() {
    let that = this;
    getApp().ajax("queryCityHouseName", {
      city: that.data.cityname
    }, 'get', function(res) {
      that.setData({
        homeList: res.data.houseInfo
      })
      wx.setStorageSync('indexData', that.data)
    })
  },
  //banner图列表
  queryBanners: function() {
    let that = this;
    getApp().ajax("queryBanners", {}, 'POST', function(res) {
      that.setData({
        imgUrls: res.data.banners
      })
      wx.setStorageSync('indexData', that.data)
    })
  },
  //获取天气信息
  getSinaWeather() {
    console.log(this.data.cityPinYin)
    let that = this;
    getApp().ajax("getSinaWeather", {
      city: that.data.cityPinYin
    }, 'get', function(res) {
      res.data.data.weather = res.data.data.weather.split('|')[0].replace(/\s*/g, "");
      that.setData({
        weather: res.data.data
      })
      // wx.setStorageSync('indexData', that.data)
    })
  },
  show_more: function() {
    wx.navigateTo({
      url: '/pages/programme/floor/floor?cityname=' + this.data.cityname
    })
  },
  //窝给你选的跳转
  show_more_home: function() {
    wx.switchTab({
      url: '/pages/programme/goodThing/goodThing'
    })
  },
  goodThing(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/programme/goodThingDetail/goodThingDetail?uuid=' + this.data.goodsList[index].uuid + '&goodsId=' + this.data.goodsList[index].goodsId
    })
  },
  bindscroll(e) {
    this.setData({
      currentIndex: Math.ceil(((e.detail.scrollLeft + 1) / (wx.getSystemInfoSync().windowWidth / 750)) / 635) <= 0 ? '1' : Math.ceil(((e.detail.scrollLeft + 1) / (wx.getSystemInfoSync().windowWidth / 750)) / 635)
    })
  },
  //跳转到风格派页面
  jumpStylePai() {
    wx.navigateTo({
      url: '/pages/stylePai/styleIndex/styleIndex'
    })
  },
  jumpChat() {
    var url = '/pages/chat/chat';
    getApp().checkToken(url, function(flag) {
      if (flag) {
        wx.navigateTo({
          url: url,
        })
      }
    })
  },
  bannerTap(e) {
    var index = e.target.dataset.index;
    var bannerType = e.target.dataset.type;
    if (bannerType == 1) {
      var nameList = {
        myName: wx.getStorageSync('myUsername') || '',
        your: 'designer'
      } //跳转信息
      var linkManList = {
        name: 'designer',
        num: 0,
        lastChat: '',
        time: ''
      }
      if (wx.getStorageSync('linkMan')) {
        var flag = 0; //标记
        var list = JSON.parse(wx.getStorageSync('linkMan')) || [];
        for (var i = 0; i < list.length; i++) {
          if (list[i].name == 'designer') {
            flag = 1;
          }
        }
        if (!flag) {
          list.push(linkManList);
          wx.setStorage({
            key: "linkMan",
            data: JSON.stringify(list)
          })
        }
      } else {
        var list = [];
        list.push(linkManList);
        wx.setStorage({
          key: "linkMan",
          data: JSON.stringify(list)
        })
      }
      wx.navigateTo({
        url: '/pages/chat/chatroom/chatroom?username=' + JSON.stringify(nameList)
      })
    } else if (bannerType == 3) {
      var url = this.data.imgUrls[index].content;
      wx.navigateTo({
        url: '/pages/programme/showThree/showThree?url=' + url
      })
    } else if (bannerType == 4) {
      var cityname = this.data.imgUrls[index].city;
      var houseId = this.data.imgUrls[index].houseId;
      var houseName = this.data.imgUrls[index].houseName;
      wx.navigateTo({
        url: '/pages/programme/house/house?houseId=' + houseId + '&houseName=' + houseName + '&typeInfo=' + 'banner'
      })
    } else {

    }
  },
  getNowTime() {
    var hour = new Date().getHours()
    if (hour >= 6 && hour < 12) {
      this.setData({
        greetMessage: '上午好。'
      })
    } else if (hour < 18 && hour >= 12) {
      this.setData({
        greetMessage: '下午好。'
      })

    } else if (18 <= hour < 24 || 0 < hour < 6) {
      this.setData({
        greetMessage: '晚上好。'
      })
    } else {

    }
    wx.setStorageSync('indexData', this.data)
  },
  userBMap: function() {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'bLlaZ4IYQZSGO251iN9PuyWc9XIzemMP'
    });
    var fail = function(data) {

    };
    var success = function(data) {
      // console.log(data,'success')
      wxMarkerData = data.wxMarkerData;
      var cityTitle = data.originalData.result.addressComponent.city.replace('市', '')
      //获取城市列表
      getApp().ajax("queryCityList", {}, 'POST', function(res) {
        //解析数组
        var arr = res.data.cityList;
        // var newList = getApp().formatList(arr, 'cityPin');
        // console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          if (cityTitle == arr[i].cityName) {
            that.setData({
              cityname: cityTitle
            });
          } else {
            that.setData({
              cityname: '杭州'
            });
          }
        }
        // that.setData({
        //   cityList: newList
        // })
      })
      // that.setData({
      //   cityname: data.originalData.result.addressComponent.city.replace('市', '')
      // });
      that.data.cityPinYin = pinyin.toPY(that.data.cityname).pinyin;
      wx.setStorageSync('indexData', that.data);
    }

    that.getSinaWeather(); //获取天气
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
    });
  },
  getCityList() {
    let that = this;
    getApp().ajax("queryCityList", {}, 'POST', function(res) {
      //解析数组
      var arr = res.data.cityList;
      var newList = getApp().formatList(arr, 'cityPin');
      that.setData({
        cityList: newList
      })
    })
  },
  //获取风格派列表
  getListStyle() {
    let that = this;
    getApp().ajax("home/listStylePai", {}, 'get', function(res) {
      let list = res.data.data;
      let newList = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].stylePaiCode =='unusual'){
          newList.unshift(list[i]);
        }else{
          list[i].homePagePic = list[i].coverPic;
          newList.push(list[i])
        }
      }
      that.setData({
        stylePaiList: newList
      })
    })
  },
  // 窝给你选列表
  getGoodsList: function() {
    let that = this;
    getApp().ajax("mall/listPromotionGoods", {}, 'get', function(res) {
      that.setData({
        goodsList: res.data.data,
        totalNum: res.data.data.length,
        currentIndex: 1
      })
    })
  }


})