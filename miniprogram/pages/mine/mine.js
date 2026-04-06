Page({
  data: {
    records: [],
    totalCount: 0,
    monthCount: 0,
    weekCount: 0
  },

  onLoad() {
    this.loadRecords()
  },

  onShow() {
    this.loadRecords()
  },

  loadRecords() {
    const records = wx.getStorageSync('checkinRecords') || []
    const now = new Date()
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    monthStart.setHours(0, 0, 0, 0)
    
    const weekStart = new Date(now.getTime() - (now.getDay() * 24 * 60 * 60 * 1000))
    weekStart.setHours(0, 0, 0, 0)
    
    let monthCount = 0
    let weekCount = 0
    
    records.forEach(record => {
      const recordDate = new Date(record.timestamp)
      if (recordDate >= monthStart) {
        monthCount++
      }
      if (recordDate >= weekStart) {
        weekCount++
      }
    })
    
    this.setData({
      records: records,
      totalCount: records.length,
      monthCount: monthCount,
      weekCount: weekCount
    })
  },

  goToCheckin() {
    wx.switchTab({
      url: '/pages/checkin/checkin'
    })
  },

  clearRecords() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有打卡记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('checkinRecords')
          this.loadRecords()
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  },

  exportRecords() {
    const records = this.data.records
    if (records.length === 0) {
      wx.showToast({
        title: '暂无记录',
        icon: 'none'
      })
      return
    }
    
    let content = '日期,时间,位置,备注\n'
    records.forEach(record => {
      content += `${record.date},${record.time},"${record.address}","${record.remark || ''}"\n`
    })
    
    wx.showModal({
      title: '导出提示',
      content: '导出功能需要后端支持，当前为演示版本。',
      showCancel: false
    })
  }
})
