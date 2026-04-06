const app = getApp()

Page({
  data: {
    currentDate: '',
    weeklyCount: 0,
    recentRecords: []
  },

  onLoad() {
    this.initPage()
  },

  onShow() {
    this.loadRecords()
  },

  initPage() {
    const now = new Date()
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日`
    this.setData({
      currentDate: dateStr
    })
    this.loadRecords()
  },

  loadRecords() {
    const records = wx.getStorageSync('checkinRecords') || []
    const now = new Date()
    const weekStart = new Date(now.getTime() - (now.getDay() * 24 * 60 * 60 * 1000))
    weekStart.setHours(0, 0, 0, 0)
    
    let weeklyCount = 0
    records.forEach(record => {
      const recordDate = new Date(record.timestamp)
      if (recordDate >= weekStart) {
        weeklyCount++
      }
    })
    
    this.setData({
      weeklyCount: weeklyCount,
      recentRecords: records.slice(0, 5)
    })
  },

  goToCheckin() {
    wx.switchTab({
      url: '/pages/checkin/checkin'
    })
  },

  goToMine() {
    wx.switchTab({
      url: '/pages/mine/mine'
    })
  }
})
