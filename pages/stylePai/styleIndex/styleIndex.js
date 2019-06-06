// pages/stylePai/styleIndex/styleIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unusualList: [], //与众不同数据
    internetList: [], //时尚网红数据
    unusualStyle: false,
    internetStyle: false,
    styleUuid: '',
    styleList: [],
    programmerList: [],
    currentIndex: 0, //经典风格选中控制
    // currentIndex:'',//当前滑块的index
    changeHeight: 0, //滑动swiper的高度
    countNum: 0,
    intoView: '',
    start: 0,
    rat: wx.getSystemInfoSync().windowWidth / 750,
    contentHeught: 0,
    styleFlag: false, //經典風格是否置頂,
    windowHeight: 0, //可视窗口的高度
    shadestyle: 'none', //遮罩的初始值
    test: 'test2',
    scrollTopHight: 0,
    moveHeight:0,
    height1: wx.getSystemInfoSync().windowWidth / 750 * 64,
    firstName:'与众不同',//埋点需要
    secondName:'时尚网红',
    thirdName:'经典风格',
    leadPageFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight: res.windowHeight - 55 * that.data.rat
        })
      }
    })
    this.getData('unusual'); //与众不同
    this.getData('internetCelebrity'); //时尚网红
    this.getstyleList(); //经典风格列表
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
  onPullDownRefresh: function() {
    var that = this;
    setTimeout(function() {
      wx.stopPullDownRefresh();
      that.onLoad(that.options);
      // that.getStyleProgrammerList();
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getStyleProgrammerListUp();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getHeight() {
    let that = this;
    //获取该节点距上面的距离
    const query = wx.createSelectorQuery()
    query.select('#contentHeught').boundingClientRect()
    query.exec(function(res) {
      that.setData({
        contentHeught: res[0].height
      })
    })
  },
  //阻止页面滚动
  preventScroll(){
    return
  },
  // 监听页面滚动
  onPageScroll(e) {
    //风格派标题的固定
    if (e.scrollTop >= this.data.height1) {
      wx.setNavigationBarTitle({
        title: '风格派'
      })
    } else {
      wx.setNavigationBarTitle({
        title: ''
      })
    }
    //横向滑动的固定
    if (e.scrollTop > this.data.contentHeught) {
      this.setData({
        styleFlag: true
      })
    } else {
      this.setData({
        styleFlag: false
      })
    }
  },
  //点击遮罩事件
  closeMenue() {
    this.setData({
      test:'test2'
    })
  },
  getData(data) {
    let that = this;
    getApp().ajax("stylePai/listDesignByStylePai", {
      stylePaiCode: data
    }, 'post', function(res) {
      let arr = res.data.data;
      if (res.data.retCode == 0) {

        //根据data值的不同，给不同的数组赋值
        if (data == 'unusual') {
          if (res.data.data.length == 1) {
            that.setData({
              unusualStyle: true
            })
          }
          //给数组内的details去除空格
          if (res.data.data.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              arr[i].details = arr[i].details.replace(/(^\s+)|(\s+$)/g, "")
            }
          }
          that.setData({
            unusualList: arr
          })
        } else if (data == 'internetCelebrity') {
          if (res.data.data.length == 1) {
            that.setData({
              internetStyle: true
            })
          }
          //给数组内的details去除空格
          if (res.data.data.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              arr[i].details = arr[i].details.replace(/(^\s+)|(\s+$)/g, "")
            }
          }
          that.setData({
            internetList: arr
          })
        } else {

        }
        that.getHeight();
      }
    })
  },
  //滑动切换
  currentChange(e) {
    this.setData({
      currentIndex: e.detail.current,
      intoView: 'num_' + e.detail.current,
      start: 0
    })
    if (e.detail.current == 0) {
      this.setData({
        styleUuid: ''
      })
    } else {
      this.setData({
        styleUuid: this.data.styleList[e.detail.current].styleUuid
      })
    }
    // this.onChangeHeight(); //获取swiper的高度
    // this.getstyleList();`
    this.getStyleProgrammerList();
  },
  //改变滑块的高度
  onChangeHeight() {
    let that = this;
    let index = this.data.currentIndex;
    const query = wx.createSelectorQuery();
    query.select("#programmer_item" + index).boundingClientRect();
    query.exec(function(res) {
      that.setData({
        "changeHeight": res[0].height + 50
      })
    })
  },
  // selectStyle(e){
  //   let index = e.currentTarget.dataset.index;
  //   this.setData({
  //     currentIndex: index
  //   })
  // },
  //获取风格ID
  getStyleId(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      currentIndex: index
    })
    if (this.data.test == 'test1') {
      this.setData({
        test: 'test2'
      })
    }
    if (index != 0) {
      // 全部的时候styleUuid为空
      this.setData({
        leadPageFlag: true
      })
    } 
  },
  // 获取风格列表
  getstyleList() {
    let that = this;
    getApp().ajax("stylePai/listStyleHaving", {}, 'get', function(res) {
      if (res.data.retCode == 0) {
        that.setData({
          styleList: res.data.data
        })
      }
      // console.log(that.data.styleList)
      that.getStyleProgrammerList(); //经典风格方案列表
    })
  },
  jumpDessign(){
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
  //跳转
  jumpLocation() {
    let that = this;
    let index = this.data.currentIndex;
    const query = wx.createSelectorQuery();
    query.select("#scrollTop").boundingClientRect();
    query.exec(function(res) {
      that.setData({
        scrollTopHight: res[0].top
      })
    })
   
    query.select("#classical_title").boundingClientRect();
    query.exec(function (res) {
      that.setData({
        moveHeight: res[1].top
      })
    })
    wx.pageScrollTo({
      scrollTop: this.data.contentHeught
    })
    this.setData({
      test: 'test1',
      shadestyle:'block'
    })
  },
  //关闭弹窗
  handleClose() {
    this.setData({
      test: 'test2'
    })
    wx.pageScrollTo({
      scrollTop: this.data.contentHeught - this.data.scrollTopHight + 30
    })
  },
  //获取风格方案列表
  getStyleProgrammerList() {
    let that = this;
    wx.request({
      url: getApp().globalData.resUrl + 'stylePai/listDesignByStylePai',
      method: 'post' || 'get',
      data: {
        length: 10,
        start: 0,
        stylePaiCode: 'classicStyle',
        styleUuid: this.data.styleList[this.data.currentIndex].styleUuid || ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        let arr = res.data.data
        if (res.data.retCode == 0) {
          //给数组内的details去除空格
          if (res.data.data.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              arr[i].details = arr[i].details.replace(/(^\s+)|(\s+$)/g, "")
            }
          }
          that.setData({
            programmerList: arr,
            countNum: res.data.countNum,
          })
          if (that.data.programmerList.length > 0) {
            that.onChangeHeight();
          }
        //   if ((that.data.styleList[that.data.currentIndex].styleUuid || '') == '' && that.data.programmerList.length == 0){
        //     that.setData({
        //       leadPageFlag:false
        //     })
        //  }
        }
      }
    })
  },
  //与众不同跳轉
  jumpInfo(e){
    let index = e.currentTarget.dataset.index
    if (e.currentTarget.dataset.style=='unusual'){
      var stylePaiCode = "unusual"
      var uuid = this.data.unusualList[index].uuid;
      wx.navigateTo({
        url: '/pages/stylePai/styleInfo/styleInfo?uuid=' + uuid + '&cityname=' + stylePaiCode
      })
    } else if (e.currentTarget.dataset.style == 'internetCelebrity'){
      var stylePaiCode = "internetCelebrity"
      var uuid = this.data.internetList[index].uuid;
      wx.navigateTo({
        url: '/pages/stylePai/styleInfo/styleInfo?uuid=' + uuid + '&cityname=' + stylePaiCode
      })
    }else{
      var stylePaiCode= "classicStyle"
      var uuid = this.data.programmerList[index].uuid;
      var styleName = this.data.programmerList[index].styleName
      wx.navigateTo({
        url: '/pages/stylePai/styleInfo/styleInfo?uuid=' + uuid + '&cityname=' + stylePaiCode + '&styleName=' + styleName
      })
    }
  },
  //时尚网红

  //下拉加载风格方案列表
  getStyleProgrammerListUp() {
    let that = this;
    wx.request({
      url: getApp().globalData.resUrl + 'stylePai/listDesignByStylePai',
      method: 'post' || 'get',
      data: {
        "length": 10,
        "start": that.data.programmerList.length,
        "stylePaiCode": "classicStyle",
        "styleUuid": this.data.styleList[this.data.currentIndex].styleUuid || ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        let arr = res.data.data
        if (res.data.retCode == 0) {
          //给数组内的details去除空格
          if (res.data.data.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              arr[i].details = arr[i].details.replace(/(^\s+)|(\s+$)/g, "")
            }
          }
          that.setData({
            programmerList: that.data.programmerList.concat(arr),
            countNum: res.data.countNum
          })
          if (that.data.programmerList.length > 0) {
            that.onChangeHeight();
          }
          if (!that.data.styleList[that.data.currentIndex].styleUuid && that.data.programmerList.length == res.data.countNum) {
            that.setData({
              leadPageFlag: false
            })
          }else{
            that.setData({
              leadPageFlag: true
            })
          }
        }
      }
    })
  }

})