// component/wx-index-list/wx-index-list.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /**
         * 城市数据
         */
        data: {
            type: Object,
            value: {},
            observer: function(newVal, oldVal) {
                this.resetRight(newVal);
            }
        },
        /**
         * 配置项
         */
        config: {
            type: Object,
            value: {
                horizontal: true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
                animation: true, // 过渡动画是否开启
                // search: true, // 是否开启搜索
                // searchHeight: 45, // 搜索条高度
                suctionTop: true // 是否开启标题吸顶
            }
        },
        /**
         * 是否定位我的位置
         */
        myCity: {
            type: Boolean,
            value: false,
        },
    },

    data: {
        list: [],
        rightArr: [], // 右侧字母展示
        jumpNum: '', //跳转到那个字母
        myCityName: '请选择', // 默认我的城市
        topGroup: [], // 内容高度数据
        pos: {
            isTop: false,
            y: 0,
            oldIndex: -1
        },
        listIndex: 0,
        moveDistance: 0
    },
    ready() {
    
    },
    methods: {
        /**
         * 数据重新渲染
         */
        resetRight(data) {
          // console.log(data)
            let rightArr = []
            for (let i in data) {
              rightArr.push(data[i].Title);
            }
            this.setData({
                list: data,
                rightArr
            }, () => {
                if (data.length != 0) {
                    this.queryMultipleNodes();
                }
            })
        },
        /**
         * 右侧字母点击事件
         */
        jumpMt(e) {
            let jumpNum = e.currentTarget.dataset.id;
            this.setData({
              jumpNum,
              listIndex: e.currentTarget.dataset.index
            });
        },
        /**
         * 列表点击事件
         */
        detailMt(e) {
            this.setData({
              listIndex: e.currentTarget.dataset.index
            })
            let detail = e.currentTarget.dataset;
            this.triggerEvent('detail', detail)
        },
        /**
         * 监听滚动
         */
        scroll(e) {
            let top = e.detail.scrollTop;//列表距离顶部的距离
            let index = this.currentIndex(top)
            let list = this.data.topGroup
            let distance = top - list[this.data.listIndex]
            let num = -(list[this.data.listIndex + 1] - top - 40)
            // 渲染滚动索引
            if (index !== this.data.listIndex) {
                this.setData({
                    // 'pos.oldIndex': index,
                    listIndex: index,
                    moveDistance: 40,
                })
                // 如果监听到 index 的变化 ，一定要return ，否则吸顶会先变化文字后运动，会闪烁
                return
            }
            if (num < 0) num = 0
            if (num !== this.data.moveDistance) {
                this.setData({
                    moveDistance: num,
                })
            }
        },
        /**
         * 获取当前滚动索引
         */
        currentIndex(y) {
            let listHeight = this.data.topGroup
            for (let i = 0; i < listHeight.length; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (!height2 || (y >= height1 && y < height2)) {
                    return i
                }
            }
            return 0
        },
        /**
         * 获取节点信息
         */
        queryMultipleNodes() {
          let self = this 
            const query = wx.createSelectorQuery().in(this);
            query.selectAll('.fixed-title-hock').boundingClientRect((res) => {
              // console.log(res)
                res.forEach(function(rect) {
                    rect.top // 节点的上边界坐标
                })
            }).exec((e) => {
              // console.log(e)
                let arr = []
                e[0].forEach((rect) => {
                    let num = 0
                    if (rect.top !== 0) {
                      num = rect.top - e[0][0].top
                    }
                    arr.push(num)
                })
                this.setData({
                    topGroup: arr
                })
            })
        }

    }
})