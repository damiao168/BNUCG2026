Page({
  data: {
    location: null,
    remark: '',
    currentTime: '',
    checking: false
  },

  onLoad() {
    this.updateTime()
    this.getLocation()
    setInterval(() => {
      this.updateTime()
    }, 1000)
  },

  updateTime() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    this.setData({
      currentTime: `${hours}:${minutes}:${seconds}`
    })
  },

  getLocation() {
    wx.showLoading({
      title: '获取位置中...'
    })
    
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.getAddress(res.latitude, res.longitude)
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        })
        console.error('获取位置失败:', err)
      }
    })
  },

  getAddress(latitude, longitude) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${latitude},${longitude}`,
        key: 'YOUR_TENCENT_MAP_KEY'
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.status === 0) {
          this.setData({
            location: {
              latitude: latitude,
              longitude: longitude,
              address: res.data.result.address
            }
          })
        } else {
          this.setData({
            location: {
              latitude: latitude,
              longitude: longitude,
              address: '未知位置'
            }
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        this.setData({
          location: {
            latitude: latitude,
            longitude: longitude,
            address: '未知位置'
          }
        })
      }
    })
  },

  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  doCheckin() {
    if (!this.data.location) {
      wx.showToast({
        title: '请等待位置获取',
        icon: 'none'
      })
      return
    }

    this.setData({ checking: true })

    const now = new Date()
    const record = {
      id: Date.now(),
      timestamp: now.getTime(),
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
      latitude: this.data.location.latitude,
      longitude: this.data.location.longitude,
      address: this.data.location.address,
      remark: this.data.remark
    }

    const records = wx.getStorageSync('checkinRecords') || []
    records.unshift(record)
    wx.setStorageSync('checkinRecords', records)

    setTimeout(() => {
      this.setData({ checking: false, remark: '' })
      wx.showToast({
        title: '打卡成功！',
        icon: 'success',
        duration: 2000
      })
      
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 2000)
    }, 500)
  }
})
