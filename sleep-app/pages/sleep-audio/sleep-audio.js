const app = getApp()
const config = require('../../utils/config')
const storage = require('../../utils/storage')
const { getAudioPlayer } = require('../../utils/audio')

Page({
  data: {
    theme: 'light',
    categories: [],
    currentCategory: 'all',
    searchText: '',
    audioList: [],
    currentAudio: null,
    showMiniPlayer: false
  },

  onLoad() {
    this.syncTheme()
    this.initCategories()
    this.loadAudioList()
  },

  onShow() {
    this.syncTheme()
    this.updateMiniPlayer()
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
      { id: 'all', name: '全部', iconType: 'music' },
      { id: 'white-noise', name: '白噪音', iconType: 'volume' },
      { id: 'nature', name: '自然声', iconType: 'nature' },
      { id: 'light-music', name: '轻音乐', iconType: 'music' },
      { id: 'asmr', name: 'ASMR', iconType: 'volume' },
      { id: 'story', name: '睡前故事', iconType: 'heart' }
    ]
    this.setData({ categories })
  },

  loadAudioList() {
    const allAudios = this.getMockAudios()
    let filtered = allAudios
    
    if (this.data.currentCategory !== 'all') {
      filtered = allAudios.filter(a => a.categoryId === this.data.currentCategory)
    }
    
    if (this.data.searchText) {
      const keyword = this.data.searchText.toLowerCase()
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(keyword) ||
        a.categoryName.toLowerCase().includes(keyword)
      )
    }
    
    filtered = filtered.map(a => ({
      ...a,
      isFavorite: storage.isFavorite(a.id)
    }))
    
    this.setData({ audioList: filtered })
  },

  getMockAudios() {
    return [
      {
        id: '1',
        name: '雨夜轻语',
        cover: 'https://picsum.photos/400/400?random=1',
        iconType: 'nature',
        duration: 1800,
        durationText: '30:00',
        categoryId: 'nature',
        categoryName: '自然声',
        url: 'https://example.com/audio/rain.mp3'
      },
      {
        id: '2',
        name: '海浪轻拍',
        cover: 'https://picsum.photos/400/400?random=2',
        iconType: 'nature',
        duration: 2400,
        durationText: '40:00',
        categoryId: 'nature',
        categoryName: '自然声',
        url: 'https://example.com/audio/ocean.mp3'
      },
      {
        id: '3',
        name: '森林晨曦',
        cover: 'https://picsum.photos/400/400?random=3',
        iconType: 'nature',
        duration: 1200,
        durationText: '20:00',
        categoryId: 'nature',
        categoryName: '自然声',
        url: 'https://example.com/audio/forest.mp3'
      },
      {
        id: '4',
        name: '篝火温暖',
        cover: 'https://picsum.photos/400/400?random=4',
        iconType: 'nature',
        duration: 3600,
        durationText: '60:00',
        categoryId: 'nature',
        categoryName: '自然声',
        url: 'https://example.com/audio/fire.mp3'
      },
      {
        id: '5',
        name: '白噪音',
        cover: 'https://picsum.photos/400/400?random=5',
        iconType: 'volume',
        duration: 3600,
        durationText: '60:00',
        categoryId: 'white-noise',
        categoryName: '白噪音',
        url: 'https://example.com/audio/white-noise.mp3'
      },
      {
        id: '6',
        name: '钢琴夜曲',
        cover: 'https://picsum.photos/400/400?random=6',
        iconType: 'music',
        duration: 2700,
        durationText: '45:00',
        categoryId: 'light-music',
        categoryName: '轻音乐',
        url: 'https://example.com/audio/piano.mp3'
      },
      {
        id: '7',
        name: '雨声ASMR',
        cover: 'https://picsum.photos/400/400?random=7',
        iconType: 'volume',
        duration: 1800,
        durationText: '30:00',
        categoryId: 'asmr',
        categoryName: 'ASMR',
        url: 'https://example.com/audio/asmr-rain.mp3'
      },
      {
        id: '8',
        name: '睡前故事',
        cover: 'https://picsum.photos/400/400?random=8',
        iconType: 'heart',
        duration: 900,
        durationText: '15:00',
        categoryId: 'story',
        categoryName: '睡前故事',
        url: 'https://example.com/audio/story.mp3'
      }
    ]
  },

  switchCategory(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ currentCategory: id })
    this.loadAudioList()
  },

  onSearch(e) {
    this.setData({ searchText: e.detail.value })
    this.loadAudioList()
  },

  playAudio(e) {
    const audio = e.currentTarget.dataset.audio
    const audioPlayer = getAudioPlayer()
    
    storage.addRecentPlay(audio)
    audioPlayer.play(audio, this.data.audioList)
    
    wx.navigateTo({
      url: `/pages/audio-player/audio-player?id=${audio.id}`
    })
  },

  toggleFavorite(e) {
    const audio = e.currentTarget.dataset.audio
    if (storage.isFavorite(audio.id)) {
      storage.removeFavorite(audio.id)
    } else {
      storage.addFavorite(audio)
    }
    this.loadAudioList()
  },

  updateMiniPlayer() {
    const audioPlayer = getAudioPlayer()
    const currentAudio = audioPlayer.getCurrentAudio()
    this.setData({
      currentAudio: currentAudio,
      showMiniPlayer: !!currentAudio
    })
  },

  goToPlayer() {
    const audioPlayer = getAudioPlayer()
    const currentAudio = audioPlayer.getCurrentAudio()
    if (currentAudio) {
      wx.navigateTo({
        url: `/pages/audio-player/audio-player?id=${currentAudio.id}`
      })
    }
  },

  closePlayer() {
    this.setData({ showMiniPlayer: false })
  }
})
