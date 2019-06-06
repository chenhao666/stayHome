// pages/programme/house/house.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    startX: 0, //开始移动时距离左
    endX: 0, //结束移动时距离左
    nowPage: 0, //当前是第几个个页面
    moveX: 0, //手指移动的距离
    flag: true,
    houseModelList: [],
    xinList: [],
    start: 0,
    houseId: 0,
    cityname: '',
    moveIndex: 0, //触摸的第几个
    test: 'test2',
    yesorno: 'none', //判断第一次是否显示
    houseStyleList: ['两室一厅一厨一卫', '两室一厅一厨一卫', '两室一厅一厨一卫'],
    areaIndex: '',
    styleIndex: '',
    buttonImg: '/img/again.png',
    pre: [],
    areaList: [], //面积列表
    typeNameList: [], //居室列表
    houseArea: '', //面积
    houseTypeName: '', //居室名称
    currentIndex: 0,
    countNum: 0,
    height1: wx.getSystemInfoSync().windowWidth / 750 * 92,
    screenHeight: 100 + '%', //屏幕的高度100%，用于弹窗的固定
    Height: 0, //弹窗的最大高度（屏幕可是高度的50%）
    typeInfo:'',
    houseName:'',
    leadContent:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let screenHeight = ((750 / wx.getSystemInfoSync().windowWidth) * wx.getSystemInfoSync().windowHeight) * 0.5
    this.setData({
      start: 0,
      Height: screenHeight
    })
    if (this.options.houseId) {
      this.setData({
        houseId: JSON.parse(this.options.houseId)
      })
    }
    if (options.typeInfo){
      this.setData({
        typeInfo: this.options.typeInfo
      })
    }
    if (this.options.houseName) {
      this.setData({
        houseName: this.options.houseName
      })
    }
    if (this.options.cityname) {
      this.setData({
        cityname: this.options.cityname
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
  onPageScroll(e) {
    //标题消失居中
    if (e) {
      if (e.scrollTop >= this.data.height1) {
        wx.setNavigationBarTitle({
          title: '户型选择'
        })
        // this.setData({
        //   test: 'test2',
        // screenHeight: 100 + '%'
        // })
      } else {
        wx.setNavigationBarTitle({
          title: ''
        })
      }
    }


  },
  goShow(){
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
  //手指触发开始移动
  moveStart: function(e) {
    var startX = e.changedTouches[0].pageX;
    this.setData({
      startX: startX
    });
  },
  //手指触摸后移动完成触发事件
  moveItem: function(e) {
    this.setData({
      moveIndex: e.currentTarget.dataset.index,
      xinList: this.data.houseModelList[e.currentTarget.dataset.index].designInfos
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
      if (houseModelList[this.data.moveIndex].nowPage >= (houseModelList[this.data.moveIndex].designInfos.length - 1)) {
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
  changePic:function(index){
    var that=this;
    var list = this.data.houseModelList.concat([]);
    var m = 1;
    var arr = list[this.data.moveIndex].designInfos.concat();
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
    list[that.data.moveIndex].designInfos = that.data.xinList.concat([]);
    this.setData({
      houseModelList: list,
      currentIndex: index
    })
  },
  // 页面判断逻辑,传入参数为当前是第几页 
  checkPage: function(index) {
    //列表数据
    var list = this.data.houseModelList.concat([]);
    //var data = list[this.data.moveIndex].designInfos;
    var that = this;
    for (var j = 0; j < list.length; j++) {
      var m = 1;
      if (that.data.flag) {
        that.data.xinList = list[j].designInfos.concat([]);
      }
      var arr = list[j].designInfos.concat();
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
          list[that.data.moveIndex].designInfos = that.data.xinList.concat([]);
        }
        //console.log(that.data.xinList)
      }
      if (that.data.flag) {
        list[j].designInfos = that.data.xinList.concat([]);
        if (j == list.length - 1) {
          that.setData({
            flag: false,
            xinList: list[0].designInfos
          })
        }
      }
      if(j<list.length-1){
        that.setData({
          xinList: list[j + 1].designInfos
        })
      }
    }
    var arr=[]
    for(var m = 0;m<list.length;m++){
      for (var n= 0; n < list[m].designInfos.length;n++){
        if (list[m].designInfos[n].coverPic) {
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
  //查看大图
  previewImg(e) {
    this.data.pre = []
    // console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    this.data.pre.push(this.data.houseModelList[index].houseModelUrl +'-slim')
    wx.previewImage({
      current: this.data.houseModelList[index].houseModelUrl, // 当前显示图片的http链接
      urls: this.data.pre // 需要预览的图片http链接列表
    })
  },
  getData() {
    this.setData({
      yesorno: 'none'
    })
    let that = this;
    let data = {
      city: this.data.cityname, //城市
      houseId: this.data.houseId || '', //楼盘名称
      start: 0, //开始
      length: 10, //长度
    }
    if (this.data.typeInfo){
      data.typeInfo = this.data.typeInfo
    }
    if (this.data.houseArea){
      data.houseArea= this.data.houseArea
    }
    if (this.data.houseTypeName){
      data.houseTypeName = this.data.houseTypeName
    }
    // this.data.houseModelList = []
    getApp().ajax("queryHouseDesign", data, 'post', function(res) {
      // var list = res.data.designInfoList;
      var houseModelList = res.data.designInfoList;
      for (var i = 0; i < houseModelList.length; i++) {
        houseModelList[i].nowPage = 0;
        //去除返回数据里面的空格
        for (let j = 0; j < houseModelList[i].designInfos.length; j++) {
          houseModelList[i].designInfos[j].details = houseModelList[i].designInfos[j].details.replace(/(^\s+)|(\s+$)/g, "")
        }
      }
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
          xinList: houseModelList[0].designInfos
        })
      }
      that.checkPage(that.data.nowPage);
      if (that.data.houseModelList.length == that.data.countNum){
        that.setData({
          leadContent: false
        })
      }else{
        that.setData({
          leadContent: true
        })
      }
    })
  },
  //上啦加载
  getDataUp() {
    let that = this;
    let data = {
      city: this.data.cityname || '杭州', //城市
      houseId: this.data.houseId || '', //楼盘名称
      houseArea: this.data.houseArea,
      houseTypeName: this.data.houseTypeName,
      start: this.data.start * 10, //开始
      length: 10, //长度
    }
    getApp().ajax("queryHouseDesign", data, 'post', function(res) {
      var list = res.data.designInfoList;
      var houseModelList = that.data.houseModelList.concat(list);
      for (var i = 0; i < houseModelList.length; i++) {
        houseModelList[i].nowPage = 0;
        //去除返回数据里面的空格
        for (let j = 0; j < houseModelList[i].designInfos.length; j++) {
          houseModelList[i].designInfos[j].details = houseModelList[i].designInfos[j].details.replace(/(^\s+)|(\s+$)/g, "")
        }
      }
      that.setData({
        houseModelList: houseModelList,
        countNum: res.data.countNum,
        flag: true,
        moveIndex: 0,
        test: 'test2',
        yesorno: 'none',
        screenHeight: 100 + '%'
      })
      if (houseModelList.length > 0) {
        that.setData({
          xinList: houseModelList[0].designInfos
        })
      }
      that.checkPage(that.data.nowPage);
      if (houseModelList.length > 0) {
        that.setData({
          xinList: houseModelList[0].designInfos
        })
      }
      that.checkPage(that.data.nowPage);
      if (that.data.houseModelList.length == that.data.countNum) {
        that.setData({
          leadContent: false
        })
      } else {
        that.setData({
          leadContent: true
        })
      }
    })
  },
  jumpProduct(e) {
    let index = e.currentTarget.dataset.index
    let houseModel = this.data.houseModelList[index].designInfos[this.data.currentIndex].houseModel;
    let styleName = this.data.houseModelList[index].designInfos[this.data.currentIndex].styleName
    wx.navigateTo({
      
      url: '/pages/programme/programmeInfo/programmeInfo?houseId=' + this.data.houseId + '&cityname=' + this.data.cityname + '&houseModel=' + houseModel + '&styleName=' + styleName + '&typeInfo=' + this.data.typeInfo
    })
  },
  //打开弹窗
  openDown() {
    if (this.data.test == 'test1') {
      this.setData({
        test: 'test2',
        yesorno: 'none',
        screenHeight: 100 + '%'
      })
    } else if (this.data.test == 'test2') {
      this.setData({
        test: 'test1',
        yesorno: 'block',
        screenHeight: (750 / wx.getSystemInfoSync().windowWidth) * wx.getSystemInfoSync().windowHeight + 'rpx'
      })
    }
    this.getSelectData();
  },
  closeMenue() {
    this.setData({
      test: 'test2',
      screenHeight: 100 + '%'
    })
  },
  areaSelect(e) {
    let index = e.currentTarget.dataset.aindex
    let that = this;
    this.setData({
      areaIndex: index,
      houseArea: that.data.areaList[index]
    })
  },
  styleSelect(e) {
    let index = e.currentTarget.dataset.bindex;
    let that = this;
    this.setData({
      styleIndex: index,
      houseTypeName: that.data.typeNameList[index]
    })
  },
  reset() {
    this.setData({
      styleIndex: '',
      houseArea: '',
      areaIndex: '',
      houseTypeName: ''
    })
  },
  //获取户型选择参数
  getSelectData() {
    let that = this;
    let data = {
      houseId: this.data.houseId || '', //楼盘名称
    }
    if(that.data.typeInfo){
      data.typeInfo = 'banner'
    }
    if (this.data.cityname){
      data.city = this.data.cityname
    }
    getApp().ajax("selectDesignHouseType", data, 'post', function(res) {
      that.setData({
        areaList: res.data.areaList,
        typeNameList: res.data.typeNameList
      })
    })
  },
 


})