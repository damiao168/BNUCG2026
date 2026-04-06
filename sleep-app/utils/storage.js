const storage = {
  get(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(key)
      return value !== '' ? value : defaultValue
    } catch (e) {
      console.error('Storage get error:', e)
      return defaultValue
    }
  },

  set(key, value) {
    try {
      wx.setStorageSync(key, value)
      return true
    } catch (e) {
      console.error('Storage set error:', e)
      return false
    }
  },

  remove(key) {
    try {
      wx.removeStorageSync(key)
      return true
    } catch (e) {
      console.error('Storage remove error:', e)
      return false
    }
  },

  clear() {
    try {
      wx.clearStorageSync()
      return true
    } catch (e) {
      console.error('Storage clear error:', e)
      return false
    }
  },

  getFavorites() {
    return this.get('favorites', [])
  },

  addFavorite(audio) {
    const favorites = this.getFavorites()
    const index = favorites.findIndex(item => item.id === audio.id)
    if (index === -1) {
      favorites.unshift({
        ...audio,
        favoriteTime: Date.now()
      })
      this.set('favorites', favorites)
    }
    return favorites
  },

  removeFavorite(audioId) {
    const favorites = this.getFavorites()
    const index = favorites.findIndex(item => item.id === audioId)
    if (index > -1) {
      favorites.splice(index, 1)
      this.set('favorites', favorites)
    }
    return favorites
  },

  isFavorite(audioId) {
    const favorites = this.getFavorites()
    return favorites.some(item => item.id === audioId)
  },

  getRecentPlay() {
    return this.get('recentPlay', [])
  },

  addRecentPlay(audio) {
    const recent = this.getRecentPlay()
    const index = recent.findIndex(item => item.id === audio.id)
    if (index > -1) {
      recent.splice(index, 1)
    }
    recent.unshift({
      ...audio,
      playTime: Date.now()
    })
    if (recent.length > 50) {
      recent.pop()
    }
    this.set('recentPlay', recent)
    return recent
  },

  getTrainingRecords() {
    return this.get('trainingRecords', [])
  },

  addTrainingRecord(record) {
    const records = this.getTrainingRecords()
    records.unshift({
      ...record,
      time: Date.now()
    })
    if (records.length > 100) {
      records.pop()
    }
    this.set('trainingRecords', records)
    return records
  },

  getTrainingStats() {
    const records = this.getTrainingRecords()
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const weekStart = todayStart - (now.getDay() * 86400000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

    let todayDuration = 0
    let weekDuration = 0
    let monthDuration = 0
    let totalDuration = 0
    let streakDays = 0

    const daySet = new Set()
    
    records.forEach(record => {
      totalDuration += record.duration || 0
      if (record.time >= todayStart) {
        todayDuration += record.duration || 0
      }
      if (record.time >= weekStart) {
        weekDuration += record.duration || 0
      }
      if (record.time >= monthStart) {
        monthDuration += record.duration || 0
      }
      const recordDate = new Date(record.time)
      daySet.add(`${recordDate.getFullYear()}-${recordDate.getMonth()}-${recordDate.getDate()}`)
    })

    const sortedDays = Array.from(daySet).sort().reverse()
    let lastDate = new Date()
    for (let i = 0; i < sortedDays.length; i++) {
      const date = new Date(sortedDays[i])
      const diff = Math.floor((lastDate - date) / 86400000)
      if (diff <= 1) {
        streakDays++
        lastDate = date
      } else {
        break
      }
    }

    return {
      todayDuration,
      weekDuration,
      monthDuration,
      totalDuration,
      streakDays,
      totalSessions: records.length
    }
  },

  getSettings() {
    return this.get('userSettings', {
      screenAwake: true,
      fadeOutDuration: 10,
      defaultVolume: 70,
      autoPlayNext: true
    })
  },

  updateSettings(settings) {
    const current = this.getSettings()
    this.set('userSettings', { ...current, ...settings })
    return this.getSettings()
  },

  getUserInfo() {
    return this.get('userInfo', {
      avatar: '',
      nickname: '',
      gender: 'secret',
      birthday: ''
    })
  },

  saveUserInfo(userInfo) {
    this.set('userInfo', userInfo)
    return this.getUserInfo()
  }
}

module.exports = storage
