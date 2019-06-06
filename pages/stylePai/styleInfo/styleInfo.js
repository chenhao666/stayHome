// pages/programme/programmeInfo/programmeInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    programmeList: [],//方案列表
    totalPrice:'',
    programmeIndex: 0,//方案下标
    locationList: [],//位置列表
    styleList: [],
    current: 0,//初始值
    locationIndex: 0,//位置下标
    changeHeight: 0,
    interval: 5000,
    duration: 1000,
    houseId: 0,
    intoView: '',
    styleType:''//类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //console.log(options)
    //获取方案信息
    getApp().ajax("stylePai/getDesign", { designUuid: options.uuid}, 'GET', function (res) {
      //console.log(res);
      that.setData({
        programmeList: [res.data.data],
        styleType: options.cityname
      });
    })
    //获取价格信息
    getApp().ajax("stylePai/getDesignFurnitureTotal", { designUuid: options.uuid }, 'GET', function (res) {
      //console.log(res);
      that.setData({
        totalPrice: res.data.data || ''
      });
    })
    //获取空间信息和简介
    getApp().ajax("stylePai/getSpaceTemplateHaving", { designUuid: options.uuid }, 'GET', function (res) {
      //console.log(res);
      that.setData({
        locationList: res.data.data
      });
      //重置高度
      that.OnChangeHeight();
    })
    //获取风格列表
    getApp().ajax("stylePai/listDesignByStylePai", { excludeDesignUuid: this.options.uuid, stylePaiCode: this.options.cityname }, 'POST', function (res) {
      //console.log(res);
      that.setData({
        styleList: res.data.data
      });
    })
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
    //this.OnChangeHeight();
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
    //console.log(1)
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

  },


  //监听页面滚动
  onPageScroll: function (ev) {
    //console.log(ev)
    if (ev.scrollTop > 50) {
      wx.setNavigationBarTitle({
        title: this.data.programmeList[this.data.programmeIndex].designName
      })
    } else {
      wx.setNavigationBarTitle({
        title: ''
      })
    }
  },
  //改变高度
  OnChangeHeight: function (e) {
    //console.log(e);
    var that = this;
    //改变高度
    var index = this.data.locationIndex;
    var query = wx.createSelectorQuery();
    query.select("#list_item" + index).boundingClientRect();
    var that = this;
    query.exec(function (res) {
      // console.log(res[0].height)
      that.setData({
        "changeHeight": res[0].height + 40
      })
    })
  },
  //商品列表页
  goProductList: function () {
    wx.navigateTo({
      url: '/pages/order/productList/productList'
    })
  },
  //联系客服
  connectCustomer: function (e) {
    var nameList = {
      myName: wx.getStorageSync('myUsername') || '',
      your: 'customerservice'
    }//跳转信息
    var linkManList = {
      name: 'customerservice',
      num: 0,
      lastChat: '',
      time: ''
    }
    wx.getStorage({
      key: 'linkMan',
      success: function (res) {
        var flag = 0;//标记
        var list = JSON.parse(res.data);

        //客服信息
        for (var i = 0; i < list.length; i++) {
          if (list[i].name == 'customerservice') {
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
        wx.navigateTo({
          url: '/pages/chat/chatroom/chatroom?username=' + JSON.stringify(nameList)
        })
      },
      fail: function () {
        var list = [];
        list.push(linkManList);
        wx.setStorage({
          key: "linkMan",
          data: JSON.stringify(list)
        })
      }
    })
  },
  //联系设计师
  connectDesigner: function (e) {
    var url = '/pages/chat/chat';
    getApp().checkToken(url, function (flag) {
      if (flag) {
        getApp().ajax("querydesignAuth", { token: wx.getStorageSync('token') }, 'POST', function (res) {
          if (res.data.isDesignAuth) {
            wx.navigateTo({
              url: '/pages/chat/confirmDesign/confirmDesign'
            })
          } else {
            var nameList = {
              myName: wx.getStorageSync('myUsername') || '',
              your: 'designer'
            }//跳转信息
            var linkManList = {
              name: 'designer',
              num: 0,
              lastChat: '',
              time: ''
            }
            wx.getStorage({
              key: 'linkMan',
              success: function (res) {
                var flag = 0;//标记
                var list = JSON.parse(res.data);
                //客服信息
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
                wx.navigateTo({
                  url: '/pages/chat/chatroom/chatroom?username=' + JSON.stringify(nameList)
                })
              },
              fail: function () {
                var list = [];
                list.push(linkManList);
                wx.setStorage({
                  key: "linkMan",
                  data: JSON.stringify(list)
                })
              }
            })
          }
        })
      }
    })
  },
  //改变方案
  changePrograme: function (index) {
    var list = this.data.programmeList[index].templates || [];
    
    this.setData({
      programmeIndex: index,
      locationList: list,
      styleList: this.data.programmeList[index].styleList
    })
    if (list.length > 0) {
      this.OnChangeHeight();
    }
  },
  //改变滑块
  changeLocation: function (e) {
    //console.log(e.detail.current)
    this.setData({
      locationIndex: e.detail.current
    })
    this.setData({
      intoView: 'num_' + this.data.locationList[this.data.locationIndex].areaTypeUuid
    })
    this.OnChangeHeight();
  },
  //点击改变滑块
  changeTapLocation: function (e) {
    //console.log(e.target.dataset.index)
    this.setData({
      current: e.currentTarget.dataset.index,
      locationIndex: e.currentTarget.dataset.index
    })
    this.OnChangeHeight();
  },
  //改变方案
  changeTabProgramme: function (e) {
    //console.log(e.currentTarget.dataset.index)
    this.setData({
      programmeIndex: e.currentTarget.dataset.index,
      current: 0,
      locationIndex: 0
    })
    this.changePrograme(e.currentTarget.dataset.index);
  },
  //改变风格
  changeTapStyle: function (e) {
    //console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    //console.log(this.data.styleList[index])
    wx.redirectTo({
      url: '/pages/stylePai/styleInfo/styleInfo?uuid=' + this.data.styleList[index].uuid + '&cityname=' + this.data.styleList[index].stylePaiCode
    })
  },
  //跳转3d图
  goThreeD: function (e) {
    var that = this;
    var designId = this.data.programmeList[this.data.programmeIndex].designId;
    getApp().ajax("addThreeDulClickNum", { designId: designId }, 'GET', function (res) {
      wx.navigateTo({
        url: '/pages/programme/showThree/showThree?url=' + that.data.programmeList[that.data.programmeIndex].threeDurl
      })
    })
  },
  //跳转商品列表
  goProductList: function () {
    wx.navigateTo({
      url: '/pages/order/productList/productList?designId=' + this.data.programmeList[this.data.programmeIndex].id
    })
  },
  //分享
  onShareAppMessage: function (res) {
    //console.log(res.target.dataset)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    var list = this.data.programmeList;
    var index = this.data.programmeIndex;
    var title = list[index].designName;
    if (this.options.styleName){
      title = this.options.styleName + '-' + list[index].designName
    }
    return {
      title: title,
      desc: list[index].details,
      imageUrl: list[index].coverPic,
      path: "/pages/programme/showThree/showThree?url=" + list[index].threeDurl
    }
  }
})