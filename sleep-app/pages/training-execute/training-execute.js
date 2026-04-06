const app = getApp()
const storage = require('../../utils/storage')
const { IntervalTimer } = require('../../utils/timer')

Page({
  data: {
    theme: 'light',
    training: {},
    currentStep: { name: '', instruction: '' },
    currentStepIndex: 0,
    totalSteps: 0,
    timerDisplay: '00:00',
    progress: 0,
    isPaused: false,
    breathStatus: 'idle',
    breathText: '准备开始',
    showComplete: false,
    completedDuration: 0
  },

  syncTheme() {
    const theme = app.getTheme()
    this.setData({ theme })
  },

  onThemeChange(theme) {
    this.setData({ theme })
  },

  onLoad(options) {
    this.syncTheme()
    this.loadTraining(options.id)
  },

  onUnload() {
    if (this.timer) {
      this.timer.stop()
    }
  },

  loadTraining(id) {
    const trainings = [
      {
        id: '1',
        name: '4-7-8呼吸法',
        duration: 5,
        steps: [
          { name: '吸气', duration: 4, instruction: '用鼻子慢慢吸气，数4秒' },
          { name: '屏息', duration: 7, instruction: '屏住呼吸，数7秒' },
          { name: '呼气', duration: 8, instruction: '用嘴巴慢慢呼气，数8秒' }
        ]
      },
      {
        id: '2',
        name: '腹式呼吸',
        duration: 10,
        steps: [
          { name: '吸气', duration: 4, instruction: '用鼻子吸气，感受腹部隆起' },
          { name: '屏息', duration: 2, instruction: '短暂屏息' },
          { name: '呼气', duration: 6, instruction: '用嘴巴呼气，感受腹部收缩' }
        ]
      },
      {
        id: '3',
        name: '正念冥想',
        duration: 15,
        steps: [
          { name: '准备', duration: 60, instruction: '找一个安静的地方，舒适地坐下' },
          { name: '专注呼吸', duration: 300, instruction: '将注意力集中在呼吸上' },
          { name: '觉察念头', duration: 300, instruction: '当念头出现时，轻轻地将注意力带回呼吸' },
          { name: '结束', duration: 60, instruction: '慢慢睁开眼睛，感受当下的平静' }
        ]
      }
    ]
    
    const training = trainings.find(t => t.id === id) || trainings[0]
    const intervals = this.buildIntervals(training.steps)
    
    this.setData({
      training,
      totalSteps: training.steps.length,
      currentStep: training.steps[0]
    })
    
    this.timer = new IntervalTimer({
      intervals: intervals,
      onIntervalChange: (index, interval) => {
        this.setData({
          currentStepIndex: index,
          currentStep: training.steps[index],
          breathStatus: this.getBreathStatus(training.steps[index].name),
          breathText: training.steps[index].name
        })
      },
      onTick: (remaining, index) => {
        this.setData({
          timerDisplay: this.formatTime(remaining),
          progress: this.calculateProgress(index, remaining, training.steps)
        })
      },
      onComplete: () => {
        this.completeTraining()
      }
    })
    
    this.startTraining()
  },

  buildIntervals(steps) {
    const intervals = []
    const repeatCount = this.calculateRepeatCount(steps)
    
    for (let i = 0; i < repeatCount; i++) {
      steps.forEach(step => {
        intervals.push({ duration: step.duration, name: step.name })
      })
    }
    
    return intervals
  },

  calculateRepeatCount(steps) {
    const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0)
    const targetDuration = this.data.training.duration * 60
    return Math.max(1, Math.ceil(targetDuration / totalDuration))
  },

  getBreathStatus(stepName) {
    if (stepName.includes('吸')) return 'inhale'
    if (stepName.includes('呼')) return 'exhale'
    return 'idle'
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  calculateProgress(stepIndex, remaining, steps) {
    let elapsed = 0
    for (let i = 0; i < stepIndex; i++) {
      elapsed += steps[i].duration
    }
    elapsed += steps[stepIndex].duration - remaining
    
    const total = steps.reduce((sum, s) => sum + s.duration, 0)
    return Math.round((elapsed / total) * 100)
  },

  startTraining() {
    this.setData({ isPaused: false })
    this.timer.start()
    
    const settings = storage.getSettings()
    if (settings.screenAwake) {
      wx.setKeepScreenOn({ keepScreenOn: true })
    }
  },

  togglePause() {
    if (this.data.isPaused) {
      this.timer.resume()
      this.setData({ isPaused: false })
    } else {
      this.timer.pause()
      this.setData({ isPaused: true })
    }
  },

  endTraining() {
    wx.showModal({
      title: '结束训练',
      content: '确定要结束当前训练吗？',
      success: (res) => {
        if (res.confirm) {
          this.completeTraining(true)
        }
      }
    })
  },

  completeTraining(early = false) {
    this.timer.stop()
    wx.setKeepScreenOn({ keepScreenOn: false })
    
    const duration = early ? 
      Math.round((this.data.training.duration * this.data.progress) / 100) :
      this.data.training.duration
    
    storage.addTrainingRecord({
      trainingId: this.data.training.id,
      trainingName: this.data.training.name,
      duration: duration * 60
    })
    
    this.setData({
      showComplete: true,
      completedDuration: duration
    })
  },

  backToList() {
    wx.navigateBack()
  },

  restartTraining() {
    this.setData({ showComplete: false })
    this.loadTraining(this.data.training.id)
  }
})
