App({
  onLaunch() {
    this.initApp()
  },

  globalData: {
    userInfo: null,
    isLoggedIn: false,
    audioPlayer: null,
    currentAudio: null,
    playList: [],
    playMode: 'list',
    timer: null,
    mixAudios: [],
    currentTheme: 'light'
  },

  initApp() {
    this.checkUpdate()
    this.initStorage()
    this.initTheme()
    this.checkLoginStatus()
  },

  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
    }
  },

  initStorage() {
    const keys = ['favorites', 'recentPlay', 'trainingRecords', 'userSettings']
    keys.forEach(key => {
      if (!wx.getStorageSync(key)) {
        wx.setStorageSync(key, key === 'userSettings' ? {
          screenAwake: true,
          fadeOutDuration: 10,
          defaultVolume: 70
        } : [])
      }
    })
  },

  initTheme() {
    const savedTheme = wx.getStorageSync('user-theme') || 'light'
    this.globalData.currentTheme = savedTheme
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    if (token && userInfo) {
      this.globalData.isLoggedIn = true
      this.globalData.userInfo = userInfo
    }
  },

  getTheme() {
    return this.globalData.currentTheme
  },

  setTheme(themeName) {
    if (themeName !== 'light' && themeName !== 'dark') {
      themeName = 'light'
    }
    
    this.globalData.currentTheme = themeName
    wx.setStorageSync('user-theme', themeName)
    
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page && typeof page.onThemeChange === 'function') {
        page.onThemeChange(themeName)
      }
    })
    
    return themeName
  },

  toggleTheme() {
    const newTheme = this.globalData.currentTheme === 'light' ? 'dark' : 'light'
    return this.setTheme(newTheme)
  },

  setLoginStatus(loggedIn, userInfo = null) {
    this.globalData.isLoggedIn = loggedIn
    this.globalData.userInfo = userInfo
  },

  getLoginStatus() {
    return this.globalData.isLoggedIn
  },

  getUserInfo() {
    return this.globalData.userInfo
  },

  logout() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    this.globalData.isLoggedIn = false
    this.globalData.userInfo = null
  }
})
