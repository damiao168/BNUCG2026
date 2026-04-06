App({
  globalData: {
    anonymousId: '',
    audioManager: null,
    userInfo: null,
    isLoggedIn: false
  },

  onLaunch() {
    this.initAnonymousId()
    this.initAudioOption()
    this.checkLoginStatus()
  },

  initAnonymousId() {
    let anonymousId = wx.getStorageSync('sleepmix_anonymous_id')
    if (!anonymousId) {
      anonymousId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      wx.setStorageSync('sleepmix_anonymous_id', anonymousId)
    }
    this.globalData.anonymousId = anonymousId
  },

  initAudioOption() {
    wx.setInnerAudioOption({
      mixWithOther: true,
      obeyMuteSwitch: false
    })
  },

  checkLoginStatus() {
    try {
      const isLoggedIn = !!wx.getStorageSync('sleepmix_is_logged_in')
      const userInfo = wx.getStorageSync('sleepmix_user_info')

      if (isLoggedIn) {
        this.globalData.isLoggedIn = true
        this.globalData.userInfo = userInfo && typeof userInfo === 'object'
          ? userInfo
          : { nickName: '游客', avatarUrl: '', loginType: 'guest' }
      }
    } catch (e) {
      console.error('Check login status failed:', e)
    }
  },

  logout() {
    try {
      wx.removeStorageSync('sleepmix_is_logged_in')
      wx.removeStorageSync('sleepmix_user_info')
      wx.removeStorageSync('sleepmix_login_code')
      this.globalData.isLoggedIn = false
      this.globalData.userInfo = null

      wx.reLaunch({
        url: '/pages/login/login'
      })
    } catch (e) {
      console.error('Logout failed:', e)
    }
  }
})
