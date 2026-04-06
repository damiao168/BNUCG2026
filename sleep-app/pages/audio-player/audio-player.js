const app = getApp()
const config = require('../../utils/config')
const storage = require('../../utils/storage')
const { getAudioPlayer } = require('../../utils/audio')
const { formatDuration } = require('../../utils/format')

Page({
  data: {
    theme: 'light',
    audio: {},
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentTimeText: '00:00',
    durationText: '00:00',
    volume: 70,
    playMode: 'list',
    playModeIcon: '🔁',
    playModeText: '列表循环',
    isFavorite: false,
    showTimerPicker: false,
    timerOptions: config.timerOptions,
    timerValue: 0,
    timerText: '定时',
    showMixPanel: false,
    mixSounds: [
      { id: 'rain', name: '雨声', icon: '🌧️', volume: 50 },
      { id: 'fire', name: '篝火', icon: '🔥', volume: 30 },
      { id: 'wind', name: '风声', icon: '💨', volume: 40 },
      { id: 'birds', name: '鸟鸣', icon: '🐦', volume: 20 }
    ]
  },

  onLoad(options) {
    this.syncTheme()
    this.audioPlayer = getAudioPlayer()
    this.loadAudio(options.id)
    this.updatePlayStatus()
  },

  onShow() {
    this.syncTheme()
  },

  onUnload() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer)
    }
  },

  onThemeChange(theme) {
    this.setData({ theme })
  },

  syncTheme() {
    const theme = app.getTheme()
    this.setData({ theme })
  },

  goBack() {
    wx.navigateBack()
  },

  loadAudio(id) {
    const allAudios = [
      {
        id: '1',
        name: '雨夜轻语',
        cover: 'https://picsum.photos/400/400?random=1',
        duration: 1800,
        durationText: '30:00',
        categoryId: 'nature',
        categoryName: '自然声',
        url: 'https://example.com/audio/rain.mp3'
      },
      {
        id: '2',
        name: '海浪轻拍',
        cover: 'https://picsum.photos/400/400?random=2',
        duration: 2400,
        durationText: '40:00',
        categoryId: 'nature',
        categoryName: '自然声',
        url: 'https://example.com/audio/ocean.mp3'
      },
      {
        id: '3',
        name: '森林晨曦',
        cover: 'https://picsum.photos/400/400?random=3',
        duration: 1200,
        durationText: '20:00',
        categoryId: 'nature',
        categoryName: '自然声',
        url: 'https://example.com/audio/forest.mp3'
      },
      {
        id: '4',
        name: '篝火温暖',
        cover: 'https://picsum.photos/400/400?random=4',
        duration: 3600,
        durationText: '60:00',
        categoryId: 'nature',
        categoryName: '自然声',
        url: 'https://example.com/audio/fire.mp3'
      },
      {
        id: '5',
        name: '白噪音',
        cover: 'https://picsum.photos/400/400?random=5',
        duration: 3600,
        durationText: '60:00',
        categoryId: 'white-noise',
        categoryName: '白噪音',
        url: 'https://example.com/audio/white-noise.mp3'
      },
      {
        id: '6',
        name: '钢琴夜曲',
        cover: 'https://picsum.photos/400/400?random=6',
        duration: 2700,
        durationText: '45:00',
        categoryId: 'light-music',
        categoryName: '轻音乐',
        url: 'https://example.com/audio/piano.mp3'
      },
      {
        id: '7',
        name: '雨声ASMR',
        cover: 'https://picsum.photos/400/400?random=7',
        duration: 1800,
        durationText: '30:00',
        categoryId: 'asmr',
        categoryName: 'ASMR',
        url: 'https://example.com/audio/asmr-rain.mp3'
      },
      {
        id: '8',
        name: '睡前故事',
        cover: 'https://picsum.photos/400/400?random=8',
        duration: 900,
        durationText: '15:00',
        categoryId: 'story',
        categoryName: '睡前故事',
        url: 'https://example.com/audio/story.mp3'
      }
    ]
    
    const audio = allAudios.find(a => a.id === id) || allAudios[0]
    const settings = storage.getSettings()
    
    this.setData({
      audio,
      allAudios,
      isFavorite: storage.isFavorite(audio.id),
      volume: settings.defaultVolume || 70
    })
  },

  updatePlayStatus() {
    const currentAudio = this.audioPlayer.getCurrentAudio()
    const isPlaying = this.audioPlayer.isPlaying()
    const currentTime = this.audioPlayer.getCurrentTime()
    const duration = this.audioPlayer.getDuration()
    
    this.setData({
      isPlaying,
      currentTime,
      duration,
      currentTimeText: formatDuration(currentTime),
      durationText: formatDuration(duration)
    })
    
    if (isPlaying) {
      this.startUpdateTimer()
    }
  },

  startUpdateTimer() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer)
    }
    this.updateTimer = setInterval(() => {
      const currentTime = this.audioPlayer.getCurrentTime()
      const duration = this.audioPlayer.getDuration()
      this.setData({
        currentTime,
        duration,
        currentTimeText: formatDuration(currentTime),
        durationText: formatDuration(duration)
      })
    }, 1000)
  },

  togglePlay() {
    if (this.audioPlayer.isPlaying()) {
      this.audioPlayer.pause()
      this.setData({ isPlaying: false })
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
      }
    } else {
      this.audioPlayer.resume()
      this.setData({ isPlaying: true })
      this.startUpdateTimer()
    }
  },

  playPrev() {
    this.audioPlayer.playPrev()
    setTimeout(() => this.updatePlayStatus(), 500)
  },

  playNext() {
    this.audioPlayer.playNext()
    setTimeout(() => this.updatePlayStatus(), 500)
  },

  onSeek(e) {
    const value = e.detail.value
    this.audioPlayer.seek(value)
    this.setData({
      currentTime: value,
      currentTimeText: formatDuration(value)
    })
  },

  onSeeking(e) {
    const value = e.detail.value
    this.setData({
      currentTime: value,
      currentTimeText: formatDuration(value)
    })
  },

  onVolumeChange(e) {
    const volume = e.detail.value
    this.audioPlayer.setVolume(volume / 100)
    this.setData({ volume })
    storage.updateSettings({ defaultVolume: volume })
  },

  togglePlayMode() {
    const modes = ['list', 'single', 'random']
    const currentIndex = modes.indexOf(this.data.playMode)
    const nextIndex = (currentIndex + 1) % modes.length
    const nextMode = modes[nextIndex]
    
    const modeInfo = {
      list: { icon: '🔁', text: '列表循环' },
      single: { icon: '🔂', text: '单曲循环' },
      random: { icon: '🔀', text: '随机播放' }
    }
    
    this.audioPlayer.setPlayMode(nextMode)
    this.setData({
      playMode: nextMode,
      playModeIcon: modeInfo[nextMode].icon,
      playModeText: modeInfo[nextMode].text
    })
  },

  showTimerPicker() {
    this.setData({ showTimerPicker: true })
  },

  hideTimerPicker() {
    this.setData({ showTimerPicker: false })
  },

  setTimer(e) {
    const value = e.currentTarget.dataset.value
    this.audioPlayer.setTimer(value)
    
    let timerText = '定时'
    if (value > 0) {
      timerText = `${value}分钟后关闭`
    } else if (value === -1) {
      timerText = '播完关闭'
    }
    
    this.setData({
      timerValue: value,
      timerText,
      showTimerPicker: false
    })
  },

  showMixPanel() {
    this.setData({ showMixPanel: true })
  },

  hideMixPanel() {
    this.setData({ showMixPanel: false })
  },

  onMixVolumeChange(e) {
    const index = e.currentTarget.dataset.index
    const volume = e.detail.value
    const mixSounds = this.data.mixSounds
    mixSounds[index].volume = volume
    this.setData({ mixSounds })
  },

  applyMix() {
    const activeMixes = this.data.mixSounds.filter(s => s.volume > 0)
    if (activeMixes.length > 0) {
      this.audioPlayer.clearMixAudios()
      activeMixes.forEach(mix => {
        this.audioPlayer.addMixAudio(
          { id: mix.id, url: `/static/audio/${mix.id}.mp3` },
          mix.volume / 100
        )
      })
      this.audioPlayer.startMixMode()
    }
    this.hideMixPanel()
  },

  clearMix() {
    this.audioPlayer.clearMixAudios()
    const mixSounds = this.data.mixSounds.map(s => ({ ...s, volume: 0 }))
    this.setData({ mixSounds })
  },

  toggleFavorite() {
    if (this.data.isFavorite) {
      storage.removeFavorite(this.data.audio.id)
    } else {
      storage.addFavorite(this.data.audio)
    }
    this.setData({ isFavorite: !this.data.isFavorite })
  }
})
