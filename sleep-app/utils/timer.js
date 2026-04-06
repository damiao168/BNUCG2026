class Timer {
  constructor(options = {}) {
    this.duration = options.duration || 0
    this.onTick = options.onTick || (() => {})
    this.onComplete = options.onComplete || (() => {})
    this.interval = null
    this.remaining = this.duration
    this.isPaused = false
  }

  start() {
    if (this.interval) return
    
    this.isPaused = false
    this.interval = setInterval(() => {
      if (!this.isPaused) {
        this.remaining--
        this.onTick(this.remaining)
        
        if (this.remaining <= 0) {
          this.stop()
          this.onComplete()
        }
      }
    }, 1000)
  }

  pause() {
    this.isPaused = true
  }

  resume() {
    this.isPaused = false
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.remaining = this.duration
    this.isPaused = false
  }

  reset(duration) {
    this.stop()
    this.duration = duration
    this.remaining = duration
  }

  getRemaining() {
    return this.remaining
  }

  getProgress() {
    if (this.duration === 0) return 0
    return (this.duration - this.remaining) / this.duration
  }
}

class CountdownTimer {
  constructor(options = {}) {
    this.totalSeconds = options.totalSeconds || 0
    this.onTick = options.onTick || (() => {})
    this.onComplete = options.onComplete || (() => {})
    this.timer = null
    this.remaining = this.totalSeconds
    this.isRunning = false
  }

  start() {
    if (this.isRunning) return
    
    this.isRunning = true
    this.timer = setInterval(() => {
      this.remaining--
      this.onTick(this.remaining)
      
      if (this.remaining <= 0) {
        this.stop()
        this.onComplete()
      }
    }, 1000)
  }

  pause() {
    this.isRunning = false
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  resume() {
    if (!this.isRunning && this.remaining > 0) {
      this.start()
    }
  }

  stop() {
    this.isRunning = false
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  reset(seconds) {
    this.stop()
    this.totalSeconds = seconds
    this.remaining = seconds
  }

  getFormattedTime() {
    const mins = Math.floor(this.remaining / 60)
    const secs = this.remaining % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

class IntervalTimer {
  constructor(options = {}) {
    this.intervals = options.intervals || []
    this.currentIntervalIndex = 0
    this.onIntervalChange = options.onIntervalChange || (() => {})
    this.onTick = options.onTick || (() => {})
    this.onComplete = options.onComplete || (() => {})
    this.timer = null
    this.remaining = 0
    this.isRunning = false
  }

  start() {
    if (this.intervals.length === 0) return
    
    this.currentIntervalIndex = 0
    this.startInterval()
  }

  startInterval() {
    if (this.currentIntervalIndex >= this.intervals.length) {
      this.stop()
      this.onComplete()
      return
    }
    
    const interval = this.intervals[this.currentIntervalIndex]
    this.remaining = interval.duration
    this.onIntervalChange(this.currentIntervalIndex, interval)
    
    this.isRunning = true
    this.timer = setInterval(() => {
      this.remaining--
      this.onTick(this.remaining, this.currentIntervalIndex)
      
      if (this.remaining <= 0) {
        clearInterval(this.timer)
        this.currentIntervalIndex++
        this.startInterval()
      }
    }, 1000)
  }

  pause() {
    this.isRunning = false
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  resume() {
    if (!this.isRunning && this.remaining > 0) {
      this.isRunning = true
      this.timer = setInterval(() => {
        this.remaining--
        this.onTick(this.remaining, this.currentIntervalIndex)
        
        if (this.remaining <= 0) {
          clearInterval(this.timer)
          this.currentIntervalIndex++
          this.startInterval()
        }
      }, 1000)
    }
  }

  stop() {
    this.isRunning = false
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.currentIntervalIndex = 0
    this.remaining = 0
  }
}

module.exports = {
  Timer,
  CountdownTimer,
  IntervalTimer
}
