Component({
  properties: {
    audioId: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    },
    pattern: {
      type: String,
      value: 'rain'
    },
    color: {
      type: String,
      value: '#8B9A7D'
    },
    enabled: {
      type: Boolean,
      value: false
    },
    ratio: {
      type: Number,
      value: 0
    }
  },

  data: {
    patternBgColor: 'rgba(139, 154, 125, 0.1)'
  },

  observers: {
    'color': function(color) {
      const rgb = this.hexToRgb(color)
      if (rgb) {
        this.setData({
          patternBgColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
        })
      }
    }
  },

  methods: {
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    },

    onToggle(e) {
      const enabled = !this.properties.enabled
      this.triggerEvent('toggle', {
        audioId: this.properties.audioId,
        enabled: enabled
      })
    },

    onSliderChanging(e) {
      if (!this.properties.enabled) return
      this.triggerEvent('ratiochange', {
        audioId: this.properties.audioId,
        ratio: e.detail.value
      })
    },

    onSliderChange(e) {
      if (!this.properties.enabled) return
      this.triggerEvent('ratiochange', {
        audioId: this.properties.audioId,
        ratio: e.detail.value
      })
    },

    onSliderTap(e) {
      // 阻止事件冒泡
    },

    onBlockTap(e) {
      // 点击整个块时的处理（可选）
    }
  }
})
