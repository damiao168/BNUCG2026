const app = getApp()
const audioConfig = require('../../config/audio-config')
const mixManager = require('../../utils/mix-manager')
const randomMixer = require('../../utils/random-mixer')
const storage = require('../../utils/storage')

Page({
  data: {
    audioList: [],
    mixConfig: {
      tracks: [],
      isPlaying: false,
      isLooping: true
    },
    activeTrackCount: 0,
    saveTimer: null,
    userInfo: null
  },

  onLoad() {
    if (!this.checkLogin()) {
      return
    }
    this.initPage()
  },

  onShow() {
    if (!this.checkLogin()) {
      return
    }

    if (this.data.mixConfig.isPlaying) {
      mixManager.resumeAll(this.data.mixConfig)
    }
  },

  onHide() {
    this.saveConfig()
  },

  onUnload() {
    this.saveConfig()
    mixManager.destroy()
  },

  checkLogin() {
    let isLoggedIn = app.globalData.isLoggedIn
    let userInfo = app.globalData.userInfo

    if (!isLoggedIn) {
      isLoggedIn = !!wx.getStorageSync('sleepmix_is_logged_in')
      userInfo = wx.getStorageSync('sleepmix_user_info')
    }

    if (!isLoggedIn) {
      wx.redirectTo({
        url: '/pages/login/login',
        fail: () => {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
      return false
    }

    userInfo = userInfo && typeof userInfo === 'object'
      ? userInfo
      : { nickName: '游客', avatarUrl: '', loginType: 'guest' }

    app.globalData.isLoggedIn = true
    app.globalData.userInfo = userInfo

    this.setData({
      userInfo
    })

    return true
  },

  initPage() {
    const tracks = audioConfig.map((audio) => ({
      audioId: audio.id,
      enabled: false,
      ratio: 0
    }))

    this.setData({
      audioList: audioConfig,
      'mixConfig.tracks': tracks
    })

    mixManager.init()
    this.restoreConfig()
  },

  restoreConfig() {
    const savedConfig = storage.getMixConfig()
    if (savedConfig && savedConfig.tracks && savedConfig.tracks.length > 0) {
      const mergedTracks = this.data.audioList.map((audio) => {
        const savedTrack = savedConfig.tracks.find((track) => track.audioId === audio.id)
        return savedTrack || {
          audioId: audio.id,
          enabled: false,
          ratio: 0
        }
      })

      this.setData({
        'mixConfig.tracks': mergedTracks,
        'mixConfig.isLooping': savedConfig.isLooping !== undefined ? savedConfig.isLooping : true
      })

      mixManager.setLoop(this.data.mixConfig.isLooping)
      this.updateActiveCount()
    }
  },

  onToggle(e) {
    const audioId = e.detail.audioId
    const enabled = e.detail.enabled
    const tracks = this.data.mixConfig.tracks
    const index = tracks.findIndex((track) => track.audioId === audioId)

    if (index > -1) {
      const key = 'mixConfig.tracks[' + index + '].enabled'
      this.setData({ [key]: enabled })

      if (enabled && this.data.mixConfig.tracks[index].ratio === 0) {
        const ratioKey = 'mixConfig.tracks[' + index + '].ratio'
        this.setData({ [ratioKey]: 50 })
      }

      this.updateActiveCount()
      mixManager.updateMix(this.data.mixConfig)
      this.debouncedSave()
    }
  },

  onRatioChange(e) {
    const audioId = e.detail.audioId
    const ratio = e.detail.ratio
    const tracks = this.data.mixConfig.tracks
    const index = tracks.findIndex((track) => track.audioId === audioId)

    if (index > -1) {
      const key = 'mixConfig.tracks[' + index + '].ratio'
      this.setData({ [key]: ratio })
      mixManager.updateMix(this.data.mixConfig)
      this.debouncedSave()
    }
  },

  onPlay() {
    const isPlaying = !this.data.mixConfig.isPlaying

    if (isPlaying) {
      const hasActiveTracks = this.data.mixConfig.tracks.some((track) => track.enabled && track.ratio > 0)
      if (!hasActiveTracks) {
        wx.showToast({
          title: '请先选择音轨',
          icon: 'none',
          duration: 2000
        })
        return
      }

      mixManager.playAll(this.data.mixConfig)
    } else {
      mixManager.pauseAll()
    }

    this.setData({ 'mixConfig.isPlaying': isPlaying })
    this.saveConfig()
  },

  onRandom() {
    const randomConfig = randomMixer.generate(this.data.audioList)

    this.setData({
      'mixConfig.tracks': randomConfig.tracks,
      'mixConfig.isPlaying': false
    })

    this.updateActiveCount()
    mixManager.stopAll()
    mixManager.updateMix(this.data.mixConfig)
    this.saveConfig()

    wx.showToast({
      title: '已生成随机混音',
      icon: 'success',
      duration: 1500
    })
  },

  onLoop() {
    const isLooping = !this.data.mixConfig.isLooping
    this.setData({ 'mixConfig.isLooping': isLooping })
    mixManager.setLoop(isLooping)
    this.saveConfig()
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          mixManager.destroy()
          app.logout()
        }
      }
    })
  },

  updateActiveCount() {
    const count = this.data.mixConfig.tracks.filter((track) => track.enabled && track.ratio > 0).length
    this.setData({ activeTrackCount: count })
  },

  debouncedSave() {
    if (this.data.saveTimer) {
      clearTimeout(this.data.saveTimer)
    }

    const timer = setTimeout(() => {
      this.saveConfig()
    }, 500)

    this.setData({ saveTimer: timer })
  },

  saveConfig() {
    storage.saveMixConfig(this.data.mixConfig)
  }
})
