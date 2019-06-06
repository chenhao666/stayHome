// pages/programme/goodThing/goodThing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    //最新推荐参数
    pageX:0,//触摸开始坐标
    moveX: 0,//移动的距离
    rate: 750 / wx.getSystemInfoSync().windowWidth,
    currentId:0,
    scale:0.87,//缩小比例的初始值
    houseModelList:[],
    userInfo: {},
    startX: 0, //开始移动时距离左
    endX: 0, //结束移动时距离左
    nowPage: 0, //当前是第几个个页面
    moveX: 0, //手指移动的距离
    xinList: [],
    start: 0,
    moveIndex: 0, //触摸的第几个
    height1: wx.getSystemInfoSync().windowWidth / 750 * 64,
    countNum:0,//页面的总数
    first_title:'最新推荐',
    second_title:'往期精选',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.animation = wx.createAnimation({
      duration: 500,
      timingFunction: "ease"
    })
    this.setData({
      start:0
    })
    this.getData();
    this.getGoodsList();
    // this.getEvenData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onPageScroll: function (e) {
    if (e) {
      if (e.scrollTop >= this.data.height1) {
        wx.setNavigationBarTitle({
          title: '好物'
        })
      } else {
        wx.setNavigationBarTitle({
          title: ''
        })
      }
    }

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
  onShareAppMessage: function () {

  },
  swiperChange(e){
    this.setData({
      currentId:e.detail.current
    })
  },
  goodThing(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/programme/goodThingDetail/goodThingDetail?uuid=' + this.data.goodsList[index].uuid + '&goodsId=' + this.data.goodsList[index].goodsId
    })
  },
  goodThing1(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/programme/goodThingDetail/goodThingDetail?uuid=' + this.data.houseModelList[index].uuid + '&goodsId=' + this.data.houseModelList[index].goodsId
    })
  },
  //手指触发开始移动
  moveStart: function (e) {
    var startX = e.changedTouches[0].pageX;
    this.setData({
      startX: startX
    });
  },
  //手指触摸后移动完成触发事件
  moveItem: function (e) {
    this.setData({
      moveIndex: e.currentTarget.dataset.index,
      xinList: this.data.houseModelList[e.currentTarget.dataset.index].goodsImageList
    })
    var that = this;
    var endX = e.changedTouches[0].pageX;
    this.setData({
      endX: endX
    });
    //计算手指触摸偏移剧距离
    this.data.moveX = this.data.startX - this.data.endX;
    var houseModelList = that.data.houseModelList.concat([]);
    //向左移动
    if (this.data.moveX > 20) {
      if (houseModelList[this.data.moveIndex].nowPage >= (houseModelList[this.data.moveIndex].goodsImageList.length - 1)) {
        // wx.showToast({
        //   title: '已经是最后了',
        //   icon: 'none'
        // })
        return false;
      }
      houseModelList[this.data.moveIndex].nowPage += 1;
    }
    if (this.data.moveX < -20) {
      if (houseModelList[this.data.moveIndex].nowPage <= 0) {
        // wx.showToast({
        //   title: '已经是第一个了',
        //   icon: 'none'
        // })
        return false;
      }
      houseModelList[this.data.moveIndex].nowPage -= 1;
    }
    that.setData({
      houseModelList: houseModelList.concat([])
    });
    this.changePic(houseModelList[this.data.moveIndex].nowPage);
  },
  //滑动
  changePic: function (index) {
    var that = this;
    var list = this.data.houseModelList.concat([]);
    var m = 1;
    var arr = list[this.data.moveIndex].goodsImageList.concat();
    this.setData({
      xinList: arr
    })
    for (var i = 0; i < arr.length; i++) {
      //先将所有的页面隐藏
      var disp = 'xinList[' + i + '].display';
      var sca = 'xinList[' + i + '].scale'; //比例
      var slateX = 'xinList[' + i + '].slateX';
      var zIndex = 'xinList[' + i + '].zIndex';
      var style = 'xinList[' + i + '].style';
      that.setData({
        [disp]: 0,
        [style]: "display:block",
      });
      //向左移动上一个页面
      if (i == (index - 1)) {
        that.setData({
          [slateX]: '-105%',
          [disp]: 1,
          [zIndex]: 2,
          [sca]: 0.87,
        });
      }
      if (i == (index - 1) && this.data.moveX < -20) {
        that.setData({
          [slateX]: '-105%',
          [disp]: 1,
          [zIndex]: 1
        });
      }
      //向右移动的最右边要display:none的页面
      if (i == (index + 3)) {
        that.setData({
          [style]: 'display:none',
          [slateX]: '0',
          [zIndex]: -10,
          // [style]: "z-index:99"
        });
      }
      if (i == index || (i > index && (i < index + 3))) {
        that.setData({
          [disp]: 1
        });
        //第一张
        if (m == 1 && i == index) {
          this.setData({
            [sca]: 1,
            [slateX]: 0,
            [zIndex]: 1,
          });
        }
        //第二张
        else if (m == 2 && i == index + 1) {
          this.setData({
            [sca]: 0.87,
            [slateX]: '32rpx',
            [zIndex]: -1,
          });
        }
        //第三张
        else if (m == 3 && i == index + 2) {
          this.setData({
            [sca]: 0.74,
            [slateX]: '64rpx',
            [zIndex]: -2,
          });
        }
        m++;
      }
    }
    list[that.data.moveIndex].goodsImageList = that.data.xinList.concat([]);
    this.setData({
      houseModelList: list,
      currentIndex: index
    })
  },
  // 页面判断逻辑,传入参数为当前是第几页 
  checkPage: function (index) {
    //列表数据
    var list = this.data.houseModelList.concat([]);
    //var data = list[this.data.moveIndex].goodsImageList;
    var that = this;
    for (var j = 0; j < list.length; j++) {
      var m = 1;
      if (that.data.flag) {
        that.data.xinList = list[j].goodsImageList.concat([]);
      }
      var arr = list[j].goodsImageList.concat();
      for (var i = 0; i < arr.length; i++) {
        //先将所有的页面隐藏
        var disp = 'xinList[' + i + '].display';
        var sca = 'xinList[' + i + '].scale'; //比例
        var slateX = 'xinList[' + i + '].slateX';
        var zIndex = 'xinList[' + i + '].zIndex';
        var style = 'xinList[' + i + '].style';
        that.setData({
          [disp]: 0,
          [style]: "display:block",
        });
        //向左移动上一个页面
        if (i == (index - 1) && this.data.moveX > 20) {
          that.setData({
            [slateX]: '-105%',
            [disp]: 1,
            [zIndex]: 2,
            [sca]: 0.87,
          });
        }
        if (i == (index - 1) && this.data.moveX < -20) {
          that.setData({
            [slateX]: '-105%',
            [disp]: 1,
            [zIndex]: 1
          });
        }
        //向右移动的最右边要display:none的页面
        if (i == (index + 3)) {
          that.setData({
            [style]: 'display:none',
            [slateX]: '0',
            [zIndex]: -10,
            // [style]: "z-index:99"
          });
        }
        if (i == index || (i > index && (i < index + 3))) {
          that.setData({
            [disp]: 1
          });
          //第一张
          if (m == 1 && i == index) {
            this.setData({
              [sca]: 1,
              [slateX]: 0,
              [zIndex]: 1,
            });
          }
          //第二张
          else if (m == 2 && i == index + 1) {
            this.setData({
              [sca]: 0.87,
              [slateX]: '32rpx',
              [zIndex]: -1,
            });
          }
          //第三张
          else if (m == 3 && i == index + 2) {
            this.setData({
              [sca]: 0.74,
              [slateX]: '64rpx',
              [zIndex]: -2,
            });
          }
          m++;
        }
        if (!that.data.flag) {
          list[that.data.moveIndex].goodsImageList = that.data.xinList.concat([]);
        }
        //console.log(that.data.xinList)
      }
      if (that.data.flag) {
        list[j].goodsImageList = that.data.xinList.concat([]);
        if (j == list.length - 1) {
          that.setData({
            flag: false,
            xinList: list[0].goodsImageList
          })
        }
      }
      if (j < list.length - 1) {
        that.setData({
          xinList: list[j + 1].goodsImageList
        })
      }
    }
    var arr = []
    for (var m = 0; m < list.length; m++) {
      for (var n = 0; n < list[m].goodsImageList.length; n++) {
        if (list[m].goodsImageList[n].coverPic) {
          arr.push(list[m])
          break;
        }
      }
    }
    that.setData({
      houseModelList: arr,
      currentIndex: index
    })
  },
  getData() {
    let that = this;
    let data = {
      start: 0, //开始
      length: 10, //长度
    }
    // if (this.data.typeInfo) {
    //   data.typeInfo = this.data.typeInfo
    // }
    // if (this.data.houseArea) {
    //   data.houseArea = this.data.houseArea
    // }
    // if (this.data.houseTypeName) {
    //   data.houseTypeName = this.data.houseTypeName
    // }
    // this.data.houseModelList = []
    getApp().ajax("mall/listOtherGoods", data, 'post', function (res) {
      // var list = res.data.designInfoList;
      var houseModelList = res.data.data;
      for (var i = 0; i < houseModelList.length; i++) {
        houseModelList[i].nowPage = 0;
        //去除返回数据里面的空格
        for (let j = 0; j < houseModelList[i].goodsImageList.length; j++) {
          houseModelList[i].goodsImageList[j] = {
            coverPic: houseModelList[i].goodsImageList[j]
          }
        }
      }
      // console.log(houseModelList)
      that.setData({
        houseModelList: houseModelList,
        countNum: res.data.countNum,
        flag: true,
        moveIndex: 0,
        test: 'test2',
        screenHeight: 100 + '%'
      })

      if (houseModelList.length > 0) {
        that.setData({
          xinList: houseModelList[0].goodsImageList
        })
      }
      that.checkPage(that.data.nowPage);
    })
  },
  getDataUp() {
    let that = this;
    let data = {
      start: that.data.houseModelList.length, //开始
      length: 10, //长度
    }
    console.log(data)
    // if (this.data.typeInfo) {
    //   data.typeInfo = this.data.typeInfo
    // }
    // if (this.data.houseArea) {
    //   data.houseArea = this.data.houseArea
    // }
    // if (this.data.houseTypeName) {
    //   data.houseTypeName = this.data.houseTypeName
    // }
    // this.data.houseModelList = []
    getApp().ajax("mall/listOtherGoods", data, 'post', function (res) {
      var list = res.data.data;
      console.log(list)
      // var list = that.data.list;
      for (var i = 0; i < list.length; i++) {
        list[i].nowPage = 0;
        for (let j = 0; j < list[i].goodsImageList.length; j++) {
          list[i].goodsImageList[j] = {
            coverPic: list[i].goodsImageList[j]
          }
        }
      }
      // console.log(houseModelList)
      that.setData({
        houseModelList: that.data.houseModelList.concat(list),
        countNum: res.data.countNum,
        flag: true,
        moveIndex: 0,
        test: 'test2',
        screenHeight: 100 + '%'
      })

      if (that.data.houseModelList.length > 0) {
        // that.setData({
        //   xinList: that.data.houseModelList[0].goodsImageList
        // })
      }
      that.checkPage(that.data.nowPage);
    })
  },
    // 窝给你选列表
  getGoodsList: function () {
    let that = this;
    getApp().ajax("mall/listPromotionGoods", {}, 'get', function (res) {
      that.setData({
        goodsList: res.data.data
      })
    })
  },
  //往期精选
  // getEvenData: function () {
  //   let that = this;
  //   let data ={
      
  //   }
  //   getApp().ajax("mall/listOtherGoods", {}, 'get', function (res) {
  //     that.setData({
  //       goodsList: res.data.data
  //     })
  //   })
  // },


})