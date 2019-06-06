// pages/order/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[], //订单列表
    imageUrlList:[],
    notMessage: true,
    height1: wx.getSystemInfoSync().windowWidth / 750 * 64,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    // this.getData();
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  onPageScroll: function (e) {
    if (e) {
      if (e.scrollTop >= this.data.height1) {
        wx.setNavigationBarTitle({
          title: '我的订单'
        })
      } else {
        wx.setNavigationBarTitle({
          title: ''
        })
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onPullDownRefresh: function () {
    var that = this;
    setTimeout(function () {
      wx.stopPullDownRefresh();
      that.onLoad(that.options);
    }, 1000)
  },
  //获取列表数据
  getData(){
    let that = this;
    if (wx.getStorageSync('token')){
      getApp().ajax("queryGoodsOrder", { token: wx.getStorageSync('token') }, 'post', function (res) {
        var list = res.data.ordersList;
        //修改时间的格式
        for (let i = 0; i < list.length; i++) {
          var arr = list[i].createTime.split(':');
          list[i].createTime = arr[0] + ':' + arr[1];
        }
        that.setData({
          orderList: list
        })

        if (res.data.ordersList.length == 0) {
          // 控制无信息时的状态
          that.data.notMessage = true;
        } else {
          that.data.notMessage = false;
        }
        that.setData({
          orderList: that.data.orderList,
          notMessage: that.data.notMessage
        })
      })
    }
  },
  confirm(e){
    let that =this;
    let data = {
      orderNo: e.currentTarget.dataset.id,
      orderStatus:8
    }
    wx.showModal({
      title: '提示',
      content: '是否确认收货？',
      success(res) {
        if (res.confirm) {
          getApp().ajax("updateGoodsOrder", data, 'post', function (res) {
            wx.showToast({
              title: '收货成功',
              icon: 'success',
              duration: 2000
            })
            that.getData();
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goPay(e){
    let index = e.currentTarget.dataset.index;
    let orderList = this.data.orderList[index];
    // console.log(orderList)
    // console.log(orderList.orderType)
    if (orderList.orderType == 4){
      //好物
      getApp().ajax("checkGoodsOrderIsTimeout", { orderNo: orderList.orderNo }, 'get', function (res) {
        if (res.data.retCode == 0) {
          //好物
          wx.navigateTo({
            url: '/pages/order/pay/pay?orderNum=' + orderList.orderNo + '&price=' + orderList.remainAmount + '&totalPrice=' + orderList.actualAmount + '&orderType=' + orderList.orderType
          })
        } else {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/order/pay/pay?orderNum=' + orderList.orderNo + '&price=' + orderList.remainAmount + '&totalPrice=' + orderList.actualAmount + '&orderType=' + orderList.orderType
      })
    }
  },
  showDetail(e){
    console.log(e)
    let that = this;
    let orderNo = e.currentTarget.dataset.id;
    // let orderType = e.currentTarget.dataset.orderType
    if (e.currentTarget.dataset.type == 1){
      //老订单
      wx.navigateTo({
        url: '/pages/order/oldOrderDetail/oldOrderDetail?orderNo=' + orderNo + '&token=' + wx.getStorageSync('token')
      })
    } else if (e.currentTarget.dataset.type == 0){
      //新订单
      that.data.prudectData = JSON.stringify(that.data.orderList[e.currentTarget.dataset.index])
      wx.navigateTo({
        url: '/pages/order/orderDetail/orderDetail?orderStatus=' + that.data.prudectData
      })
    }else{
      
    }
  }

})