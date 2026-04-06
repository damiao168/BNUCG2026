const API_BASE_URL = 'https://your-backend.com/api'

const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    
    wx.request({
      url: `${API_BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          reject(new Error('登录已过期，请重新登录'))
        } else {
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败'))
      }
    })
  })
}

const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (res.code) {
          request('/login', {
            method: 'POST',
            data: { code: res.code }
          })
          .then((data) => {
            wx.setStorageSync('token', data.token)
            if (data.userInfo) {
              wx.setStorageSync('userInfo', data.userInfo)
            }
            resolve(data)
          })
          .catch(reject)
        } else {
          reject(new Error('获取登录凭证失败：' + res.errMsg))
        }
      },
      fail: (err) => {
        reject(new Error('微信登录失败'))
      }
    })
  })
}

const checkSession = () => {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: () => {
        const token = wx.getStorageSync('token')
        if (token) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

const ensureLogin = async () => {
  const isValid = await checkSession()
  if (isValid) {
    return wx.getStorageSync('token')
  }
  return await login()
}

const isLoggedIn = () => {
  return !!wx.getStorageSync('token')
}

const getToken = () => {
  return wx.getStorageSync('token')
}

const logout = () => {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userInfo')
}

const getUserInfo = () => {
  return wx.getStorageSync('userInfo') || null
}

const updateUserInfo = (userInfo) => {
  const currentInfo = getUserInfo() || {}
  const newInfo = { ...currentInfo, ...userInfo }
  wx.setStorageSync('userInfo', newInfo)
  return newInfo
}

module.exports = {
  request,
  login,
  checkSession,
  ensureLogin,
  isLoggedIn,
  getToken,
  logout,
  getUserInfo,
  updateUserInfo
}
