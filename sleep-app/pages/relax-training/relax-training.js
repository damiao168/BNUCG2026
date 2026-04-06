const app = getApp()
const config = require('../../utils/config')
const storage = require('../../utils/storage')

Page({
  data: {
    theme: 'light',
    categories: [],
    currentCategory: 'all',
    trainingList: []
  },

  onLoad() {
    this.syncTheme()
    this.initCategories()
    this.loadTrainingList()
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

  initCategories() {
    const categories = [
      { id: 'all', name: '全部', iconType: 'training' },
      { id: 'breathing', name: '呼吸训练', iconType: 'breath' },
      { id: 'mindfulness', name: '正念冥想', iconType: 'training' },
      { id: 'body-scan', name: '身体扫描', iconType: 'body' },
      { id: 'muscle-relax', name: '肌肉放松', iconType: 'body' },
      { id: 'emotion', name: '情绪舒缓', iconType: 'heart' }
    ]
    this.setData({ categories })
  },

  loadTrainingList() {
    const allTrainings = [
      {
        id: '1',
        name: '4-7-8呼吸法',
        iconType: 'breath',
        categoryId: 'breathing',
        duration: 5,
        level: '入门',
        description: '经典的放松呼吸法，通过特定的呼吸节奏帮助快速入睡，缓解焦虑',
        tags: ['助眠', '减压', '入门'],
        steps: [
          { name: '吸气', duration: 4, instruction: '用鼻子慢慢吸气，数4秒' },
          { name: '屏息', duration: 7, instruction: '屏住呼吸，数7秒' },
          { name: '呼气', duration: 8, instruction: '用嘴巴慢慢呼气，数8秒' }
        ]
      },
      {
        id: '2',
        name: '腹式呼吸',
        iconType: 'breath',
        categoryId: 'breathing',
        duration: 10,
        level: '入门',
        description: '深呼吸训练，帮助放松身心，改善睡眠质量',
        tags: ['放松', '入门'],
        steps: [
          { name: '吸气', duration: 4, instruction: '用鼻子吸气，感受腹部隆起' },
          { name: '屏息', duration: 2, instruction: '短暂屏息' },
          { name: '呼气', duration: 6, instruction: '用嘴巴呼气，感受腹部收缩' }
        ]
      },
      {
        id: '3',
        name: '正念冥想',
        iconType: 'training',
        categoryId: 'mindfulness',
        duration: 15,
        level: '中级',
        description: '专注于当下的冥想练习，培养觉察力，减少杂念',
        tags: ['专注', '减压', '中级'],
        steps: [
          { name: '准备', duration: 60, instruction: '找一个安静的地方，舒适地坐下' },
          { name: '专注呼吸', duration: 300, instruction: '将注意力集中在呼吸上' },
          { name: '觉察念头', duration: 300, instruction: '当念头出现时，轻轻地将注意力带回呼吸' },
          { name: '结束', duration: 60, instruction: '慢慢睁开眼睛，感受当下的平静' }
        ]
      },
      {
        id: '4',
        name: '身体扫描',
        iconType: 'body',
        categoryId: 'body-scan',
        duration: 20,
        level: '中级',
        description: '从头到脚逐步感知和放松身体每个部位，释放紧张',
        tags: ['放松', '睡眠', '中级'],
        steps: [
          { name: '头部', duration: 120, instruction: '感受头部的重量，放松头皮和面部肌肉' },
          { name: '颈部和肩膀', duration: 120, instruction: '放松颈部和肩膀，释放紧张' },
          { name: '手臂和双手', duration: 120, instruction: '感受手臂的重量，放松双手' },
          { name: '胸部和腹部', duration: 120, instruction: '感受呼吸的起伏，放松胸腹' },
          { name: '背部', duration: 120, instruction: '感受背部的支撑，放松背部肌肉' },
          { name: '臀部和双腿', duration: 120, instruction: '感受下半身的重量，放松双腿' },
          { name: '双脚', duration: 120, instruction: '感受双脚的接触，完全放松' }
        ]
      },
      {
        id: '5',
        name: '渐进式肌肉放松',
        iconType: 'body',
        categoryId: 'muscle-relax',
        duration: 20,
        level: '中级',
        description: '通过肌肉紧张与放松的对比，深度放松身体',
        tags: ['放松', '肌肉', '中级'],
        steps: [
          { name: '双手', duration: 120, instruction: '握紧拳头5秒，然后放松，感受差异' },
          { name: '手臂', duration: 120, instruction: '弯曲手臂使肌肉紧张，然后放松' },
          { name: '肩膀', duration: 120, instruction: '耸肩使肌肉紧张，然后放松' },
          { name: '面部', duration: 120, instruction: '皱眉紧闭眼睛，然后放松' },
          { name: '腹部', duration: 120, instruction: '收紧腹部肌肉，然后放松' },
          { name: '双腿', duration: 120, instruction: '伸直双腿使肌肉紧张，然后放松' },
          { name: '双脚', duration: 120, instruction: '蜷缩脚趾，然后放松' }
        ]
      },
      {
        id: '6',
        name: '情绪舒缓冥想',
        iconType: 'heart',
        categoryId: 'emotion',
        duration: 15,
        level: '中级',
        description: '通过冥想释放负面情绪，培养内心的平静与喜悦',
        tags: ['情绪', '减压', '中级'],
        steps: [
          { name: '准备', duration: 60, instruction: '找一个安静的地方，舒适地坐下' },
          { name: '觉察情绪', duration: 240, instruction: '觉察当下的情绪，不评判' },
          { name: '释放情绪', duration: 300, instruction: '想象负面情绪随着呼吸离开身体' },
          { name: '培养喜悦', duration: 180, instruction: '想象温暖的光芒充满内心' },
          { name: '结束', duration: 60, instruction: '慢慢睁开眼睛，感受内心的平静' }
        ]
      }
    ]
    
    let filtered = allTrainings
    if (this.data.currentCategory !== 'all') {
      filtered = allTrainings.filter(t => t.categoryId === this.data.currentCategory)
    }
    
    this.setData({ trainingList: filtered })
  },

  switchCategory(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ currentCategory: id })
    this.loadTrainingList()
  },

  startTraining(e) {
    const training = e.currentTarget.dataset.training
    wx.navigateTo({
      url: `/pages/training-execute/training-execute?id=${training.id}`
    })
  }
})
