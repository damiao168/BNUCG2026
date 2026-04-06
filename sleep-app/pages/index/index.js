const app = getApp()
const config = require('../../utils/config')
const storage = require('../../utils/storage')

Page({
  data: {
    theme: 'light',
    timeGreeting: '',
    currentDate: '',
    recommendAudios: [],
    hotTrainings: []
  },

  onLoad() {
    this.syncTheme()
    this.initPage()
  },

  onShow() {
    this.syncTheme()
  },

  onThemeChange(theme) {
    this.setData({ theme })
  },

  syncTheme() {
    const theme = app.getTheme()
    this.setData({ theme })
  },

  toggleTheme() {
    const newTheme = app.toggleTheme()
    this.setData({ theme: newTheme })
  },

  initPage() {
    this.setGreeting()
    this.setDate()
    this.loadRecommendAudios()
    this.loadHotTrainings()
  },

  setGreeting() {
    const hour = new Date().getHours()
    let greeting = ''
    if (hour < 6) {
      greeting = '夜深了，注意休息'
    } else if (hour < 9) {
      greeting = '早上好，美好的一天'
    } else if (hour < 12) {
      greeting = '上午好，保持好心情'
    } else if (hour < 14) {
      greeting = '中午好，适当休息'
    } else if (hour < 18) {
      greeting = '下午好，继续加油'
    } else if (hour < 22) {
      greeting = '晚上好，放松身心'
    } else {
      greeting = '夜深了，早点休息'
    }
    this.setData({ timeGreeting: greeting })
  },

  setDate() {
    const now = new Date()
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    const month = now.getMonth() + 1
    const day = now.getDate()
    const weekDay = weekDays[now.getDay()]
    this.setData({
      currentDate: `${month}月${day}日 星期${weekDay}`
    })
  },

  loadRecommendAudios() {
    const audios = [
      {
        id: '1',
        name: '雨夜轻语',
        cover: 'https://picsum.photos/400/400?random=1',
        duration: 1800,
        durationText: '30:00',
        categoryName: '自然声',
        url: ''
      },
      {
        id: '2',
        name: '海浪轻拍',
        cover: 'https://picsum.photos/400/400?random=2',
        duration: 2400,
        durationText: '40:00',
        categoryName: '自然声',
        url: ''
      },
      {
        id: '3',
        name: '森林晨曦',
        cover: 'https://picsum.photos/400/400?random=3',
        duration: 1200,
        durationText: '20:00',
        categoryName: '自然声',
        url: ''
      },
      {
        id: '4',
        name: '篝火温暖',
        cover: 'https://picsum.photos/400/400?random=4',
        duration: 3600,
        durationText: '60:00',
        categoryName: '自然声',
        url: ''
      }
    ]
    this.setData({ recommendAudios: audios })
  },

  loadHotTrainings() {
    const trainings = [
      {
        id: '1',
        name: '4-7-8呼吸法',
        iconType: 'breath',
        duration: 5,
        level: '入门',
        description: '经典的放松呼吸法，帮助快速入睡',
        steps: []
      },
      {
        id: '2',
        name: '身体扫描冥想',
        iconType: 'body',
        duration: 15,
        level: '中级',
        description: '从头到脚逐步放松身体每个部位',
        steps: []
      },
      {
        id: '3',
        name: '渐进式肌肉放松',
        iconType: 'body',
        duration: 20,
        level: '中级',
        description: '通过肌肉紧张与放松缓解压力',
        steps: []
      }
    ]
    this.setData({ hotTrainings: trainings })
  },

  goToSleepAudio() {
    wx.switchTab({
      url: '/pages/sleep-audio/sleep-audio'
    })
  },

  goToRelaxTraining() {
    wx.switchTab({
      url: '/pages/relax-training/relax-training'
    })
  },

  startRandomPlay() {
    const allAudios = this.getAllAudios()
    if (allAudios.length === 0) {
      wx.showToast({
        title: '暂无音频',
        icon: 'none'
      })
      return
    }
    
    const randomIndex = Math.floor(Math.random() * allAudios.length)
    const randomAudio = allAudios[randomIndex]
    
    this.playAudioById(randomAudio.id)
  },

  getAllAudios() {
    return [
      { id: '1', name: '雨夜轻语', cover: 'https://picsum.photos/400/400?random=1', duration: 1800, durationText: '30:00', categoryName: '自然声', url: '' },
      { id: '2', name: '海浪轻拍', cover: 'https://picsum.photos/400/400?random=2', duration: 2400, durationText: '40:00', categoryName: '自然声', url: '' },
      { id: '3', name: '森林晨曦', cover: 'https://picsum.photos/400/400?random=3', duration: 1200, durationText: '20:00', categoryName: '自然声', url: '' },
      { id: '4', name: '篝火温暖', cover: 'https://picsum.photos/400/400?random=4', duration: 3600, durationText: '60:00', categoryName: '自然声', url: '' },
      { id: '5', name: '白噪音', cover: 'https://picsum.photos/400/400?random=5', duration: 3600, durationText: '60:00', categoryName: '白噪音', url: '' },
      { id: '6', name: '钢琴夜曲', cover: 'https://picsum.photos/400/400?random=6', duration: 2700, durationText: '45:00', categoryName: '轻音乐', url: '' },
      { id: '7', name: '雨声ASMR', cover: 'https://picsum.photos/400/400?random=7', duration: 1800, durationText: '30:00', categoryName: 'ASMR', url: '' },
      { id: '8', name: '睡前故事', cover: 'https://picsum.photos/400/400?random=8', duration: 900, durationText: '15:00', categoryName: '睡前故事', url: '' }
    ]
  },

  playAudioById(audioId) {
    wx.navigateTo({
      url: `/pages/audio-player/audio-player?id=${audioId}&random=1`
    })
  },

  playAudio(e) {
    const audio = e.currentTarget.dataset.audio
    wx.navigateTo({
      url: `/pages/audio-player/audio-player?id=${audio.id}`
    })
  },

  startTraining(e) {
    const training = e.currentTarget.dataset.training
    wx.navigateTo({
      url: `/pages/training-execute/training-execute?id=${training.id}`
    })
  }
})
