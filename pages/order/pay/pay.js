// pages/order/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkIndex:0,
    orderNum:0,
    price:0,
    flag:false,
    source:0,
    waitRemark:'',
    payType:'好物支付订单',
    otherType:'楼盘支付订单',
    styleType:'风格派支付订单'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options){
      this.setData({
        orderNum: options.orderNum,
        price: options.price,
        totalPrice: options.totalPrice || options.price
      })
      if (options.orderType) {
        this.setData({
          orderType: options.orderType
        })
      }
      if (options.source) {
        this.setData({
          source: options.source
        })
      }
    }
   
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
    if (!this.data.flag){
      var orderNo = this.data.orderNum;
      var str = {
        orderStatus: 0,
        orderNo: orderNo
      }
      this.unLock(orderNo);
      // console.log(str,'str')
      wx.redirectTo({
        url: '/pages/order/orderDetail/orderDetail?orderStatus=' + JSON.stringify(str)
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    setTimeout(function () {
      wx.stopPullDownRefresh();
      that.onLoad();
    }, 1000)
  },
  //监听页面滚动
  onPageScroll: function (ev) {
    //console.log(ev)
    if (ev.scrollTop > 50) {
      wx.setNavigationBarTitle({
        title: '支付订单'
      })
    } else {
      wx.setNavigationBarTitle({
        title: ''
      })
    }
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
  unLock(id){
    //解锁库存
    let that = this;
    getApp().ajax("mall/unLockStock", { orderNo: id}, 'get', function (res) {
      // that.setData({
      //   goodsList: res.data.data
      // })
    })

  },
  //去付款
  goPay:function(){
    let that = this;
    var type = this.data.checkIndex;
    if(type==0){
      var token = wx.getStorageSync('token');
      var timestamp = Date.parse(new Date());
      timestamp = parseInt(timestamp / 1000);
      //生成预支付订单
      var data = {
        orderNo: this.data.orderNum,
        token: token,
        payTypes: 1,
        alreadyAmount:this.data.price,
        appId: "wxb53277d6f003f586"
      }
      var orderNo = this.data.orderNum;
      getApp().ajax("saveOrderInstallment", data, 'POST', function (res) {
        //判断是否是好物或者订单详情进来的
        if (that.data.source == 1 || that.data.orderType == 4){
          //先查看是否有库存
          getApp().ajax("mall/stockHaving", { orderNo: orderNo }, 'get', function (respon) {
            if (respon.data.data.stockHaving == true){
              // console.log('有库存正常走')
              //有库存正常走
              var info = JSON.parse(res.data.resultString);
              wx.requestPayment({
                'timeStamp': info.timestamp.toString(),
                'nonceStr': info.noncestr,
                'package': "prepay_id=" + info.prepayid,
                'signType': 'MD5',
                'paySign': info.sign,
                'success': function (res) {
                  wx.showToast({
                    title: '支付成功!',
                    icon: 'success',
                    duration: 2000
                  })
                  var str = {
                    orderStatus: 1,
                    orderNo: orderNo
                  }
                  wx.redirectTo({
                    url: '/pages/order/orderDetail/orderDetail?orderStatus=' + JSON.stringify(str)
                  })
                },
                'complete': function (res) {
                  // console.log(res)
                  if (res.errMsg == "requestPayment: fail cancel") {
                    wx.showToast({
                      title: '取消支付!',
                      icon: 'none',
                      duration: 2000
                    })
                    wx.redirectTo({
                      url: '/pages/order/payfail/payfail?orderNo=' + orderNo
                    })
                  }
                },
                'fail': function (res) {

                  wx.showToast({
                    title: '支付失败!',
                    icon: 'none',
                    duration: 2000
                  })
                  wx.redirectTo({
                    url: '/pages/order/payfail/payfail?orderNo=' + orderNo
                  })
                }
              })
           }else{
              // console.log('没有库存，查看是否有被锁库存')
              // console.log(respon.data.data)
             //没有库存，查看是否有被锁库存
              if (respon.data.data.stockLockHaving == true){
                wx.showToast({
                  title: '库存已售完，30分钟未付款的清单将释放库存，请稍后再试',
                  icon: 'none',
                  duration: 2000
                })
                // console.log('库存已售完，30分钟未付款的清单将释放库存，请稍后再试')
             }else{
                // console.log('商品已售完')
               
                var str = {
                  orderStatus: 9,
                  orderNo: orderNo
                }
                that.setData({
                  flag:true
                })
                wx.redirectTo({
                  url: '/pages/order/orderDetail/orderDetail?orderStatus=' + JSON.stringify(str)+'&status=0'
                })
               
             }
           }
          })
        }else{
          var info = JSON.parse(res.data.resultString);
          wx.requestPayment({
            'timeStamp': info.timestamp.toString(),
            'nonceStr': info.noncestr,
            'package': "prepay_id=" + info.prepayid,
            'signType': 'MD5',
            'paySign': info.sign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功!',
                icon: 'success',
                duration: 2000
              })
              var str = {
                orderStatus: 1,
                orderNo: orderNo
              }
              wx.redirectTo({
                url: '/pages/order/orderDetail/orderDetail?orderStatus=' + JSON.stringify(str)
              })
            },
            'complete': function (res) {
              // console.log(res)
              if (res.errMsg == "requestPayment: fail cancel") {
                wx.showToast({
                  title: '取消支付!',
                  icon: 'none',
                  duration: 2000
                })
                wx.redirectTo({
                  url: '/pages/order/payfail/payfail?orderNo=' + orderNo
                })
              }
            },
            'fail': function (res) {

              wx.showToast({
                title: '支付失败!',
                icon: 'none',
                duration: 2000
              })
              wx.redirectTo({
                url: '/pages/order/payfail/payfail?orderNo=' + orderNo
              })
            }
          })
        }
       
      })
    }else{
      this.setData({
        flag:true
      })
      var str = {
        orderNo: this.data.orderNum,
        allMoney: parseFloat(this.data.totalPrice),
        alreadyAmount:parseFloat((parseFloat(this.data.totalPrice * 100) - parseFloat(this.data.price*100))/100).toFixed(2),
        orderType: this.data.orderType
      }
      wx.redirectTo({
        url: '/pages/order/muiltPay/muiltPay?str=' + JSON.stringify(str)
      })
    }
  },
  //点击切换付款方式
  changePay:function(e){
    //console.log(e.currentTarget.dataset.index);
    this.setData({
      checkIndex: e.currentTarget.dataset.index
    })
  }
})