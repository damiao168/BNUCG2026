const themes = {
  light: {
    name: 'light',
    colors: {
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
      shadowColor: 'rgba(168, 197, 232, 0.12)',
      overlayColor: 'rgba(248, 247, 252, 0.85)',
      switcherBg: 'rgba(255, 255, 255, 0.6)',
      switcherIcon: '#3A3A55'
    }
  },
  
  dark: {
    name: 'dark',
    colors: {
      primaryColor: '#A8C5E8',
      secondaryColor: '#D4C1EC',
      backgroundColor: '#1F1F2E',
      cardBackground: '#2A2A3C',
      textPrimary: '#F0F0F5',
      textSecondary: '#E0E0E8',
      textMuted: '#9A9AB0',
      successColor: '#B8E0D2',
      warningColor: '#F6E2C6',
      disabledColor: '#4A4A5C',
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      overlayColor: 'rgba(31, 31, 46, 0.9)',
      switcherBg: 'rgba(42, 42, 60, 0.8)',
      switcherIcon: '#F0F0F5'
    }
  }
}

const getTheme = (themeName) => {
  return themes[themeName] || themes.light
}

const getColors = (themeName) => {
  const theme = getTheme(themeName)
  return theme.colors
}

const getCSSVariables = (themeName) => {
  const colors = getColors(themeName)
  return {
    '--primary-color': colors.primaryColor,
    '--secondary-color': colors.secondaryColor,
    '--bg-color': colors.backgroundColor,
    '--card-bg': colors.cardBackground,
    '--text-primary': colors.textPrimary,
    '--text-secondary': colors.textSecondary,
    '--text-muted': colors.textMuted,
    '--success-color': colors.successColor,
    '--warning-color': colors.warningColor,
    '--disabled-color': colors.disabledColor,
    '--shadow-color': colors.shadowColor,
    '--overlay-color': colors.overlayColor,
    '--switcher-bg': colors.switcherBg,
    '--switcher-icon': colors.switcherIcon
  }
}

module.exports = {
  themes,
  getTheme,
  getColors,
  getCSSVariables
}
