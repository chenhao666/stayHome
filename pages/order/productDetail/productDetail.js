// pages/order/productDetail/productDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: 5000,
    duration: 1000,
    current:0,
    nowObj:{},
    maskFlag: true,
    changeOthersFlag: true,
    changeFlag: true,
    lookFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = parseInt(options.index);
    var childindex = parseInt(options.childindex);
    if (wx.getStorageSync('orderProduct')){
      var list = JSON.parse(wx.getStorageSync('orderProduct'));
      var newObj = list[index].orderDetails[childindex];
      if (newObj.brand){
        newObj.brandName=newObj.brand;
      }
      if (newObj.name) {
        newObj.goodsName = newObj.name;
      }
      this.setData({
        nowObj: newObj
      })
      //清除缓存
      wx.removeStorageSync('orderProduct');
    }else{
      if (wx.getStorageSync('productData')) {
        this.setData(JSON.parse(wx.getStorageSync('productData')));
      }
      var list = this.data.locationList.concat([]);
      this.setData({
        nowObj: list[this.data.locationIndex].goodsTypeList[index].goodsInfos[childindex]
      })
    }
    //console.log(this.data.nowObj)
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
    this.setData({
      maskFlag: true,
      changeOthersFlag: true,
      changeFlag: true,
      lookFlag: true
    })
    wx.setStorageSync('productData', JSON.stringify(this.data));
    wx.setStorageSync('productChange', true);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh();
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
  changeCurrent:function(e){
    this.setData({
      current: e.detail.current
    })
  },
  //修改商品属性
  changeAttr:function(){
    var oldObj = this.data.nowObj;
    var code = oldObj.id;
    var that = this;
    var arr = [0, 0, 0];
    if(code){
      //获取信息
      getApp().ajax("queryInfomationByCode", { id: code }, 'GET', function (res) {
        if (!res.data.goodsInfomation) {
          wx.showToast({
            title: '获取商品信息失败！',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        var obj = res.data.goodsInfomation;
        if (!oldObj.initPrice) {
          oldObj.initPrice = oldObj.unitPrice;
        }
        oldObj.specificaList = obj.specificaList;
        oldObj.colorList = obj.colorList;
        oldObj.materialList = obj.materialList;
        for (var i = 0; i < oldObj.specificaList.length; i++) {
          if (oldObj.specificaList[i].specifications == oldObj.specifications) {
            arr[0] = i;
          }
        }
        for (var i = 0; i < oldObj.colorList.length; i++) {
          if (oldObj.colorList[i].goodsColor == oldObj.goodsColor) {
            arr[1] = i;
          }
        }
        for (var i = 0; i < oldObj.materialList.length; i++) {
          if (oldObj.materialList[i].material == oldObj.material) {
            arr[2] = i;
          }
        }
        that.setData({
          othersObj: oldObj,
          others: arr,
          changeOthersFlag: false,
          maskFlag: false
        })
      });
    }else{
      oldObj.brandName = oldObj.brand;
      if (!oldObj.initPrice) {
        oldObj.initPrice = oldObj.unitPrice;
      }
      oldObj.specificaList = [{ specifications: oldObj.specifications, retailPremium:0}];
      oldObj.colorList = [{ goodsColor: oldObj.goodsColor, retailPremium: 0}];
      oldObj.materialList = [{ material: oldObj.material, retailPremium: 0}];
      that.setData({
        othersObj: oldObj,
        others: arr,
        changeOthersFlag: false,
        maskFlag: false
      })
    } 
  },
  //关闭遮罩
  closeMask: function () {
    this.setData({
      maskFlag: true,
      changeOthersFlag: true,
      changeFlag: true,
      lookFlag:true
    })
  },
  //选择规格颜色材质
  changeSelectTap: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var otherIndex = parseInt(e.currentTarget.dataset.otherindex);
    var arr = this.data.others.concat([]);
    arr[otherIndex] = index;
    //计算价格
    var obj = this.data.othersObj;
    var price = obj.initPrice;
    if (arr[0] != 0) {
      if (obj.specificaList[arr[0]].retailPremium > obj.specificaList[0].retailPremium) {
        price += obj.specificaList[arr[0]].retailPremium - obj.specificaList[0].retailPremium;
      } else {
        price -= obj.specificaList[0].retailPremium - obj.specificaList[arr[0]].retailPremium;
      }
    }
    if (arr[1] != 0) {
      if (obj.colorList[arr[1]].retailPremium > obj.colorList[0].retailPremium) {
        price += obj.colorList[arr[1]].retailPremium - obj.colorList[0].retailPremium;
      } else {
        price -= obj.colorList[0].retailPremium - obj.colorList[arr[1]].retailPremium;
      }
    }
    if (arr[2] != 0) {
      if (obj.materialList[arr[2]].retailPremium > obj.materialList[0].retailPremium) {
        price += obj.materialList[arr[2]].retailPremium - obj.materialList[0].retailPremium;
      } else {
        price -= obj.materialList[0].retailPremium - obj.materialList[arr[2]].retailPremium;
      }
    }
    obj.unitPrice = price;
    obj.specifications = obj.specificaList[arr[0]].specifications
    obj.material = obj.materialList[arr[2]].material
    obj.goodsColor = obj.colorList[arr[1]].goodsColor
    this.setData({
      others: arr.concat([]),
      othersObj: obj
    })
  },
  //重置属性
  // resetSelect: function () {
  //   var obj = this.data.othersObj;
  //   obj.specifications = obj.specificaList[0].specifications;
  //   obj.material = obj.materialList[0].material;
  //   obj.goodsColor = obj.colorList[0].goodsColor;
  //   obj.unitPrice = obj.initPrice;
  //   this.setData({
  //     others: [0, 0, 0],
  //     othersObj: obj
  //   })
  // },
  //提交属性修改
  commitSelect: function () {
    var list = this.data.locationList.concat([]);
    list[this.data.locationIndex].goodsTypeList[this.options.index].goodsInfos[this.options.childindex] = this.data.othersObj
    this.setData({
      locationList: list.concat(),
      nowObj: this.data.othersObj,
      maskFlag: true,
      changeOthersFlag: true
    })
  },
  //查看详情
  lookInfo:function(){
    this.setData({
      maskFlag: false,
      lookFlag: false
    })
  }
})