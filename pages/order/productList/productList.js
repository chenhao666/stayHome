// pages/order/productList/productList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    locationList: [],//位置列表
    locationIndex:0,//位置索引
    animationData:{},//动画对象
    announcementText:'',//动画文本
    changeFlag: true,//替换页面开关
    changeList: [],//
    changeIndex:'',//替换商品下标记录
    //遮罩层开关
    maskFlag: true,
    totalNum:0,//总数
    totalPrice:0,//总价
    checkAll:false,//全选
    changeOthersIndex:'',//记录更换颜色下标
    changeOthersFlag:true,
    othersObj:'',//存储初始对象
    others:[0,0,0],//下标数组
    flexFlag:false,//浮动开关
    flexHeight: wx.getSystemInfoSync().windowWidth / 750 * 194,
    leadPage:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //滚动动画
    var animation=wx.createAnimation({
      duration:30000,
      timingFunction:'linear'
    })
    animation.translate(-Number(this.data.announcementText.length * 12)-300, 0).step();
    this.setData({
      animationData: animation.export()
    });
    // 循环播放动画关键步骤（使用两个定时器）
    this.recoveraAnimation = setInterval(function () {
      //将字幕恢复到字幕开始点（为屏幕右边）
      animation.translate(0, 0).step({ duration: 0 });
      this.setData({
        animationData: animation.export()
      });
      //开始动画
      animation.translate(-Number(this.data.announcementText.length * 12) - 300, 0).step();
      this.setData({
        animationData: animation.export()
      });
    }.bind(this), 32000);
   
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //清除定时器
    clearInterval(this.recoveraAnimation);
    clearInterval(this.restartAnimation);
    //缓存选中信息
    var info={
      designId: this.options.designId,
      checked:''
    }
    var list = this.data.locationList.concat([]);
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].goodsTypeList.length; j++) {
        for (var x = 0; x < list[i].goodsTypeList[j].goodsInfos.length; x++) {
          var obj = list[i].goodsTypeList[j].goodsInfos[x];
          if (obj.checked) {
            if (info.checked){
              info.checked += ',' + obj.id;
            }else{
              info.checked = obj.id;
            }
          }
        }
      }
    }
    wx.setStorageSync('productCheckObj', JSON.stringify(info));
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //判断用户是否是第一次进入本页面
    if (wx.getStorageSync('leadIndex')){
      this.setData({
        leadPage: false
      })
    }else{
      this.setData({
        leadPage: true
      })
      wx.setStorageSync("leadIndex", 1);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //清除定时器
    clearInterval(this.recoveraAnimation);
    clearInterval(this.restartAnimation);
    //缓存选中信息
    var info = {
      designId: this.options.designId,
      checked: ''
    }
    var list = this.data.locationList.concat([]);
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].goodsTypeList.length; j++) {
        for (var x = 0; x < list[i].goodsTypeList[j].goodsInfos.length; x++) {
          var obj = list[i].goodsTypeList[j].goodsInfos[x];
          if (obj.checked) {
            if (info.checked) {
              info.checked += ',' + obj.id;
            } else {
              info.checked = obj.id;
            }
          }
        }
      }
    }
    wx.setStorageSync('productCheckObj', JSON.stringify(info));
  },
  closeImage(){
    this.setData({
      leadPage: false
    })
  },
  //监听页面滚动
  onPageScroll: function (ev) {
    //console.log(ev)
    if (ev.scrollTop > 50) {
      wx.setNavigationBarTitle({
        title: '商品列表'
      })
    } else {
      wx.setNavigationBarTitle({
        title: ''
      })
    }
    //空间浮动
    if (ev.scrollTop > this.data.flexHeight) {
      this.setData({
        flexFlag: true
      })
    } else {
      this.setData({
        flexFlag: false
      })
    }
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
  messageCustorm(){
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
  //获取数据
  getData:function(){
    var that = this;
    if (wx.getStorageSync('productChange')) {
      this.setData(JSON.parse(wx.getStorageSync('productData')));
      wx.setStorageSync('productChange', false);
    } else {
      //获取商品列表
      getApp().ajax("queryDesignGoodsList", { designId: this.options.designId }, 'GET', function (res) {
        //console.log(res);
        var list = res.data.goodsInfoList.concat([]);
        for (var i = 0; i < list.length; i++) {
          for (var j = 0; j < list[i].goodsTypeList.length; j++) {
            for (var x = 0; x < list[i].goodsTypeList[j].goodsInfos.length; x++) {
              var obj = list[i].goodsTypeList[j].goodsInfos[x];
              //判断是否存在缓存
              if (wx.getStorageSync('productCheckObj')) {
                var checkStr = String(JSON.parse(wx.getStorageSync('productCheckObj')).checked);
                if (checkStr) {
                  if (checkStr.indexOf(obj.id) > -1) {
                    list[i].goodsTypeList[j].goodsInfos[x].checked = true;
                  }
                }
              }
              if (obj.goodsImages.indexOf(',') > -1) {
                obj.goodsImagesArr = obj.goodsImages.split(',');
                obj.goodsImages = obj.goodsImagesArr[0];
              } else {
                obj.goodsImagesArr = [obj.goodsImages];
              }
              if (obj.goodsColor.indexOf(',') > -1) {
                obj.goodsColorArr = obj.goodsColor.split(',');
                obj.goodsColor = obj.goodsColorArr[0];
              }
              if (obj.material.indexOf(',') > -1) {
                obj.materialArr = obj.material.split(',');
                obj.material = obj.materialArr[0];
              }
              if (obj.specifications.indexOf(',') > -1) {
                obj.specificationsArr = obj.specifications.split(',');
                obj.specifications = obj.specificationsArr[0];
              }
              if (obj.isCheck){
                obj.checked=true;
              }
              list[i].goodsTypeList[j].goodsInfos[x] = obj;
            }
          }
        }
        that.setData({
          locationList: list
        })
        that.compute();
      })
    }
  },
  //跳转订单
  goOrder:function(e){
    var that=this;
    var productList = [];
    var list = that.data.locationList.concat([]);
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].goodsTypeList.length; j++) {
        for (var x = 0; x < list[i].goodsTypeList[j].goodsInfos.length; x++) {
          if (list[i].goodsTypeList[j].goodsInfos[x].checked) {
            list[i].goodsTypeList[j].goodsInfos[x].typeName = list[i].typeName;
            productList.push(list[i].goodsTypeList[j].goodsInfos[x]);
          }
        }
      }
    }
    var info = {
      productList: productList,
      totalPrice: that.data.totalPrice,
      totalNum: that.data.totalNum,
      designId: that.options.designId
    }
    //console.log(that.data.programmeId)
    if (parseFloat(that.data.totalPrice) == 0) {
      wx.showToast({
        title: '您还没有选择商品',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var url = '/pages/order/confirm/confirm?list=' + JSON.stringify(info);
    getApp().checkToken(url,function(res){
      if (res){
        wx.navigateTo({
          url: url
        })
      }
    })
  },
  //查看详情
  showDetail:function(e){
    wx.setStorageSync('productData',JSON.stringify(this.data));
    var index = e.currentTarget.dataset.index;
    var childindex = e.currentTarget.dataset.childindex;
    wx.navigateTo({
      url: '/pages/order/productDetail/productDetail?index=' + index + '&childindex=' + childindex
    })
  },
  //选中商品
  checkProduct:function(e){
    //console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var childindex = e.currentTarget.dataset.childindex;
    var list = this.data.locationList.concat([]);
    var checked=list[this.data.locationIndex].goodsTypeList[index].goodsInfos[childindex].checked || false;
    var productId=list[this.data.locationIndex].goodsTypeList[index].goodsInfos[childindex].id;
    list[this.data.locationIndex].goodsTypeList[index].goodsInfos[childindex].checked = !checked;
  //渲染
    this.setData({
      locationList: list.concat([])
    })
    //计算
    this.compute();
  },
  //更换商品
  changeProduct:function(e){
    //console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var childindex = e.currentTarget.dataset.childindex;
    var list = this.data.locationList[this.data.locationIndex].goodsTypeList[index].goodsInfos[childindex].replaceInfo;
    for(var i=0;i<list.length;i++){
      if (list[i].goodsImages.indexOf(',') > -1) {
        var arr = list[i].goodsImages.split(',');
        list[i].goodsImages = arr[0];
        list[i].goodsImagesArr = arr;
      } else {
        list[i].goodsImagesArr = [list[i].goodsImages];
      }
    }
    this.setData({
      changeList:list,
      maskFlag:false,
      changeIndex: index + ',' + childindex,
      changeFlag:false
    });
    //console.log(list)
  },
  //点击change
  changeTap:function(e){
    //console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var list = this.data.changeList.concat([]);
    for(var i=0;i<list.length;i++){
      list[i].checked=false;
    }
    list[index].checked = !list[index].checked;
    this.setData({
      changeList: list.concat([])
    })
  },
  //重置
  resetChange:function(e){
    var list = this.data.changeList.concat([]);
    for (var i = 0; i < list.length; i++) {
      list[i].checked = false;
    }
    this.setData({
      changeList: list.concat([])
    })
  },
  //关闭遮罩
  closeMask:function(){
    this.setData({
      maskFlag:true,
      changeOthersFlag:true,
      changeFlag:true
    })
  },
  //替换商品提交
  changeTapCommit:function(){
    var changeIndex = this.data.changeIndex;
    var list=this.data.changeList.concat([]);
    var arr = changeIndex.split(',');
    var locationList = this.data.locationList.concat([]);
    var obj = locationList[this.data.locationIndex].goodsTypeList[arr[0]].goodsInfos[arr[1]];
    //标记
    var delIndex=-1;
    for (var i = 0; i < list.length;i++){
      if(list[i].checked){
        delIndex=i;
      }
    }
    if (delIndex==-1){
      this.setData({
        maskFlag: true,
        changeOthersFlag: true,
        changeFlag: true
      })
    }else{
      var newObj = list[delIndex];
      newObj.checked = obj.checked;
      //console.log(delIndex)
      list.splice(delIndex,1);
      //console.log(list)
      obj.checked=false;
      list.push(obj);
      newObj.replaceInfo = list;
     
      if (newObj.goodsColor.indexOf(',') > -1) {
        newObj.goodsColorArr = newObj.goodsColor.split(',');
        newObj.goodsColor = newObj.goodsColorArr[0];
      }
      if (newObj.material.indexOf(',') > -1) {
        newObj.materialArr = newObj.material.split(',');
        newObj.material = newObj.materialArr[0];
      }
      if (newObj.specifications.indexOf(',') > -1) {
        newObj.specificationsArr = newObj.specifications.split(',');
        newObj.specifications = newObj.specificationsArr[0];
      }
      if (newObj.goodsImages.indexOf(',')>-1){
        var arr = newObj.goodsImages.split(',');
        newObj.goodsImages=arr[0];
        newObj.goodsImagesArr=arr;
      }else{
        if (!newObj.goodsImagesArr){
          newObj.goodsImagesArr = [newObj.goodsImages];
        }
      }
      locationList[this.data.locationIndex].goodsTypeList[arr[0]].goodsInfos[arr[1]] = newObj;
      this.setData({
        locationList: locationList.concat([]),
        maskFlag: true,
        changeFlag: true
      })
      this.compute();
    }
  },
  //全选
  selectAll:function(){
    var list = this.data.locationList.concat([]);
    var selectArr = list[this.data.locationIndex].goodsTypeList;
    for(var i=0;i<selectArr.length;i++){
      for (var j = 0; j < selectArr[i].goodsInfos.length;j++){
        if(this.data.checkAll){
          selectArr[i].goodsInfos[j].checked=false;
        }else{
          selectArr[i].goodsInfos[j].checked = true;
        }
      }
    }
    list[this.data.locationIndex].goodsTypeList = selectArr;
    this.setData({
      locationList:list.concat([]),
      checkAll:!this.data.checkAll
    })
    this.compute();
  },
  //切换空间
  changeLocation:function(e){
    //console.log(e.currentTarget.dataset.index);
    this.setData({
      locationIndex: e.currentTarget.dataset.index
    })
    this.compute();
  },
  //改变颜色材质规格
  changeOthers:function(e){
    //console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var childindex = e.currentTarget.dataset.childindex;
    var oldObj = this.data.locationList[this.data.locationIndex].goodsTypeList[index].goodsInfos[childindex];
    var code = oldObj.id;
    //获取信息
    var that=this;
    getApp().ajax("queryInfomationByCode", { id: code}, 'GET', function (res) {
      var obj = res.data.goodsInfomation;
      var arr=[0,0,0];
      if (!oldObj.initPrice) {
        oldObj.initPrice = oldObj.unitPrice;
      }
      oldObj.specificaList = obj.specificaList;
      oldObj.colorList = obj.colorList;
      oldObj.materialList = obj.materialList;
      for (var i = 0; i < oldObj.specificaList.length;i++){
        if (oldObj.specificaList[i].specifications == oldObj.specifications){
          arr[0]=i;
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
        changeOthersIndex: index + ',' + childindex,
        changeOthersFlag: false,
        maskFlag: false
      })
    });
  },
  //选择规格颜色材质
  changeSelectTap:function(e){
    var index = parseInt( e.currentTarget.dataset.index);
    var otherIndex = parseInt(e.currentTarget.dataset.otherindex);
    var arr = this.data.others.concat([]);
    arr[otherIndex] = index;
    //计算价格
    var obj = this.data.othersObj;
    var price = obj.initPrice;
    if(arr[0]!=0){
      if (obj.specificaList[arr[0]].retailPremium > obj.specificaList[0].retailPremium){
        price += obj.specificaList[arr[0]].retailPremium - obj.specificaList[0].retailPremium;
      }else{
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
      others:arr.concat([]),
      othersObj:obj
    })
  },
  //重置属性
  resetSelect:function(){
    var obj = this.data.othersObj;
    obj.specifications = obj.specificaList[0].specifications;
    obj.material = obj.materialList[0].material;
    obj.goodsColor = obj.colorList[0].goodsColor;
    obj.unitPrice = obj.initPrice;
    this.setData({
      others: [0, 0, 0],
      othersObj:obj
    })
  },
  //提交属性修改
  commitSelect:function(){
    var indexStr = this.data.changeOthersIndex;
    var arr=indexStr.split(',');
    var list = this.data.locationList.concat([]);
    list[this.data.locationIndex].goodsTypeList[arr[0]].goodsInfos[arr[1]] = this.data.othersObj
    this.setData({
      locationList:list.concat([]),
      maskFlag:true,
      changeOthersFlag:true
    })
    this.compute();
  },
  //数量价格计算
  compute:function(){
    var totalNum=0;//总数
    var totalPrice=0;//总价
    var checkedFlag=true;//是否全选
    var list = this.data.locationList.concat([]);
    for(var i=0;i<list.length;i++){
      var num=0;//区间总数
      var price=0;//区间价格
      for (var j = 0; j < list[i].goodsTypeList.length;j++){
        for (var x = 0; x < list[i].goodsTypeList[j].goodsInfos.length;x++){
          var obj = list[i].goodsTypeList[j].goodsInfos[x];
          if(obj.checked){
            totalNum += parseInt(obj.goodsNum);
            totalPrice += parseFloat(obj.unitPrice).toFixed(2) * 100 * parseInt(obj.goodsNum);
            num += parseInt(obj.goodsNum);
            price += parseFloat(obj.unitPrice).toFixed(2) * 100 * parseInt(obj.goodsNum);
          }
          if(i==this.data.locationIndex){
            if (!obj.checked) {
              checkedFlag=false;
            }
          }
        }
      }
      list[i].totalNum=num;
      list[i].totalPrice=price/100;
    }

    this.setData({
      locationList:list.concat([]),
      totalNum: totalNum,
      totalPrice: totalPrice/100
    })
    if (checkedFlag){
      this.setData({
        checkAll:true
      })
    }else{
      this.setData({
        checkAll: false
      })
    }
  }
})