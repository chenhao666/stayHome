// pages/programme/floor/floor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    floorList: [],
    styleId: '', //风格ID
    brandId: '', //品牌ID
    phValue: '请输入要搜索的楼盘', //查询提示语
    inputVal: '',
    houseName: '',
    cityname: '',
    start: 0, //开始
    height1: wx.getSystemInfoSync().windowWidth / 750 * 64,
    height2: wx.getSystemInfoSync().windowWidth / 750 * 94,
    focus: 0,
    countNum: 0,
    animateStyle: false, //定位是否置顶
    focuStyle: false, //标题的显示与隐藏
    valStyle: false, //清空按钮的显示与隐藏
    inputFlag: false,
    flag: true,
    leadPage:true,
    leadContent:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      start: 0
    })
    if (options.houseName) {
      this.setData({
        houseName: options.houseName
      })
    }
    if (options.cityname) {
      console.log(options.cityname)
      this.setData({
        cityname: options.cityname
      })
    }
    this.getData();
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    setTimeout(function() {
      wx.stopPullDownRefresh();
      that.onLoad(that.options);
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if ((this.data.start + 1) * 10 < this.data.countNum) {
      this.setData({
        start: this.data.start + 1
      })
      this.getDataUp();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onPageScroll: function(e) {
    if (e) {
      // 隐藏楼盘，input置顶
      if (e.scrollTop >= this.data.height2) {
        if (!this.data.animateStyle) {
          this.setData({
            animateStyle: true,
            focuStyle: true
          })
        }
      }
      if (e.scrollTop >= this.data.height1) {
        wx.setNavigationBarTitle({
          title: '楼盘'
        })
      } else {
        wx.setNavigationBarTitle({
          title: ''
        })
      }
      if (this.data.animateStyle) {
        //标题消失居中
        wx.setNavigationBarTitle({
          title: '楼盘'
        })
      }
    }

  },
  //input值改变时触发的事件
  getSearchData: function (e) {
    var that = this;
    //如果点X号，不调用输入框值改变的函数
    if (!this.data.flag) {
      this.setData({
        flag: true
      })
      return;
    }
    //显示与隐藏控件
    if (e.detail.value) {
      this.setData({
        valStyle: true,
        focuStyle: true,
        animateStyle: true
      })
    } else {
      this.setData({
        valStyle: false
      })
    }
    this.setData({
      houseName: e.detail.value,
      inputVal: e.detail.value,
      start: 0
    })
    setTimeout(function () {
      that.getData();
    }, 2000)
    
  },
  //输入框聚焦时触发
  getFocus: function(e) {
    if (!this.data.animateStyle) {
      this.setData({
        animateStyle: true,
        focuStyle: true
      })
    }
    this.setData({
      phValue: ' '
    })
    wx.setNavigationBarTitle({
      title: '楼盘'
    })
  },
  //清楚内容
  clearData: function() {
    this.setData({
      flag: false,
      valStyle: false,
      animateStyle: true,
      houseName: '',
      inputVal: '',
      phValue: '请输入要搜索的楼盘'
    })
    this.getData();
  },
  //取消事件
  handleCancel() {
    if (this.data.animateStyle) {
      this.setData({
        animateStyle: false,
        focuStyle: false,
        inputVal: '',
        houseName: ''
      })
      wx.setNavigationBarTitle({
        title: ''
      })
    }
    this.setData({
      phValue: '请输入要搜索的楼盘',
      valStyle: false,
    })

    this.getData();
  },
  goShow(){
    wx.navigateTo({
      url: '/pages/stylePai/styleIndex/styleIndex',
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
        city: that.data.cityname || '杭州', //城市
        houseName: that.data.houseName || '', //楼盘名称
        start: 0, //开始
        length: 10, //长度
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.retCode == 0) {
          var dataList = res.data.houseInfo
          //长度大于3的 只要前三个
          that.setData({
            floorList: res.data.houseInfo,
            countNum: res.data.countNum,
            flag: true
          })
        } else {
          let arr = []
          that.setData({
            floorList: arr
          })
        }
        if (that.data.floorList.length == 0) {
          that.setData({
            leadPage: false,
            leadContent: true
          })
        } else {
          that.setData({
            leadPage: true
          })
          if (that.data.floorList.length==that.data.countNum){
            that.setData({
              leadContent: false
            })
          }else{
            that.setData({
              leadContent: true
            })
          }
        }
      }
    })
  },
  getDataUp() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask: 'true'
    })
    wx.request({
      url: getApp().globalData.resUrl + 'queryHouseInfo',
      method: 'post' || 'get',
      data: {
        city: that.data.cityname || '杭州', //城市
        houseName: that.data.houseName || '', //楼盘名称
        start: that.data.start * 10, //开始
        length: 10, //长度
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.retCode == 0) {
          var dataList = res.data.houseInfo
          //长度大于3的 只要前三个
          that.setData({
            floorList: that.data.floorList.concat(res.data.houseInfo),
            countNum: res.data.countNum
          })
        } else {
          let arr = []
          that.setData({
            floorList: arr
          })
        }
        if (that.data.floorList.length==that.data.countNum){
            that.setData({
              leadContent: false
            })
          }else{
            that.setData({
              leadContent: true
            })
          }
      }
    })
  }


})