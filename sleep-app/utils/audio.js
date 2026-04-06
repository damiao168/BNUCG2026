const app = getApp()

class AudioPlayer {
  constructor() {
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.currentAudio = null
    this.playList = []
    this.currentIndex = 0
    this.playMode = 'list'
    this.timer = null
    this.mixAudios = []
    this.isMixMode = false
    
    this.initEvents()
  }

  initEvents() {
    this.backgroundAudioManager.onPlay(() => {
      console.log('音频开始播放')
      this.updatePlayStatus(true)
    })

    this.backgroundAudioManager.onPause(() => {
      console.log('音频暂停')
      this.updatePlayStatus(false)
    })

    this.backgroundAudioManager.onStop(() => {
      console.log('音频停止')
      this.updatePlayStatus(false)
    })

    this.backgroundAudioManager.onEnded(() => {
      console.log('音频播放结束')
      this.handleAudioEnded()
    })

    this.backgroundAudioManager.onError((err) => {
      console.error('音频播放错误:', err)
      wx.showToast({
        title: '播放失败',
        icon: 'none'
      })
    })

    this.backgroundAudioManager.onTimeUpdate(() => {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (currentPage && typeof currentPage.onAudioTimeUpdate === 'function') {
        currentPage.onAudioTimeUpdate({
          currentTime: this.backgroundAudioManager.currentTime,
          duration: this.backgroundAudioManager.duration
        })
      }
    })
  }

  updatePlayStatus(isPlaying) {
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page && typeof page.onPlayStatusChange === 'function') {
        page.onPlayStatusChange(isPlaying)
      }
    })
  }

  handleAudioEnded() {
    if (this.playMode === 'single') {
      this.replay()
    } else if (this.playMode === 'random') {
      this.playRandom()
    } else {
      this.playNext()
    }
  }

  play(audio, playList = null) {
    if (!audio || !audio.url) {
      wx.showToast({
        title: '音频地址无效',
        icon: 'none'
      })
      return
    }

    if (playList) {
      this.playList = playList
      this.currentIndex = playList.findIndex(item => item.id === audio.id)
    }

    this.currentAudio = audio
    this.backgroundAudioManager.title = audio.name || '未知音频'
    this.backgroundAudioManager.singer = audio.singer || '助眠放松'
    this.backgroundAudioManager.coverImgUrl = audio.cover || '/static/images/default-cover.png'
    this.backgroundAudioManager.src = audio.url
    
    const settings = require('./storage').getSettings()
    this.backgroundAudioManager.volume = (settings.defaultVolume || 70) / 100
  }

  pause() {
    this.backgroundAudioManager.pause()
  }

  resume() {
    if (this.currentAudio && this.backgroundAudioManager.src) {
      this.backgroundAudioManager.play()
    }
  }

  stop() {
    this.backgroundAudioManager.stop()
    this.clearTimer()
    this.currentAudio = null
  }

  replay() {
    if (this.currentAudio) {
      this.backgroundAudioManager.seek(0)
      this.backgroundAudioManager.play()
    }
  }

  playNext() {
    if (this.playList.length === 0) return
    
    this.currentIndex = (this.currentIndex + 1) % this.playList.length
    const nextAudio = this.playList[this.currentIndex]
    this.play(nextAudio)
  }

  playPrev() {
    if (this.playList.length === 0) return
    
    this.currentIndex = (this.currentIndex - 1 + this.playList.length) % this.playList.length
    const prevAudio = this.playList[this.currentIndex]
    this.play(prevAudio)
  }

  playRandom() {
    if (this.playList.length === 0) return
    
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * this.playList.length)
    } while (randomIndex === this.currentIndex && this.playList.length > 1)
    
    this.currentIndex = randomIndex
    const randomAudio = this.playList[this.currentIndex]
    this.play(randomAudio)
  }

  seek(position) {
    if (this.backgroundAudioManager.duration) {
      this.backgroundAudioManager.seek(position)
    }
  }

  setVolume(volume) {
    this.backgroundAudioManager.volume = Math.max(0, Math.min(1, volume))
  }

  setPlayMode(mode) {
    this.playMode = mode
  }

  setTimer(minutes) {
    this.clearTimer()
    
    if (minutes === -1) {
      return
    }
    
    if (minutes > 0) {
      this.timer = setTimeout(() => {
        this.fadeOut()
      }, minutes * 60 * 1000)
    }
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  fadeOut(duration = 10) {
    const settings = require('./storage').getSettings()
    const fadeDuration = (duration || settings.fadeOutDuration || 10) * 1000
    const steps = 20
    const stepDuration = fadeDuration / steps
    const currentVolume = this.backgroundAudioManager.volume
    const volumeStep = currentVolume / steps
    
    let currentStep = 0
    const fadeInterval = setInterval(() => {
      currentStep++
      const newVolume = currentVolume - (volumeStep * currentStep)
      this.backgroundAudioManager.volume = Math.max(0, newVolume)
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval)
        this.stop()
      }
    }, stepDuration)
  }

  getCurrentAudio() {
    return this.currentAudio
  }

  isPlaying() {
    return !this.backgroundAudioManager.paused
  }

  getCurrentTime() {
    return this.backgroundAudioManager.currentTime || 0
  }

  getDuration() {
    return this.backgroundAudioManager.duration || 0
  }

  addMixAudio(audio, volume = 0.5) {
    const innerAudio = wx.createInnerAudioContext()
    innerAudio.src = audio.url
    innerAudio.loop = true
    innerAudio.volume = volume
    
    this.mixAudios.push({
      id: audio.id,
      audio: innerAudio,
      volume: volume
    })
    
    return this.mixAudios.length - 1
  }

  removeMixAudio(index) {
    if (this.mixAudios[index]) {
      this.mixAudios[index].audio.stop()
      this.mixAudios[index].audio.destroy()
      this.mixAudios.splice(index, 1)
    }
  }

  setMixVolume(index, volume) {
    if (this.mixAudios[index]) {
      this.mixAudios[index].audio.volume = volume
      this.mixAudios[index].volume = volume
    }
  }

  startMixMode() {
    this.isMixMode = true
    this.mixAudios.forEach(item => {
      item.audio.play()
    })
  }

  stopMixMode() {
    this.isMixMode = false
    this.mixAudios.forEach(item => {
      item.audio.stop()
    })
  }

  clearMixAudios() {
    this.mixAudios.forEach(item => {
      item.audio.stop()
      item.audio.destroy()
    })
    this.mixAudios = []
    this.isMixMode = false
  }
}

let audioPlayerInstance = null

const getAudioPlayer = () => {
  if (!audioPlayerInstance) {
    audioPlayerInstance = new AudioPlayer()
  }
  return audioPlayerInstance
}

module.exports = {
  AudioPlayer,
  getAudioPlayer
}
