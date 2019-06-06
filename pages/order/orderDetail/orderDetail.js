// pages/order/confirm/confirm.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkAgreementFlag: true,
    addressData: {},
    checked: true,
    orderObj:{},
    stateList: ['待付款','已付款','已发货','已签收','退货申请', '退货中', '已退货','取消交易','订单完成','关闭订单','','','','待付款'],
    productList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options){
      if (options.orderStatus){
        this.setData({
          orderObj: JSON.parse(options.orderStatus)
        })
      }
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (this.options) {
      if (this.options.status == 0) {
        wx.showToast({
          title: '商品已售完',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    getApp().ajax("queryGoodsDetail", { orderNo: this.data.orderObj.orderNo }, 'GET', function (res) {
      //console.log(res)
      var list = res.data.orderDetailList;
      for(var i=0;i<list.length;i++){
        for (var j = 0; j < list[i].orderDetails.length;j++){
          var img = list[i].orderDetails[j].imageUrl;
          if(img.indexOf(',')>-1){
            var arr=img.split(',');
            list[i].orderDetails[j].goodsImages = arr[0];
            list[i].orderDetails[j].goodsImagesArr=arr;
          }else{
            list[i].orderDetails[j].goodsImages = img;
            list[i].orderDetails[j].goodsImagesArr = [img];
          }
        }
      }
      that.setData({
        addressData: res.data.goodsOrders,
        orderObj:{
          orderNo: res.data.goodsOrders.orderNo,
          orderStatus: res.data.goodsOrders.orderStatus,
          orderType: res.data.goodsOrders.orderType,
          waitRemark: res.data.goodsOrders.waitRemark
        },
        productList: list
      })
    })
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
  //监听页面滚动
  onPageScroll: function (ev) {
    //console.log(ev)
    if (ev.scrollTop > 50) {
      wx.setNavigationBarTitle({
        title: '订单详情'
      })
    } else {
      wx.setNavigationBarTitle({
        title: ''
      })
    }
  },
  //去付款
  goPay() {
    let that = this;
    var obj = this.data.addressData;
    //构建数据
    if (!this.data.checkAgreementFlag) {
      wx.showToast({
        title: '请先阅读并同意《购买协议》!',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var price = obj.remainAmount;
    console.log(price,'price')
    console.log(obj.actualAmount, 'totalPrice')
    wx.redirectTo({
      url: '/pages/order/pay/pay?orderNum=' + obj.orderNo + '&price=' + price + '&totalPrice=' + obj.actualAmount + '&orderType=' + obj.orderType
      })
  },

  //改变状态
  changeCheck: function () {
    this.setData({
      checked: !this.data.checked
    })
  },
  //跳转
  goArticle: function () {
    var url = 'https://m.wojiali.cn/file/agreement/index.html';
    wx.redirectTo({
      url: '/pages/programme/showThree/showThree?url=' + url
    })
  },
  //勾选协议
  checkAgreement: function () {
    this.setData({
      checkAgreementFlag: !this.data.checkAgreementFlag
    })
  },
  //复制
  copyNum:function(){
    var that=this;
    wx.setClipboardData({
      data: that.data.orderObj.orderNo,
      success: function (res) {
        wx.showToast({
          title: '复制成功！',
          icon: 'none',
          duration: 2000
        })
      },
      fail:function(e){
        wx.showToast({
          title: '复制失败！',
          icon: 'none',
          duration: 2000
        })
        console.log(e)
      }
    })
  },
  //确认收货
  confirm(e) {
    let that = this;
    let data = {
      orderNo: this.data.orderObj.orderNo,
      orderStatus: 8
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
  //取消订单
  cancelOrder:function(){
    var that=this;
    var obj=this.data.addressData;
    wx.showModal({
      title: '提示',
      content: '是否确定要取消订单？',
      success(res) {
        if (res.confirm) {
          getApp().ajax("cancelOrder", { orderNo: obj.orderNo }, 'POST', function (res) {
            wx.showToast({
              title: '订单已取消！',
              icon: 'success',
              duration: 2000,
              success(){
                that.onShow();
              }
            })
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消操作！',
            icon: 'success',
            duration: 2000,
          })
        }
      }
    })
  },
  //查看商品详情
  lookInfo:function(e){
    wx.setStorageSync('orderProduct', JSON.stringify(this.data.productList));
    var index = e.currentTarget.dataset.index;
    var childindex = e.currentTarget.dataset.childindex;
    wx.redirectTo({
      url: '/pages/order/productDetail/productDetail?index=' + index + '&childindex=' + childindex
    })
  }
})