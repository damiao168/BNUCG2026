Component({
  properties: {
    isPlaying: {
      type: Boolean,
      value: false
    },
    isLooping: {
      type: Boolean,
      value: true
    },
    activeCount: {
      type: Number,
      value: 0
    }
  },

  methods: {
    onPlay() {
      this.triggerEvent('play')
    },

    onRandom() {
      this.triggerEvent('random')
    },

    onLoop() {
      this.triggerEvent('loop')
    }
  }
})
