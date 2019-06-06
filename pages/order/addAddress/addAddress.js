// pages/order/updataAddress/updataAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    arr: [],
    pageStu: false,
    // columnIndex:'',
    // columnValue:'',
    multiIndex: [0, 0, 0],
    arrData: [[], [], []],
    isShow: false,
    flag: true,
    provinceValue: 0,
    customItem: '全部',
    indexValue: [],
    addressValue: '',
    //新增数据    
    requireData: {
      shipID: '',
      linkman: '',  //联系人，不可为空
      token: '',  //联系电话，不可为空
      province: '',         //省，不可为空
      provinceId: '',            //省id，不可为空
      city: '',              //市，不可为空
      cityId: '',                //市id，不可为空
      distincts: '',         //区，不可为空
      distinctId: '',             //区id，不可为空
      address: '' // 详细地址，不可为空
    },
    uuid: 0,

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
    //获取地区选择器的数据
    this.getProvince();
    // this.getAddress();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // indexValue  接收到的地址下标  以及 地址id
    let that = this;
    // console.log(options.indexValue)
    if (that.options.indexValue) {
      // 获取带过来的数据，显示在修改地址页面
      that.setData({
        indexValue: JSON.parse(that.options.indexValue),
        requireData: {
          linkman: JSON.parse(that.options.indexValue)[2],
          mobileNum: JSON.parse(that.options.indexValue)[3],
          province: JSON.parse(that.options.indexValue)[4],
          provinceId: JSON.parse(that.options.indexValue)[5],
          city: JSON.parse(that.options.indexValue)[6],
          cityId: JSON.parse(that.options.indexValue)[7],
          distincts: JSON.parse(that.options.indexValue)[8],
          distinctId: JSON.parse(that.options.indexValue)[9],
          address: JSON.parse(that.options.indexValue)[10]
        }
      })

    } else if (that.options.pageStu) {
      let that = this;
      that.setData({
        pageStu: that.options.pageStu
      })
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
    //console.log(1)
    var that = this;
    setTimeout(function () {
      wx.stopPullDownRefresh();
      that.onShow(that.options);
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



  isShow: function () {
    this.data.isShow = true;
    this.setData({
      isShow: this.data.isShow
    })
  },
  bindcancel: function () {
    this.data.isShow = false;
    this.setData({
      isShow: this.data.isShow
    })
  },
  //获取省
  getProvince() {
    let that = this;
    let data = {
      enterType: 2,
      orderType: ''
    }
    if (this.data.uuid != '') {
      data.uuid = that.data.uuid
    }
    getApp().ajax("region/queryRegion", data, 'get', function (res) {
      that.data.arrData[0] = res.data.data;
      that.getCity(that.data.arrData[0][0].uuid);
    })
  },
  //获取市
  getCity(uuid) {
    // console.log(uuid,'uuid2')
    let that = this;
    let data = {
      enterType: 2,
      orderType: 4
    }
    if (uuid != '') {
      data.uuid = uuid;
    }
    getApp().ajax("region/queryRegion", data, 'get', function (res) {
      that.data.arrData[1] = res.data.data
      that.getArea(that.data.arrData[1][0].uuid)
    })
  },
  //获取区
  getArea(uuid) {
    // console.log(uuid, 'uuid3')
    let that = this;
    let data = {
      enterType: 2,
      orderType: 4
    }
    if (uuid != '') {
      data.uuid = uuid;
    }
    getApp().ajax("region/queryRegion", data, 'get', function (res) {
      that.data.arrData[2] = res.data.data
      that.setData({
        region: that.data.arrData
      })
    })

  },
  // 获取用户的表单数据
  bindFormSubmit: function (e) {
    let that = this;
    // 构建要提交的数据对象
    that.setData({
      'requireData.linkman': e.detail.value.linkman,
      'requireData.mobileNum': e.detail.value.mobileNum,
      'requireData.address': e.detail.value.address,
    })
    var warn = "";
    // 获取修改列的下标值
    if (that.data.indexValue.length > 0) {
      that.data.requireData.shipID = that.data.indexValue[1]
    }
    // 重新获取修改地址页面的数据
    that.data.requireData.token = wx.getStorageSync('token');
    //对地址信息进行判断
    if (that.data.requireData.linkman == '') {
      warn = "请填写收货人姓名"
    } else if (that.data.requireData.mobileNum == '') {
      warn = "请填写联系方式"
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(that.data.requireData.mobileNum))) {
      warn = "手机号格式不正确"
    } else if (that.data.requireData.province == '' || that.data.requireData.city == '' || that.data.requireData.distincts == '') {
      warn = "请选择所在地区"
    } else if (that.data.requireData.address == '') {
      warn = "请填写详细地址"
    } else {
      that.data.flag = false;
      getApp().ajax("addShippingAddress", that.data.requireData, 'post', function (res) {
        if (res.data.retCode == 0) { }
      })
      wx.navigateBack({
        delta: 1
      })
    }
    if (that.data.flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  bindRegionChange: function (e) {
    // console.log(e)
    let that = this;
    let arr = e.detail.value
    that.setData({
      'requireData.province': this.data.region[0][arr[0]].regionName,
      'requireData.city': this.data.region[1][arr[1]].regionName,
      'requireData.distincts': this.data.region[2][arr[2]].regionName,
    })
    that.setData({
      // 确定点击是第几个
      multiIndex: e.detail.value,
    })
  },
  // 每一列的值改变时触发
  bindMultiPickerColumnChange: function (e) {
    //移动的是市还是区
    let column = e.detail.column//列
    let value = e.detail.value
    if (column == 0) {
      this.getCity(this.data.region[0][value].uuid);
    } else if (column == 1) {
      this.getArea(this.data.region[1][value].uuid)
    } else {

    }
  }

})