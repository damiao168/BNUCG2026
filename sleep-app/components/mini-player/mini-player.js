const { getAudioPlayer } = require('../../utils/audio')

Component({
  properties: {
    audio: {
      type: Object,
      value: {}
    },
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    isPlaying: false
  },

  lifetimes: {
    attached() {
      this.audioPlayer = getAudioPlayer()
      this.updatePlayStatus()
    }
  },

  methods: {
    updatePlayStatus() {
      this.setData({
        isPlaying: this.audioPlayer.isPlaying()
      })
    },

    onTap() {
      this.triggerEvent('tap')
    },

    togglePlay() {
      if (this.audioPlayer.isPlaying()) {
        this.audioPlayer.pause()
      } else {
        this.audioPlayer.resume()
      }
      this.updatePlayStatus()
    },

    onClose() {
      this.audioPlayer.stop()
      this.triggerEvent('close')
    }
  }
})
