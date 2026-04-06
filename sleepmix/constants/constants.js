const STORAGE_KEYS = {
  MIX_CONFIG: 'sleepmix_config',
  LAST_PLAY_STATE: 'sleepmix_last_play',
  ANONYMOUS_ID: 'sleepmix_anonymous_id',
  USER_INFO: 'sleepmix_user_info',
  IS_LOGGED_IN: 'sleepmix_is_logged_in'
}

const COLORS = {
  PRIMARY: '#F8F6F0',
  CARD_BG: '#E8E6E0',
  ACCENT_BLUE: '#7A9E9F',
  ACCENT_GREEN: '#8B9A7D',
  ACCENT_BROWN: '#C9A87C',
  TEXT_PRIMARY: '#4A4A4A',
  TEXT_SECONDARY: '#8A8A8A',
  DISABLED: '#CCCCCC'
}

const DEFAULT_MIX_CONFIG = {
  tracks: [],
  isPlaying: false,
  isLooping: true
}

module.exports = {
  STORAGE_KEYS,
  COLORS,
  DEFAULT_MIX_CONFIG
}
