// pages/programme/goodThingDetail/goodThingDetail.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    interval: 5000,
    duration: 1000,
    current: 0,
    shelvesGoodsUuid: '', //商品列表的唯一uuid
    maskFlag: true, //遮罩隐藏,true隐藏。false显示
    lookFlag: true, //弹窗参数查看,true隐藏。false显示
    changeOthersFlag: true, //颜色材质筛选
    goodsColorList: [], //颜色
    materialList: [], //材质
    specificationList: [], //规格
    shelvesGoodsDetailList: [], //上架商品指定规格颜色材质后的库存和价格
    productDetail: {},
    prductInfo: [],
    currentColor: [],
    currentMater: [],
    currentSpec: [],
    attrFlag: false,
    materFlag: false,
    colorFlag: false,
    specPreIndex:-1,
    colorPreIndex: -1,
    materPreIndex:-1,
    newList: [], //存放筛选完的数组
    minusStatus: 'disabled',
    maxStatus:'normal',
    num:1,
    // productColor:'',
    // productMater: '',
    // productSpec: '',
    productPrice:0,
    selectData:[],//選中的數組
    units:'',
    maxNum:0,//商品可选的最大数量
    dataMap:{},//属性map
    selectArr:['null','null','null'],//选中数组
    selectDataFlag: false,//判斷selectData是否有数据
    trueFlag:true,
    falseFlag:false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    if (options) {
      if (options.uuid) {
        this.getDetail(options.uuid);
      }
      if (options.goodsId) {
        this.getinfo(options.goodsId)
      }
    }


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
    setTimeout(function () {
      wx.stopPullDownRefresh();
      that.onLoad(that.options);
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
  //修改商品属性
  changeAttr() {
    this.setData({
      maskFlag: false,
      changeOthersFlag: false,
    })
  },
  //数组去重
  unique(arr) {
    return Array.from(new Set(arr))
  },
  //选择规格，颜色，材质
  /*selectSpec(e) {
    this.data.currentColor = [];
    this.data.currentMater = [];
    let that = this;
    let index = e.currentTarget.dataset.index;
    let listIndex = e.currentTarget.dataset.listindex; //确定点击规格、颜色、材质的哪一个
    //先选择规格
    var nowSpecification = this.data.specificationList[index]; //当前选中的规格
    //将包含选中规格的数组取出来
    this.data.newList = [];
    var goodsColorArr = [];
    var materialArr = [];
    //判断是否是第一次点击
    if (this.data.newList.length != 0) {
      var list = this.data.newList.concat([]);
    } else {
      var list = this.data.shelvesGoodsDetailList.concat([]);
    }
    console.log(list,'要循环的数据')
    for (let i = 0; i < list.length; i++) {
      if (nowSpecification == list[i].specifications) {
        this.data.newList.push(list[i]); //newList为筛选完规格的数组
        materialArr.push(list[i].material);
        goodsColorArr.push(list[i].goodsColor);
      }
    }
    console.log(this.data.newList,'this.data.newList')
    console.log(materialArr, 'materialArr')
    console.log(goodsColorArr, 'goodsColorArr')
    //数组去重
    materialArr = this.unique(materialArr);
    goodsColorArr = this.unique(goodsColorArr);
    //颜色的灰暗显示
    let listC = this.data.goodsColorList;
    for (let m = 0; m < listC.length; m++) {
      if (goodsColorArr.indexOf(listC[m]) > -1) {
        that.data.currentColor[m] = true
      } else {
        that.data.currentColor[m] = false
      }
    }
    console.log(that.data.currentColor, 'this.data.currentColor')
    //材质灰暗显示
    let listS = this.data.materialList;
    for (let m = 0; m < listS.length; m++) {
      if (materialArr.indexOf(listS[m]) > -1) {
        that.data.currentMater[m] = true
      } else {
        that.data.currentMater[m] = false
      }
    }
    this.setData({
      currentMater: that.data.currentMater,
      currentColor: that.data.currentColor,
      attrFlag: true,
      productSpec:nowSpecification,
      specPreIndex:index
    })
    console.log(this.data.currentMater, 'this.data.currentMater')
    this.confrimOtherAtter();
    // } 
  },
  selectColor(e) {
   
    let that =this;
    this.data.currentMater = [];
    this.data.currentSpec = [];
    let index = e.currentTarget.dataset.index;
   
    // if (this.data.attrFlag){
    var nowColor = this.data.goodsColorList[index]; //当前选中的颜色
    //将包含选中规格的数组取出来
    let materialArr = [];
    let specArr = [];
    if (this.data.newList.length != 0) {
      var list = this.data.newList.concat([]);
    } else {
      var list = this.data.shelvesGoodsDetailList.concat([]);
    }
    // this.setData({
    //   colorPreIndex: index
    // })
    // console.log(this.data.colorPreIndex,'this.data.colorPreIndex')
    // console.log(index, 'index')
    // if (this.data.colorPreIndex == index) {
    //   this.setData({
    //     colorPreIndex: -1
    //   })
    // } else {
    //   this.setData({
    //     colorPreIndex: index
    //   })
    // }
    this.data.newList = [];
    console.log(list,'list')
    for (let i = 0; i < list.length; i++) {
      if (nowColor == list[i].goodsColor) {
        this.data.newList.push(list[i]); //newList为筛选完规格的数组
        materialArr.push(list[i].material);
        // specArr.push(list[i].specifications);
      }
    }
    console.log(this.data.newList, 'this.data.newList')
    console.log(materialArr, 'materialArr')
    // console.log(specArr, 'specArr')
    //数组去重
    materialArr = this.unique(materialArr);
    specArr = this.unique(specArr);
    //材质的灰暗显示
    let listM = this.data.materialList;
    for (let m = 0; m < listM.length; m++) {
      for (let n = 0; n < materialArr.length; n++) {
        if (materialArr.indexOf(listM[m]) > -1) {
          that.data.currentMater[m] = true
        } else {
          that.data.currentMater[m] = false
        }
      }
    }
    console.log(this.data.currentMater, 'this.data.currentMater')
    //规格的灰暗显示
    let listS = this.data.specificationList;
    for (let m = 0; m < listS.length; m++) {
      if (specArr.indexOf(listS[m]) > -1) {
        that.data.currentSpec[m] = true
      } else {
        that.data.currentSpec[m] = false
      }
    }
    this.setData({
      currentSpec: this.data.currentSpec,
      attrFlag: true,
      currentMater: this.data.currentMater,
      productColor: nowColor,
      colorPreIndex: index
    })
   
    console.log(this.data.currentSpec, 'this.data.currentSpec')
    this.confrimOtherAtter();
  },
  selectMater(e) {
    let that = this;
    this.data.currentSpec = [];
    this.data.currentColor = [];
    let index = e.currentTarget.dataset.index;
    // if (this.data.attrFlag) {
    //选完规格后
    console.log(this.data.newList, '选完规格后')
    var nowMater = this.data.materialList[index]; //当前选中的材质
    console.log(nowMater)
    //将包含选中规格的数组取出来
    let goodsColorArr = [];
    let specArr = [];
    if (this.data.newList.length != 0) {
      var list = this.data.newList.concat([]);
    } else {
      var list = this.data.shelvesGoodsDetailList.concat([]);
    }
    // this.data.newList = [];
    for (let i = 0; i < list.length; i++) {
      if (nowMater == list[i].material) {
        this.data.newList.push(list[i]); //newList为筛选完规格的数组
        // materialArr.push(list[i].material);
        goodsColorArr.push(list[i].goodsColor);
        specArr.push(list[i].specifications)
      }
    }
    console.log(goodsColorArr, 'goodsColorArr')
    console.log(this.data.newList, 'newList')
    //数组去重
    // materialArr = this.unique(materialArr);
    goodsColorArr = this.unique(goodsColorArr);
    specArr = this.unique(specArr);
    console.log(goodsColorArr)
    console.log(this.data.currentColor)
    //颜色的灰暗显示
    let listC = this.data.goodsColorList.concat([]);
    for (let m = 0; m < listC.length; m++) {
      if (goodsColorArr.indexOf(listC[m]) > -1) {
        that.data.currentColor[m] = true
      } else {
        that.data.currentColor[m] = false
      }
    }
    //规格的灰暗显示
    let listS = this.data.specificationList;
    for (let m = 0; m < listS.length; m++) {
      if (specArr.indexOf(listS[m]) > -1) {
        that.data.currentSpec[m] = true
      } else {
        that.data.currentSpec[m] = false
      }
    }
    this.setData({
      currentColor: this.data.currentColor,
      currentSpec: this.data.currentSpec,
      attrFlag: true,
      productMater: nowMater,
      materPreIndex: index
    })
    // if (this.data.materPreIndex == index) {
    //   this.setData({
    //     materPreIndex: -1
    //   })
    // } else {
    //   this.setData({
    //     materPreIndex: index
    //   })
    // }
    console.log(this.data.currentColor, 'this.data.currentColor')
    this.confrimOtherAtter();
  },*/
  selectAttr:function(e){
    //console.log(e.target.dataset.item)
    if (this.data.shelvesGoodsDetailList.length != 1){
      let item = e.target.dataset.item;
      let listIndex = e.target.dataset.listindex;
      let selectArr = this.data.selectArr;
      if (selectArr[listIndex] == item) {
        selectArr[listIndex] = 'null'
      } else {
        selectArr[listIndex] = item;
      }
      // console.log(selectArr)
      if (selectArr[0] != "null" && selectArr[1] != "null" && selectArr[2] != "null") {
        let shelvesGoodsDetailList = this.data.shelvesGoodsDetailList
        for (let i = 0; i < shelvesGoodsDetailList.length; i++) {
          if (shelvesGoodsDetailList[i].goodsColor == selectArr[1]) {
            if (shelvesGoodsDetailList[i].material == selectArr[2]) {
              if (shelvesGoodsDetailList[i].specifications == selectArr[0]) {
                // console.log(shelvesGoodsDetailList[i])
                this.setData({
                  selectData: shelvesGoodsDetailList[i],
                  selectDataFlag: true
                })
              }
            }
          }
        }
      }

      this.setData({
        attrFlag: true,
        selectArr: selectArr,
        num: 1,
        minusStatus: 'disabled',
        maxStatus: 'normal',
      })
    }else{
      let selectArr = this.data.selectArr;
      this.setData({
        selectData: this.data.shelvesGoodsDetailList[0],
        selectDataFlag: true,
        selectArr: this.data.selectArr
      })
    }
   
    this.confrimOtherAtter();
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    var maxStatus = num < 1 ? 'disabled' : num < this.data.maxNum ? 'normal' : 'disabled';

    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus,
      maxStatus: maxStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    if (num < this.data.maxNum) {
      num++;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var maxStatus = num < 1 ? 'disabled' : num < this.data.maxNum ? 'normal' :'disabled';
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      maxStatus: maxStatus,
      minusStatus: minusStatus
    });
  },
  // /* 输入框事件 */
  // bindManual: function (e) {
  //   var num = e.detail.value;
  //   // 将数值与状态写回  
  //   this.setData({
  //     num: num
  //   });
  // },
  //确定价格和数量
  confrimOtherAtter(){
    let list = this.data.shelvesGoodsDetailList
    if (this.data.selectArr[0] != "null" && this.data.selectArr[1] != "null" && this.data.selectArr[2] != "null"){
      for (let i = 0; i < list.length;i++){
        if (this.data.selectArr[1] == list[i].goodsColor && this.data.selectArr[2] == list[i].material && this.data.selectArr[0] == list[i].specifications){
          // console.log(this.data.productDetail)
          var unitPrice = ['productDetail.unitPrice']
          this.setData({
            [unitPrice]:list[i].price,
            maxNum: list[i].stock
          })
        }
      }
    }
    if (this.data.selectArr[0] == "null" && this.data.selectArr[1] == "null" && this.data.selectArr[2] == "null"){
      this.setData({
        selectDataFlag:false
      })
    }
  },
  commitSelect() {
    if (this.data.shelvesGoodsDetailList == 0){
      wx.showToast({
        title: '暂时没有库存',
        icon: 'none',
        duration: 2000
      })
    }else if (this.data.selectArr[0] == "null" && this.data.selectArr[1] == "null" && this.data.selectArr[2] == "null") {
      wx.showToast({
        title: '请选择商品属性',
        icon: 'none',
        duration: 2000
      })
    }else if (this.data.selectArr[0] == "null"){
      wx.showToast({
        title: '请选择规格',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.selectArr[1] == "null"){
      wx.showToast({
        title: '请选择颜色',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.selectArr[2] == "null"){
      wx.showToast({
        title: '请选择材质',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.selectArr[0] != "null" && this.data.selectArr[1] != "null" && this.data.selectArr[2] != "null"){
      // console.log(this.data.shelvesGoodsDetailList)
      let shelvesGoodsDetailList = this.data.shelvesGoodsDetailList
      for (let i = 0; i < shelvesGoodsDetailList.length; i++) {
        if (shelvesGoodsDetailList[i].goodsColor == this.data.selectArr[1]) {
          if (shelvesGoodsDetailList[i].material == this.data.selectArr[2]) {
            if (shelvesGoodsDetailList[i].specifications == this.data.selectArr[0]) {
              // console.log(shelvesGoodsDetailList[i])
              if (shelvesGoodsDetailList[i].stock == 0){
                wx.showToast({
                  title: '暂时没库存',
                  icon: 'none',
                  duration: 2000
                })
              }else{
                this.setData({
                  selectData: shelvesGoodsDetailList[i],
                })
              }
            }
          }
        }
      }
      this.setData({
        num: this.data.num,
        changeOthersFlag:true,
        maskFlag:true
      })
    }else{

    }
  },
  goPay() {
    if (this.data.shelvesGoodsDetailList == 0) {
      wx.showToast({
        title: '暂时没有库存',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.selectArr[0] == "null" && this.data.selectArr[1] == "null" && this.data.selectArr[2] == "null") {
      wx.showToast({
        title: '请选择商品属性',
        icon: 'none',
        duration: 2000
      })
    }else if (this.data.selectArr[0] == "null") {
      wx.showToast({
        title: '请选择规格',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.selectArr[1] == "null") {
      wx.showToast({
        title: '请选择颜色',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.selectArr[2] == "null") {
      wx.showToast({
        title: '请选择材质',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.selectArr[0] != "null" && this.data.selectArr[1] != "null" && this.data.selectArr[2] != "null") {
      // console.log(this.data.productDetail,'this.data.productDetail')
      let list = {
        productDetail: this.data.productDetail,
        totalNum: this.data.num,
        // productColor: this.data.productColor,
        // productMater:this.data.productMater,
        // productSpec: this.data.productSpec,
        // productPrice: this.data.productPrice,
        selectData: this.data.selectData,
        maxNum: this.data.maxNum
      }
      // console.log(list,'list')
      var url = '/pages/order/goodConfirm/goodConfirm?list=' + JSON.stringify(list);
      getApp().checkToken(url, function (res) {
        if (res) {
          wx.navigateTo({
            url: url
          })
        }
      })
    } else {

    }
    
  },
  getAttrData(id) {
    let that = this;
    getApp().ajax("mall/getGoodsAttribute", {
      shelvesGoodsUuid: id
    }, 'get', function(res) {
      // console.log(res)
      //重组数据
      let list = res.data.data.shelvesGoodsDetailList;
      let colorList = res.data.data.goodsColorList;
      let materialList = res.data.data.materialList;
      let specificationList = res.data.data.specificationList;
      let map={};
      let arr = ['specifications','goodsColor', 'material'];
      let newArr=[];
      for(let i=0;i<arr.length;i++){
        let arrChange=arr.concat();
        arrChange[i]='null';
        newArr.push(arrChange)
      }
      newArr.push(arr);
      newArr.push(['null', 'goodsColor', 'null'], ['null', 'null', 'material'], ['specifications','null', 'null']);
      // console.log(newArr)
      for(let i=0;i<list.length;i++){
        let obj=list[i];
        for (let j = 0; j < newArr.length;j++){
          let str = newArr[j][0]!='null' ? list[i][newArr[j][0]]:'null';
          let str2 = newArr[j][1] != 'null' ? list[i][newArr[j][1]] : 'null';
          let str3 = newArr[j][2] != 'null' ? list[i][newArr[j][2]] : 'null';
          let newStr = str + str2 + str3;
          map[newStr]=true
        }
      }
      that.setData({
        dataMap: map,
        goodsColorList: res.data.data.goodsColorList,
        materialList: res.data.data.materialList,
        shelvesGoodsDetailList: res.data.data.shelvesGoodsDetailList,
        specificationList: res.data.data.specificationList,
        // selectData: res.data.data.shelvesGoodsDetailList[0],
        units: res.data.data.units
      })
      //处理单个商品属性
      if (that.data.shelvesGoodsDetailList.length == 1){
        // console.log(that.data.shelvesGoodsDetailList,'that.data.shelvesGoodsDetailList')
        that.setData({
          selectArr: [that.data.shelvesGoodsDetailList[0].specifications, that.data.shelvesGoodsDetailList[0].goodsColor, that.data.shelvesGoodsDetailList[0].material],
          selectData: that.data.shelvesGoodsDetailList[0]
        })
        that.confrimOtherAtter()
      }
    })
  },
  getDetail(id) {
    let that = this;
    getApp().ajax("mall/getGoods", {
      shelvesGoodsUuid: id
    }, 'get', function(res) {
      that.setData({
        productDetail: res.data.data
      })
      that.getAttrData(that.options.uuid);
    })
  },
  getinfo(id) {
    let that = this;
    getApp().ajax("mall/getGoodsDescription", {
      goodsId: id
    }, 'get', function(res) {
      that.setData({
        prductInfo: res.data.data
      })
    })
  },
  //查看详情
  lookInfo: function() {
    this.setData({
      maskFlag: false,
      lookFlag: false
    })
  },
  //关闭遮罩
  closeMask: function() {
    this.setData({
      maskFlag: true,
      changeOthersFlag: true,
      changeFlag: true,
      lookFlag: true
    })
  },
  //排列组合
  permutate:function(array/*需要进行全排列的一维数组*/, permutatedArray/*存放返回结果*/) {
    if (!permutatedArray) {
      permutatedArray = [];
    }
    if (array.length > 1) {
      //弹出第一个数
      var elementCur = array.shift();
      //排列剩余的数组
      this.permutate(array, permutatedArray);
      //返回剩余的数组的排列长度
      var permutatedArrayLen = permutatedArray.length;
      //第一个数与其他剩余数组所有数组组合
      for (var j = 0; j < permutatedArrayLen; j++) {
        //弹出不齐的组
        var p = permutatedArray.shift();
        //把当前元素放到排列好的数组的所有位置
        for (var i = 0; i <= p.length; i++) {
          //复制排列好的数组
          var r = p.slice(0);
          //插入数据到数组的位置
          r.splice(i, 0, elementCur);
          //保存
          permutatedArray.push(r)
        }
      }
      //退出条件
    } else {
      permutatedArray.push([array[0]]);
    }
    return permutatedArray;
  }
})