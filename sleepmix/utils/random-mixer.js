const COMPATIBLE_COMBINATIONS = [
  ['rain', 'forest', 'cricket'],
  ['ocean', 'wind'],
  ['fire', 'cricket', 'forest'],
  ['rain', 'fire'],
  ['stream', 'forest', 'wind'],
  ['whitenoise', 'rain'],
  ['cafe', 'keyboard'],
  ['wind', 'cricket', 'forest'],
  ['ocean', 'whitenoise'],
  ['rain', 'stream'],
  ['fire', 'wind'],
  ['forest', 'stream', 'cricket'],
  ['rain', 'ocean'],
  ['whitenoise', 'wind'],
  ['cafe', 'rain']
]

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function generateRatios(count) {
  const ratios = []
  let remaining = 100
  
  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1
    if (isLast) {
      ratios.push(remaining)
    } else {
      const maxForThis = Math.floor(remaining * 0.6)
      const minForThis = Math.floor(remaining * 0.2)
      const ratio = getRandomInt(minForThis, maxForThis)
      ratios.push(ratio)
      remaining -= ratio
    }
  }
  
  return shuffleArray(ratios)
}

function generate(audioList) {
  const trackCount = getRandomInt(2, 4)
  const combinationIndex = getRandomInt(0, COMPATIBLE_COMBINATIONS.length - 1)
  const combination = COMPATIBLE_COMBINATIONS[combinationIndex]
  
  const selectedTracks = combination.slice(0, Math.min(trackCount, combination.length))
  const ratios = generateRatios(selectedTracks.length)
  
  const tracks = audioList.map(audio => {
    const selectedIndex = selectedTracks.indexOf(audio.id)
    return {
      audioId: audio.id,
      enabled: selectedIndex > -1,
      ratio: selectedIndex > -1 ? ratios[selectedIndex] : 0
    }
  })
  
  return {
    tracks,
    isPlaying: false,
    isLooping: true,
    updatedAt: Date.now()
  }
}

module.exports = {
  generate,
  COMPATIBLE_COMBINATIONS
}
