Component({
  properties: {
    name: {
      type: String,
      value: ''
    },
    size: {
      type: String,
      value: '48'
    },
    color: {
      type: String,
      value: 'primary'
    }
  },

  data: {
    iconStyle: ''
  },

  observers: {
    'name, size, color': function(name, size, color) {
      this.updateIconStyle(name, size, color)
    }
  },

  methods: {
    updateIconStyle(name, size, color) {
      const colorMap = {
        primary: 'var(--primary-color)',
        secondary: 'var(--text-secondary)',
        accent1: 'var(--accent-color-1)',
        accent2: 'var(--accent-color-2)',
        white: '#FFFFFF'
      }
      const iconColor = colorMap[color] || color
      this.setData({
        iconStyle: `width: ${size}rpx; height: ${size}rpx; --icon-color: ${iconColor};`
      })
    }
  }
})
