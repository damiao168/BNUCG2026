const app = getApp()
const storage = require('../../utils/storage')

Page({
  data: {
    theme: 'light',
    isLoggedIn: false,
    userInfo: {
      avatar: '',
      nickname: '助眠用户',
      gender: 'secret',
      birthday: ''
    },
    settings: {
      screenAwake: true,
      fadeOutDuration: 10,
      defaultVolume: 70
    },
    showModal: false,
    modalTitle: '',
    modalType: '',
    tempValue: 0
  },

  onLoad() {
    this.syncTheme()
    this.loadUserInfo()
    this.loadSettings()
  },

  onShow() {
    this.syncTheme()
    this.checkLoginStatus()
    this.loadUserInfo()
  },

  onThemeChange(theme) {
    this.setData({ theme })
  },

  syncTheme() {
    const theme = app.getTheme()
    this.setData({ theme })
  },

  checkLoginStatus() {
    const isLoggedIn = app.isLoggedIn()
    this.setData({ isLoggedIn })
  },

  loadUserInfo() {
    const userInfo = app.getUserInfo() || storage.getUserInfo()
    this.setData({
      userInfo: {
        avatar: userInfo.avatar || '',
        nickname: userInfo.nickname || '助眠用户',
        gender: userInfo.gender || 'secret',
        birthday: userInfo.birthday || ''
      }
    })
  },

  loadSettings() {
    const settings = storage.getSettings()
    this.setData({
      settings: {
        screenAwake: settings.screenAwake !== false,
        fadeOutDuration: settings.fadeOutDuration || 10,
        defaultVolume: settings.defaultVolume || 70
      }
    })
  },

  goToFavorites() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goToRecentPlay() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goToTrainingRecords() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goToEditProfile() {
    if (!this.data.isLoggedIn) {
      this.goToLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile'
    })
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  toggleScreenAwake() {},

  onScreenAwakeChange(e) {
    const value = e.detail.value
    const settings = this.data.settings
    settings.screenAwake = value
    storage.updateSettings(settings)
    this.setData({ settings })
    
    if (value) {
      wx.setKeepScreenOn({ keepScreenOn: true })
    } else {
      wx.setKeepScreenOn({ keepScreenOn: false })
    }
  },

  showVolumeSetting() {
    this.setData({
      showModal: true,
      modalTitle: '默认音量',
      modalType: 'volume',
      tempValue: this.data.settings.defaultVolume
    })
  },

  showFadeOutSetting() {
    this.setData({
      showModal: true,
      modalTitle: '淡出时长',
      modalType: 'fadeOut',
      tempValue: this.data.settings.fadeOutDuration
    })
  },

  onModalValueChange(e) {
    this.setData({ tempValue: e.detail.value })
  },

  confirmModal() {
    const { modalType, tempValue, settings } = this.data
    
    if (modalType === 'volume') {
      settings.defaultVolume = tempValue
    } else if (modalType === 'fadeOut') {
      settings.fadeOutDuration = tempValue
    }
    
    storage.updateSettings(settings)
    this.setData({ settings, showModal: false })
  },

  hideModal() {
    this.setData({ showModal: false })
  },

  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '助眠放松是一款专注于睡眠健康的小程序，通过音频助眠和放松训练帮助用户改善睡眠质量。',
      showCancel: false
    })
  },

  showFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '如有问题或建议，请联系我们：\nfeedback@sleeprelax.com',
      showCancel: false
    })
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout()
          this.setData({
            isLoggedIn: false,
            userInfo: {
              avatar: '',
              nickname: '助眠用户',
              gender: 'secret',
              birthday: ''
            }
          })
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})
