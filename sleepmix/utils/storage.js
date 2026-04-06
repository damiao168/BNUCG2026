const { STORAGE_KEYS } = require('../constants/constants')

function saveMixConfig(config) {
  try {
    wx.setStorageSync(STORAGE_KEYS.MIX_CONFIG, {
      tracks: config.tracks,
      isLooping: config.isLooping,
      updatedAt: Date.now()
    })
    return true
  } catch (e) {
    console.error('Save mix config failed:', e)
    return false
  }
}

function getMixConfig() {
  try {
    const config = wx.getStorageSync(STORAGE_KEYS.MIX_CONFIG)
    return config || null
  } catch (e) {
    console.error('Get mix config failed:', e)
    return null
  }
}

function saveLastPlayState(isPlaying) {
  try {
    wx.setStorageSync(STORAGE_KEYS.LAST_PLAY_STATE, {
      isPlaying,
      timestamp: Date.now()
    })
    return true
  } catch (e) {
    console.error('Save play state failed:', e)
    return false
  }
}

function getLastPlayState() {
  try {
    const state = wx.getStorageSync(STORAGE_KEYS.LAST_PLAY_STATE)
    return state || null
  } catch (e) {
    console.error('Get play state failed:', e)
    return null
  }
}

function clearAll() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      wx.removeStorageSync(key)
    })
    return true
  } catch (e) {
    console.error('Clear storage failed:', e)
    return false
  }
}

module.exports = {
  saveMixConfig,
  getMixConfig,
  saveLastPlayState,
  getLastPlayState,
  clearAll
}
