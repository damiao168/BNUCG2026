const app = getApp()
const storage = require('../../utils/storage')

Page({
  data: {
    theme: 'light',
    avatar: '',
    nickname: '',
    nicknameLength: 0,
    gender: 'secret',
    genderOptions: ['男', '女', '保密'],
    genderIndex: 2,
    birthday: '',
    maxNicknameLength: 15,
    minNicknameLength: 2,
    hasChanged: false,
    saving: false
  },

  onLoad() {
    this.syncTheme()
    this.loadUserInfo()
  },

  syncTheme() {
    const theme = app.getTheme()
    this.setData({ theme })
  },

  onThemeChange(theme) {
    this.setData({ theme })
  },

  loadUserInfo() {
    const userInfo = storage.getUserInfo()
    const today = new Date()
    const defaultBirthday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    
    let genderIndex = 2
    if (userInfo.gender === 'male') genderIndex = 0
    else if (userInfo.gender === 'female') genderIndex = 1
    
    this.setData({
      avatar: userInfo.avatar || '',
      nickname: userInfo.nickname || '',
      nicknameLength: (userInfo.nickname || '').length,
      gender: userInfo.gender || 'secret',
      genderIndex: genderIndex,
      birthday: userInfo.birthday || defaultBirthday
    })
  },

  chooseAvatar() {
    const that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath
        const fileSize = res.tempFiles[0].size
        
        if (fileSize > 2 * 1024 * 1024) {
          wx.showToast({
            title: '图片不能超过2MB',
            icon: 'none'
          })
          return
        }
        
        that.setData({
          avatar: tempFilePath,
          hasChanged: true
        })
      }
    })
  },

  onNicknameInput(e) {
    const value = e.detail.value
    const length = value.length
    
    if (length > this.data.maxNicknameLength) {
      return {
        value: value.substring(0, this.data.maxNicknameLength)
      }
    }
    
    this.setData({
      nickname: value,
      nicknameLength: length,
      hasChanged: true
    })
  },

  onGenderChange(e) {
    const index = parseInt(e.detail.value)
    const genderMap = ['male', 'female', 'secret']
    
    this.setData({
      genderIndex: index,
      gender: genderMap[index],
      hasChanged: true
    })
  },

  onBirthdayChange(e) {
    this.setData({
      birthday: e.detail.value,
      hasChanged: true
    })
  },

  validateForm() {
    if (!this.data.avatar) {
      wx.showToast({
        title: '请上传头像',
        icon: 'none'
      })
      return false
    }
    
    if (this.data.nicknameLength < this.data.minNicknameLength) {
      wx.showToast({
        title: `昵称至少${this.data.minNicknameLength}个字符`,
        icon: 'none'
      })
      return false
    }
    
    return true
  },

  async saveUserInfo() {
    if (!this.validateForm()) return
    
    this.setData({ saving: true })
    
    try {
      const userInfo = {
        avatar: this.data.avatar,
        nickname: this.data.nickname,
        gender: this.data.gender,
        birthday: this.data.birthday,
        updateTime: new Date().getTime()
      }
      
      storage.saveUserInfo(userInfo)
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
      
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ saving: false })
    }
  },

  onCancel() {
    if (this.data.hasChanged) {
      wx.showModal({
        title: '提示',
        content: '是否放弃修改？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack()
          }
        }
      })
    } else {
      wx.navigateBack()
    }
  }
})
