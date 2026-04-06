const app = getApp()
const auth = require('../../utils/auth')

Page({
  data: {
    theme: 'light',
    canUseGetUserProfile: false,
    loading: false,
    agreePrivacy: false,
    tempAvatarUrl: '',
    tempNickname: ''
  },

  onLoad() {
    this.syncTheme()
    this.checkUserProfileAbility()
  },

  onShow() {
    this.syncTheme()
  },

  onThemeChange(theme) {
    this.setData({ theme })
  },

  syncTheme() {
    const theme = app.getTheme ? app.getTheme() : 'light'
    this.setData({ theme })
  },

  checkUserProfileAbility() {
    const canUseGetUserProfile = wx.canIUse('getUserProfile')
    this.setData({ canUseGetUserProfile })
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({ tempAvatarUrl: avatarUrl })
  },

  onNicknameInput(e) {
    this.setData({ tempNickname: e.detail.value })
  },

  onPrivacyChange(e) {
    this.setData({ agreePrivacy: e.detail.value.length > 0 })
  },

  viewPrivacy() {
    wx.showToast({
      title: '查看协议',
      icon: 'none'
    })
  },

  async handleLogin() {
    if (!this.data.agreePrivacy) {
      wx.showToast({
        title: '请先同意隐私协议',
        icon: 'none'
      })
      return
    }

    this.setData({ loading: true })

    try {
      const result = await auth.login()
      
      const userInfo = {
        avatar: this.data.tempAvatarUrl || '',
        nickname: this.data.tempNickname || '助眠用户'
      }
      auth.updateUserInfo(userInfo)
      
      app.globalData.isLoggedIn = true
      app.globalData.userInfo = auth.getUserInfo()

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      wx.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  handleSkip() {
    wx.navigateBack()
  }
})
