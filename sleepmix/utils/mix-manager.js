const AudioTrack = require('./audio-track')
const audioConfig = require('../config/audio-config')

class MixManager {
  constructor() {
    this.tracks = {}
    this.isPlaying = false
    this.isLooping = true
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized) {
      return
    }

    audioConfig.forEach((config) => {
      const track = new AudioTrack(config)
      track.setLoop(this.isLooping)
      this.tracks[config.id] = track
    })

    this.isInitialized = true
  }

  ratioToVolume(ratio) {
    if (ratio <= 0) return 0
    if (ratio >= 100) return 1

    const normalizedRatio = ratio / 100
    return Math.pow(normalizedRatio, 0.5)
  }

  updateMix(mixConfig) {
    if (!this.isInitialized) {
      return
    }

    mixConfig.tracks.forEach((trackConfig) => {
      const track = this.tracks[trackConfig.audioId]
      if (!track) return

      if (trackConfig.enabled && trackConfig.ratio > 0) {
        const volume = this.ratioToVolume(trackConfig.ratio)
        track.setVolume(volume)
        if (this.isPlaying) {
          track.play()
        }
      } else {
        track.setVolume(0)
        if (track.isPlaying) {
          track.pause()
        }
      }
    })
  }

  playAll(mixConfig) {
    if (!this.isInitialized) {
      this.init()
    }

    this.isPlaying = true
    this.updateMix(mixConfig)
  }

  pauseAll() {
    this.isPlaying = false
    Object.values(this.tracks).forEach((track) => {
      track.pause()
    })
  }

  resumeAll(mixConfig) {
    this.isPlaying = true
    this.updateMix(mixConfig)
  }

  stopAll() {
    this.isPlaying = false
    Object.values(this.tracks).forEach((track) => {
      track.stop()
    })
  }

  setLoop(isLooping) {
    this.isLooping = isLooping
    Object.values(this.tracks).forEach((track) => {
      track.setLoop(isLooping)
    })
  }

  destroy() {
    Object.values(this.tracks).forEach((track) => {
      track.destroy()
    })
    this.tracks = {}
    this.isPlaying = false
    this.isInitialized = false
  }
}

const mixManager = new MixManager()
module.exports = mixManager
