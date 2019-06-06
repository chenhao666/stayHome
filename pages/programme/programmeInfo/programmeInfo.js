// pages/programme/programmeInfo/programmeInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    programmeList:[],//方案列表
    programmeIndex:0,//方案下标
    locationList: [],//位置列表
    styleList:[],
    current:0,//初始值
    locationIndex:0,//位置下标
    changeHeight:0,
    interval: 5000,
    duration: 1000,
    houseId:0,
    intoView:'',
    city:'',
    houseModel:'',
    styleName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.cityname){
      this.setData({
        city: options.cityname
      })
    }
    if (options.houseId) {
      this.setData({
        houseId: options.houseId
      })
    }
   
    if (options.styleName) {
      this.setData({
        styleName: options.styleName
      })
    }
    if (options.houseModel) {
      this.setData({
        houseModel: options.houseModel
      })
    }
    let data = { "city": that.data.city, "houseId": that.data.houseId, "houseModel": that.data.houseModel, "styleName": that.data.styleName }
    if (options.typeInfo) {
      data.typeInfo = this.options.typeInfo
    }
    getApp().ajax("queryHouseDesignList",data , 'POST', function (res) {
      //console.log(res);
      that.setData({
        programmeList: res.data.data
      });
      //重置高度
      that.changePrograme(0);

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
    if (ev.scrollTop>50){
      wx.setNavigationBarTitle({
        title: this.data.programmeList[this.data.programmeIndex].designName
      })
    }else{
      wx.setNavigationBarTitle({
        title:''
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
      that.setData({
        "changeHeight": res[0].height+40
      })
    })
  },
 
  //联系客服
  connectCustomer:function(e){
    var url = '/pages/chat/chat';
    getApp().checkToken(url, function (flag) {
      if (flag) {
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
      }
    })
  },
  //联系设计师
  connectDesigner: function (e) {
    var url = '/pages/chat/chat';
    getApp().checkToken(url, function (flag) {
      if (flag) {
        getApp().ajax("querydesignAuth", { token: wx.getStorageSync('token') }, 'POST', function (res) {
          if (res.data.isDesignAuth){
            wx.navigateTo({
              url: '/pages/chat/confirmDesign/confirmDesign'
            })
          }else{
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
  changePrograme:function(index){
    var list = this.data.programmeList[index].templates || [];
    /*if (list.length > 0) {
      var arr = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].areaTypeName) {
          arr.push(list[i]);
        } else {
          if (arr.length > 0) {
            if (arr[i - 1].others) {
              arr[i - 1].others.push(list[i]);
            } else {
              arr[i - 1].others = [list[i]];
            }
          } else {
            wx.showToast({
              title: '位置信息格式有误！',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    }else{
      var arr = [];
    }*/
    this.setData({
      programmeIndex: index,
      locationList: list,
      styleList: this.data.programmeList[index].styleList
    })
    if(list.length>0){
      this.OnChangeHeight();
    }
  },
  //改变滑块
  changeLocation:function(e){
    //console.log(e.detail.current)
    this.setData({
      locationIndex: e.detail.current
    })
    this.setData({
      intoView: 'num_' + this.data.locationList[this.data.locationIndex].typeOrder
    })
    this.OnChangeHeight();
  },
  //点击改变滑块
  changeTapLocation:function(e){
    //console.log(e.target.dataset.index)
    this.setData({
      current: e.currentTarget.dataset.index,
      locationIndex: e.currentTarget.dataset.index
    })
    this.OnChangeHeight();
  },
  //改变方案
  changeTabProgramme:function(e){
    //console.log(e.currentTarget.dataset.index)
    this.setData({
      programmeIndex: e.currentTarget.dataset.index,
      current:0,
      locationIndex:0
    })
    this.changePrograme(e.currentTarget.dataset.index);
  },
  //改变风格
  changeTapStyle:function(e){
    //console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    //console.log(this.data.styleList[index])
    wx.redirectTo({
      url: '/pages/programme/programmeInfo/programmeInfo?houseId=' + this.options.houseId + '&cityname=' + this.options.cityname + '&houseModel=' + this.options.houseModel + '&styleName=' + this.data.styleList[index].styleName
    })
  },
  //跳转3d图
  goThreeD:function(e){
    var that=this;
    var designId = this.data.programmeList[this.data.programmeIndex].designId;
    getApp().ajax("addThreeDulClickNum", { designId: designId }, 'GET', function (res) {
      wx.navigateTo({
        url: '/pages/programme/showThree/showThree?url=' + that.data.programmeList[that.data.programmeIndex].threeDurl
      })
    })
  },
  //跳转商品列表
  goProductList:function(){
    wx.navigateTo({
      url: '/pages/order/productList/productList?designId=' + this.data.programmeList[this.data.programmeIndex].designId
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
    return {
      title: list[index].styleName + '-' + list[index].designName,
      desc: list[index].details,
      imageUrl: list[index].coverPic,
      path: "/pages/programme/showThree/showThree?url=" + list[index].threeDurl
    }
  }
})