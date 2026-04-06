const config = {
  theme: {
    primaryColor: '#A8C5E8',
    secondaryColor: '#D4C1EC',
    backgroundColor: '#F8F7FC',
    cardBackground: '#FFFFFF',
    textPrimary: '#3A3A55',
    textSecondary: '#64647F',
    textMuted: '#9A9AB0',
    successColor: '#B8E0D2',
    warningColor: '#F6E2C6',
    disabledColor: '#E0E0E8',
    shadowColor: 'rgba(168, 197, 232, 0.12)'
  },

  audioCategories: [
    { id: 'white-noise', name: '白噪音', icon: '🔊' },
    { id: 'nature', name: '自然声', icon: '🌿' },
    { id: 'light-music', name: '轻音乐', icon: '🎵' },
    { id: 'asmr', name: 'ASMR', icon: '🎧' },
    { id: 'story', name: '睡前故事', icon: '📖' },
    { id: 'meditation', name: '冥想引导', icon: '🧘' }
  ],

  trainingCategories: [
    { id: 'breathing', name: '呼吸训练', icon: '🌬️', color: '#A8C5E8' },
    { id: 'mindfulness', name: '正念冥想', icon: '🧘', color: '#D4C1EC' },
    { id: 'body-scan', name: '身体扫描', icon: '👁️', color: '#B8E0D2' },
    { id: 'muscle-relax', name: '肌肉放松', icon: '💪', color: '#F6E2C6' },
    { id: 'emotion', name: '情绪舒缓', icon: '💖', color: '#E8C5D4' }
  ],

  timerOptions: [
    { label: '15分钟', value: 15 },
    { label: '30分钟', value: 30 },
    { label: '45分钟', value: 45 },
    { label: '60分钟', value: 60 },
    { label: '播放完当前', value: -1 },
    { label: '自定义', value: 0 }
  ],

  playModes: [
    { label: '列表循环', value: 'list' },
    { label: '单曲循环', value: 'single' },
    { label: '随机播放', value: 'random' }
  ],

  defaultSettings: {
    screenAwake: true,
    fadeOutDuration: 10,
    defaultVolume: 70,
    autoPlayNext: true
  }
}

module.exports = config
