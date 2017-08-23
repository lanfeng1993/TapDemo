//index.js
var app = getApp()
Page({
  data: {

  },
  
  onLoad: function () {
  },

  // 触摸开始时间
  touchStartTime: 0,
  // 触摸结束时间
  touchEndTime: 0,  
  // 最后一次单击事件点击发生时间
  lastTapTime: 0, 
  // 单击事件点击后要触发的函数
  lastTapTimeoutFunc: null, 



  /// 按钮触摸开始触发的事件
  touchStart: function(e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function(e) {
    this.touchEndTime = e.timeStamp
  },

  /// 单击
  tap: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '单击事件被触发',
      showCancel: false
    })
  },

  /// 双击
  doubleTap: function(e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        console.log("double tap")
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
        wx.showModal({
          title: '提示',
          content: '双击事件被触发',
          showCancel: false
        })
      }
    }
  },

  /// 长按
  longTap: function(e) {
    console.log("long tap")
    wx.showModal({
      title: '提示',
      content: '长按事件被触发',
      showCancel: false
    })
  },

  /// 单击、双击
  multipleTap: function(e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime
      
      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        console.log("double tap")
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
        wx.showModal({
          title: '提示',
          content: '双击事件被触发',
          showCancel: false
        })
      } else {
        // 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。
        that.lastTapTimeoutFunc = setTimeout(function () {
          console.log("tap")
          wx.showModal({
            title: '提示',
            content: '单击事件被触发',
            showCancel: false
          })
        }, 300);
      }
    }
  },
})
