class AudioTrack {
  constructor(config) {
    this.id = config.id
    this.src = config.audioSrc
    this.context = null
    this.isReady = false
    this.isPlaying = false
    this.volume = 0
    this.loop = true
    this.pendingPlay = false
  }

  create() {
    if (this.context) {
      return
    }

    try {
      this.context = wx.createInnerAudioContext()
      this.context.src = this.src
      this.context.loop = this.loop
      this.context.volume = this.volume

      this.context.onCanplay(() => {
        this.isReady = true
        if (this.pendingPlay && this.volume > 0) {
          this.play()
        }
      })

      this.context.onPlay(() => {
        this.isPlaying = true
        this.pendingPlay = false
      })

      this.context.onPause(() => {
        this.isPlaying = false
        this.pendingPlay = false
      })

      this.context.onStop(() => {
        this.isPlaying = false
        this.pendingPlay = false
      })

      this.context.onError((err) => {
        console.error('\u97f3\u8f68 ' + this.id + ' \u52a0\u8f7d\u5931\u8d25:', err)
        this.isReady = false
        this.isPlaying = false
        this.pendingPlay = false
      })
    } catch (e) {
      console.error('\u521b\u5efa\u97f3\u8f68\u5931\u8d25:', e)
    }
  }

  setLoop(loop) {
    this.loop = loop
    if (this.context) {
      this.context.loop = loop
    }
  }

  setVolume(volume) {
    if (volume < 0 || volume > 1) {
      return
    }

    this.volume = volume
    if (this.context) {
      this.context.volume = volume
    }
  }

  play() {
    if (!this.context) {
      this.create()
    }

    if (!this.context) {
      return
    }

    if (!this.isReady) {
      this.pendingPlay = true
      return
    }

    if (!this.isPlaying) {
      try {
        this.context.play()
      } catch (e) {
        console.error('\u64ad\u653e\u97f3\u9891\u5931\u8d25:', e)
      }
    }
  }

  pause() {
    this.pendingPlay = false
    if (this.context && this.isPlaying) {
      try {
        this.context.pause()
      } catch (e) {
        console.error('\u6682\u505c\u97f3\u9891\u5931\u8d25:', e)
      }
    }
  }

  stop() {
    this.pendingPlay = false
    if (this.context) {
      try {
        this.context.stop()
        this.isPlaying = false
      } catch (e) {
        console.error('\u505c\u6b62\u97f3\u9891\u5931\u8d25:', e)
      }
    }
  }

  destroy() {
    this.pendingPlay = false
    if (this.context) {
      try {
        this.context.destroy()
      } catch (e) {
        console.error('\u9500\u6bc1\u97f3\u9891\u5931\u8d25:', e)
      }
      this.context = null
      this.isReady = false
      this.isPlaying = false
    }
  }
}

module.exports = AudioTrack
