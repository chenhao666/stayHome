// pages/order/muiltPay/muiltPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:'',
    alreadyAmount:0,
    allMoney:0,
    needPay:0,
    payNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.str)
    var str = JSON.parse(options.str)
    this.setData({
      orderNo: str.orderNo,
      allMoney: str.allMoney,
      alreadyAmount: str.alreadyAmount,
      needPay: (parseFloat(str.allMoney) - parseFloat(str.alreadyAmount)).toFixed(2),
      orderType: str.orderType
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
    this.unLock(this.data.orderNo);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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
  unLock(id) {
    //解锁库存
    let that = this;
    getApp().ajax("mall/unLockStock", { orderNo: id }, 'get', function (res) {
      // that.setData({
      //   goodsList: res.data.data
      // })
    })

  },
  //监听输入
  bindKeyInput:function(e){
    if (parseFloat(e.detail.value) != e.detail.value){
      this.setData({
        payNum:0
      })
      return 0;
    }
    if (parseFloat(e.detail.value) > parseFloat(this.data.needPay)){
      this.setData({
        payNum: parseFloat(this.data.needPay)
      })
      return parseFloat(this.data.needPay);
    }
    this.setData({
      payNum: e.detail.value
    })
  },
  goPay:function(){
    var that = this;
    if (that.data.payNum==''){
      wx.showToast({
        title: '支付金额不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (parseInt(that.data.payNum) < 5000) {
      wx.showToast({
        title: '单笔支付金额不可小于5000',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var token = wx.getStorageSync('token');
    var timestamp = Date.parse(new Date());
    timestamp = parseInt(timestamp / 1000);
    //生成预支付订单
    var data = {
      orderNo: that.data.orderNo,
      token: token,
      alreadyAmount:that.data.payNum.toString(),
      payTypes: 1,
      appId: "wxb53277d6f003f586"
    }
    var orderNo = that.data.orderNo;
    getApp().ajax("saveOrderInstallment", data, 'POST', function (res) {
      //判断是否是好物或者订单详情进来的
      if (that.data.orderType == 4) {
        //先查看是否有库存
        getApp().ajax("mall/stockHaving", { orderNo: orderNo }, 'get', function (respon) {
          if (respon.data.data.stockHaving == true) {
            //有库存正常走
            //console.log(res);
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

                if (res.errMsg == "requestPayment:cancel") {
                  wx.showToast({
                    title: '支付失败!',
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
          } else {
            // console.log('没有库存，查看是否有被锁库存')
            // console.log(respon.data.data)
            //没有库存，查看是否有被锁库存
            if (respon.data.data.stockLockHaving == true) {
              wx.showToast({
                title: '库存已售完，30分钟未付款的清单将释放库存，请稍后再试',
                icon: 'none',
                duration: 2000
              })
              // console.log('库存已售完，30分钟未付款的清单将释放库存，请稍后再试')
            } else {
              // console.log('商品已售完')

              var str = {
                orderStatus: 9,
                orderNo: orderNo
              }
              wx.redirectTo({
                url: '/pages/order/orderDetail/orderDetail?orderStatus=' + JSON.stringify(str) + '&status=0'
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

            if (res.errMsg == "requestPayment:cancel") {
              wx.showToast({
                title: '支付失败!',
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
  }
})