const app = getApp()

Component({
  properties: {
    size: {
      type: Number,
      value: 80
    }
  },

  data: {
    theme: 'light',
    isAnimating: false
  },

  lifetimes: {
    attached() {
      this.setData({
        theme: app.getTheme()
      })
    }
  },

  methods: {
    toggleTheme() {
      this.setData({ isAnimating: true })
      
      const newTheme = app.toggleTheme()
      
      this.setData({
        theme: newTheme,
        isAnimating: false
      })
      
      this.triggerEvent('change', { theme: newTheme })
    }
  }
})
