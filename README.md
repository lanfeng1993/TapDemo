### 微信小程序实现同时单击、双击、长按

>有时候我们需要在小程序中实现一个组件同时拥有单击、双击和长按三种操作，但是微信只提供了单击和长按事件绑定，而且如果一个组件同时绑定了单击双击事件，在长按时，也会触发单击事件，所以这时候需要对程序做一些特别的处理。

![demo演示](http://upload-images.jianshu.io/upload_images/1782337-473cded349d6be46.gif?imageMogr2/auto-orient/strip)

要实现小程序的单击和长按事件比较简单，直接绑定微信提供的单击和长按事件就可以了，但是要一个组件同时支持单击和长按的操作，而这两个事件又不冲突就需要做一些额外的工作了。因为微信提供的长按事件如果同时绑定了单击事件，那么长按时也会触发单击事件。另外微信没有提供双击事件，所以双击需要自己实现。

首先，需要在js中定义几个变量

```

  // 触摸开始时间
  touchStartTime: 0,
  // 触摸结束时间
  touchEndTime: 0,  
  // 最后一次单击事件点击发生时间
  lastTapTime: 0, 
  // 单击事件点击后要触发的函数
  lastTapTimeoutFunc: null, 
  
```

然后定义两个记录触摸事件的函数

```

  /// 按钮触摸开始触发的事件
  touchStart: function(e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function(e) {
    this.touchEndTime = e.timeStamp
  },

```

在界面中需要绑定点击事件的地方，需要加入bindtouchstart 和bindtouchend,以便记录下按钮开始触摸和结束触摸的时间。其他的分别绑定好单击、双击、长按事件就好了。

```

<!--index.wxml-->
<view class="container">


  <view class = "split"></view>
  <view class = "btn" bindtap="tap" bindtouchstart="touchStart" bindtouchend="touchEnd">
    单击
  </view>


  <view class = "split"></view>
  <view class = "btn" bindtap="doubleTap" bindtouchstart="touchStart" bindtouchend="touchEnd">
    双击
  </view>


  <view class = "split"></view>
  <view class = "btn" bindlongtap="longTap" bindtouchstart="touchStart" bindtouchend="touchEnd">
    长按
  </view>


  <view class = "split"></view>
  <view class = "btn" bindtap="multipleTap" bindlongtap="longTap" bindtouchstart="touchStart" bindtouchend="touchEnd">
    单击／双击／长按
  </view>

</view>

```

仅有单击不用做特殊的处理：

```

  /// 单击
  tap: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '单击事件被触发',
      showCancel: false
    })
  },

```


双击和单击并存时的实现，这里实现双击和单击是参考了手机点击网页的300ms延时的方式，原来在iPhone4出来的时候，手机网页比较小，所以iPhone浏览器上加入了双击放大网页的操作，导致网页的点击需要延时300ms才会触发，即300ms内点击两次算双击事件。这里实现是在单击时，将单击事件延迟300ms执行，如果300ms内又有一次点击，则把单击事件取消，然后触发单击事件。

```

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
  
```


单击、双击和长按同时存在的实现：

```

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

```

在实际应用时可以灵活应用，多点击事件可以组合操作，比如"单击+双击"，"单击+长按"，"双击+长按"。在我们现在的小程序项目中是有一个地方用上了"单击+双击+长按"的，单击预览图片，双击修改图片类型，长按删除图片。

