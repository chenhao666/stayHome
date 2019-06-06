// pages/order/confirm/confirm.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkAgreementFlag:true,
    addressFlag:false,
    addressData: {},
    addressArr: [],
    defaultAddress: 0,
    notMessage: false,
    maskHidden: true,
    checked: true,
    getArr: [],
    requireData: {
      allMoney: 0
    },
    totalData: {},
    enterType:2
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let that = this;
    that.data.addressData = {}
    //接收订单列表传过来的信息
    if (that.options.list) {
      //带到f页面的列表数据
      that.data.totalData = JSON.parse(that.options.list);
      //解析接受到的数据
      let list = JSON.parse(that.options.list);
      let productList = list.productList.concat([]);
      var typeNameList = [{ typeName: productList[0].typeName, goodsList: [productList[0]]}];
      //console.log(productList)
      //重组数据
      for (var i = 1; i < productList.length;i++){
        var flag=0;
        for (var j = 0; j < typeNameList.length;j++){
          if (productList[i].typeName == typeNameList[j].typeName){
            typeNameList[j].goodsList.push(productList[i])
            flag=1;
          }
        }
        if(!flag){
          typeNameList.push({ typeName: productList[i].typeName, goodsList: [productList[i]] })
        }
      }
      delete list.productList;
      //console.log(typeNameList)
      list.typeNameList = typeNameList.concat([]);
      //更新数据
      that.setData({
        requireData: list
      })
    }

    //接受地址信息
    if (that.options.obj) {
      let aa = JSON.parse(that.options.obj);
      that.setData({
        addressData: aa,
        defaultAddress: 1,
        addressFlag:true
      })
      
    } else {
      that.getData();
    }
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
  //监听页面滚动
  onPageScroll:function(ev){
    //console.log(ev)
    if (ev.scrollTop > 50) {
      wx.setNavigationBarTitle({
        title: '确认订单'
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
  // 跳转到选择地址页面
  selectAddress:function(){
    let that = this;
    let total =JSON.stringify(that.data.totalData)
    //正常的订单source为0
    wx.redirectTo({
      url: '/pages/order/selectAddress/selectAddress?optionsData=' + total +'&enterType=2'+'&source=0'
    })
  },
 
  //获取默认地址信息
  getData: function (res) {
    var that = this;
    that.data.addressArr = []
    that.data.addressData={}
    wx.getStorage({
      key: 'token',
      success: function(res) {
        let data = {
          token: res.data,
          enterType: that.data.enterType
        }
        if (that.data.orderType) {
          data.orderType = that.data.orderType
        }
        getApp().ajax("queryShippingAddress", data, 'post', function (res) {
      
          if (res.data.addressList.length == 0) {
            // 控制无信息时的状态
            that.data.notMessage = true;
          } else {
            that.data.notMessage = false;
          }
          if (res.data.addressList[0]){
            that.setData({
              addressData: res.data.addressList[0],
              addressFlag:true
            })
          }
          //设置默认地址
          that.setData({
            defaultAddress: res.data.addressList.length
          })
    
        })
      },
    })
   
  },
  //去付款
  goPay() {
    let that = this;
    //构建数据
    if (that.data.addressData.linkman !== undefined){
      if (!this.data.checkAgreementFlag){
        wx.showToast({
          title: '请先阅读并同意《购买协议》!',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      let data = that.data.requireData;
      data.shipID = this.data.addressData.shipID;
      let token = wx.getStorageSync('token');
      data.token = token;
      //console.log(that.data.addressData)
      getApp().ajax("generateOnlineOrder", data, 'post', function (res) {
        wx.redirectTo({
          url: '/pages/order/pay/pay?orderNum=' + res.data.orderNo + '&price=' + data.totalPrice
        })
      })
    }else{
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1000
      })
    }
  
  },

  //多次支付
  goMuiltPay:function(){
    let that = this;
    let data = {
      brandName: "",
      designId: "",
      shipID: 0,
      packageList: [],
      styleName: "",
      totalPrice: 0,
      token: ""
    }
    let arrays = [];
    let ids = [];
    let types = [];
    // let str=[];
    data.brandName = that.data.requireData.brandName;
    data.designId = that.data.requireData.programmeId;
    data.shipID = that.data.addressData.shipID;
    data.styleName = that.data.requireData.styleName;
    data.totalPrice = Number(that.data.requireData.discountMoney);
    data.token = wx.getStorageSync('token');
    var str = JSON.stringify(that.data.getArr)
    var str1 = str.replace(/\"goodsCode\"/g, '"brandGoodId"')
    var str2 = str1.replace(/\"goodsNum\"/g, '"number"')
    var str3 = JSON.parse(str2)
    for (let i = 0; i < str3.length; i++) {

      ids.push(str3[i][0].roomId);
      data.packageList.push({
        goodsList: str3[i],
        roomId: ids[i]
      })

    }
    //console.log(data)
    for (var i = 0; i < data.packageList.length; i++) {
      for (var j = 0; j < data.packageList[i].goodsList.length; j++) {
        data.packageList[i].packageId = data.packageList[i].goodsList[0].packageId;
        if (data.packageList[i].goodsList[j].childList) {
          for (var x = 0; x < data.packageList[i].goodsList[j].childList.length; x++) {
            if (!data.packageList[i].goodsList[j].groupList) {
              data.packageList[i].goodsList[j].groupList = [];
            }
            data.packageList[i].goodsList[j].groupList.push(data.packageList[i].goodsList[j].childList[x][0].id);
          }
        }
      }
    }
    var token = wx.getStorageSync('token');
    //console.log(that.data.addressData)
    if (that.options.designType) {
      data.designType = that.options.designType
    }
    //调取付款接口
    getApp().ajax("toGenerateOrdersV3", data, 'post', function (res) {
      //console.log(res)
      //设置默认地址
      //var rand = that.generateMixed(32);
      //console.log(rand)
      if (res.data.retCode === 0) {
        var orderNo = res.data.orderNo;
        var str={
          orderNo: orderNo,
          allMoney: that.data.requireData.discountMoney,
          alreadyAmount:0
        }
        wx.redirectTo({
          url: '/pages/order/muiltPay/muiltPay?str=' + JSON.stringify(str)
        })
      }
    })
  },
  //改变状态
  changeCheck:function(){
    this.setData({
      checked: !this.data.checked
    })
  },
  //跳转
  goArticle:function(){
    var url ='https://m.wojiali.cn/file/agreement/index.html';
    wx.redirectTo({
      url: '/pages/programme/showThree/showThree?url=' + url
    })
  },
  //获取32位数据字符串
  /*generateMixed:function(n) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for(var i = 0; i<n; i++) {
      var id = Math.ceil(Math.random() * 35);
        res += chars[id];
      }
    return res;
  }*/
  //勾选协议
  checkAgreement:function(){
    this.setData({
      checkAgreementFlag:!this.data.checkAgreementFlag
    })
  }
})