const app = getApp()

Page({
  data: {
    canIUseGetUserProfile: false,
    isSubmitting: false
  },

  onLoad() {
    this.setData({
      canIUseGetUserProfile: typeof wx.getUserProfile === 'function'
    })

    if (app.globalData.isLoggedIn) {
      this.goToHome()
    }
  },

  onShow() {
    if (app.globalData.isLoggedIn) {
      this.goToHome()
    }
  },

  async onWechatLoginTap() {
    if (this.data.isSubmitting) {
      return
    }

    this.setData({ isSubmitting: true })

    try {
      const userInfo = await this.resolveWechatUserInfo()
      this.completeLogin(userInfo)
    } catch (error) {
      if (error && error.errMsg && error.errMsg.indexOf('cancel') !== -1) {
        wx.showToast({
          title: '已取消授权',
          icon: 'none',
          duration: 2000
        })
      } else {
        console.error('微信授权失败:', error)
        this.completeLogin(this.buildGuestUserInfo('微信用户'))
      }
    } finally {
      this.setData({ isSubmitting: false })
    }
  },

  onGuestLoginTap() {
    if (this.data.isSubmitting) {
      return
    }

    this.completeLogin(this.buildGuestUserInfo('游客'))
  },

  async resolveWechatUserInfo() {
    if (!this.data.canIUseGetUserProfile) {
      return this.buildGuestUserInfo('微信用户')
    }

    try {
      const profileRes = await new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: '用于获取头像和昵称并在本地展示',
          success: resolve,
          fail: reject
        })
      })

      return this.normalizeUserInfo(profileRes.userInfo, '微信用户', 'wechat')
    } catch (error) {
      if (error && error.errMsg && error.errMsg.indexOf('cancel') !== -1) {
        throw error
      }

      console.warn('获取微信信息失败，已回退到本地身份:', error)
      return this.buildGuestUserInfo('微信用户')
    }
  },

  buildGuestUserInfo(nickName) {
    return this.normalizeUserInfo({
      avatarUrl: '',
      anonymousId: app.globalData.anonymousId
    }, nickName, nickName === '游客' ? 'guest' : 'wechat')
  },

  normalizeUserInfo(userInfo, defaultName, loginType) {
    const fallbackName = defaultName || '游客'
    return Object.assign({
      nickName: fallbackName,
      avatarUrl: '',
      anonymousId: app.globalData.anonymousId,
      loginType: loginType || 'guest'
    }, userInfo || {})
  },

  completeLogin(userInfo) {
    wx.showLoading({
      title: '正在进入',
      mask: true
    })

    try {
      this.saveLoginInfo(userInfo)
      wx.hideLoading()
      this.goToHome()
    } catch (error) {
      wx.hideLoading()
      console.error('完成登录失败:', error)
      wx.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 2000
      })
    }
  },

  saveLoginInfo(userInfo) {
    wx.setStorageSync('sleepmix_user_info', userInfo)
    wx.setStorageSync('sleepmix_is_logged_in', true)
    wx.setStorageSync('sleepmix_login_code', '')
    app.globalData.userInfo = userInfo
    app.globalData.isLoggedIn = true
  },

  goToHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },

  onPrivacyTap() {
    wx.showModal({
      title: '用户隐私说明',
      content: '本小程序优先获取微信头像和昵称用于本地展示。如授权失败，仍可以游客方式进入，不会影响功能使用。',
      showCancel: false,
      confirmText: '我知道了'
    })
  }
})
