// pages/chat/confirmDesign/confirmDesign.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientHeight:'',
    clickResult:''
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
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        })
      }
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
  //判断开通设计师权限
  goChat:function(){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否开通设计师服务？',
      cancelText:'不,谢谢',
      success(res) {
        that.setData({
          clickResult:'确定'
        })
        if (res.confirm) {
          var url = '/pages/chat/chat';
          getApp().checkToken(url, function (flag) {
            if (flag) {
              getApp().ajax("openDesignAuth", { token: wx.getStorageSync('token') }, 'POST', function (res) {
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
                    wx.redirectTo({
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
              })
            }
          })
        } else if (res.cancel) {
          this.setData({
            clickResult: '取消'
          })
          console.log('用户点击取消')
        }
      }
    })
  }
})