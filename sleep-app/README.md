# 助眠放松小程序

一款专注于睡眠健康的微信小程序，通过音频助眠和放松训练帮助用户改善睡眠质量。

## 功能特性

### 音频助眠
- 多维度音频分类（白噪音、自然声、轻音乐、ASMR、睡前故事、冥想引导）
- 背景音频播放，支持小程序切后台继续播放
- 播放控制（播放/暂停、上一首/下一首、进度条拖拽、音量调节）
- 循环模式切换（列表循环、单曲循环、随机播放）
- 定时关闭功能（15/30/45/60分钟、播放完当前、自定义）
- 音频混合功能，支持叠加多个背景音
- 收藏与最近播放记录

### 放松训练
- 五大训练分类（呼吸训练、正念冥想、身体扫描、渐进式肌肉放松、情绪舒缓）
- 分步引导训练，清晰的文字提示
- 呼吸动画引导
- 训练计时控制（暂停/继续/结束）
- 训练记录与统计（累计时长、连续打卡天数）

### 个人中心
- 数据统计展示
- 收藏管理
- 设置配置（屏幕常亮、默认音量、淡出时长）

## 项目结构

```
sleep-app/
├── app.js                    # 小程序入口
├── app.json                  # 全局配置
├── app.wxss                  # 全局样式
├── sitemap.json              # 站点地图
├── project.config.json       # 项目配置
├── config/                   # 配置文件
│   └── index.js              # 主题色、常量定义
├── utils/                    # 工具类
│   ├── index.js              # 工具类入口
│   ├── format.js             # 格式化工具
│   ├── storage.js            # 本地存储
│   ├── audio.js              # 音频控制
│   └── timer.js              # 计时工具
├── components/               # 通用组件
│   ├── mini-player/          # 迷你播放器
│   ├── breath-circle/        # 呼吸动画
│   ├── progress-ring/        # 进度环
│   └── audio-card/           # 音频卡片
├── pages/                    # 页面
│   ├── index/                # 首页
│   ├── sleep-audio/          # 音频助眠列表
│   ├── audio-player/         # 音频播放详情
│   ├── relax-training/       # 放松训练列表
│   ├── training-execute/     # 训练执行
│   └── profile/              # 个人中心
└── static/                   # 静态资源
    └── images/               # 图片资源
```

## 快速开始

### 1. 环境准备
- 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 注册微信小程序账号，获取 AppID

### 2. 导入项目
1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `sleep-app` 目录
4. 填入你的小程序 AppID
5. 点击"导入"

### 3. 配置修改
在 `project.config.json` 中修改 `appid` 为你的小程序 AppID

### 4. 添加静态资源
在 `static/images/` 目录下添加必要的图片资源：
- 音频封面图片
- 默认封面图片

### 5. 配置音频资源
当前项目使用模拟数据，如需对接真实音频：
1. 在 `pages/sleep-audio/sleep-audio.js` 中修改 `getMockAudios` 方法
2. 将音频 URL 替换为真实地址
3. 或对接后端 API 获取音频列表

## 技术栈

- 微信小程序原生框架
- WXML + WXSS + JavaScript
- 微信背景音频 API
- 本地存储 API

## 设计规范

### 色彩系统（莫兰迪色系）
- 主色1：#A8C5E8（柔雾浅蓝）
- 主色2：#D4C1EC（柔雾浅紫）
- 背景色：#F8F7FC（柔雾米白）
- 成功色：#B8E0D2（柔雾浅绿）
- 警告色：#F6E2C6（柔雾浅橙）

### 布局规范
- 设计基准：750rpx
- 安全边距：32rpx
- 卡片圆角：24rpx
- 按钮圆角：50rpx

## 后端接口预留

### 音频相关接口
```javascript
// 获取音频列表
GET /api/audio/list
参数：{ category: string, page: number, size: number }
返回：{ list: Audio[], total: number }

// 获取音频详情
GET /api/audio/detail
参数：{ id: string }
返回：Audio
```

### 训练相关接口
```javascript
// 获取训练列表
GET /api/training/list
参数：{ category: string }
返回：Training[]

// 上传训练记录
POST /api/training/record
参数：{ trainingId: string, duration: number }
返回：{ success: boolean }
```

### 用户相关接口
```javascript
// 获取用户统计
GET /api/user/stats
返回：{ streakDays: number, totalDuration: number, totalSessions: number }

// 同步收藏
POST /api/user/favorites
参数：{ audioIds: string[] }
返回：{ success: boolean }
```

## 核心功能修改指引

### 修改主题色
编辑 `config/index.js` 中的 `theme` 对象

### 添加新的音频分类
编辑 `config/index.js` 中的 `audioCategories` 数组

### 添加新的训练类型
编辑 `config/index.js` 中的 `trainingCategories` 数组

### 修改定时选项
编辑 `config/index.js` 中的 `timerOptions` 数组

## 注意事项

1. **音频资源**：当前使用模拟数据，需替换为真实音频 URL
2. **背景音频**：需在 `app.json` 中配置 `requiredBackgroundModes: ["audio"]`
3. **位置权限**：如需获取天气数据，需配置位置权限
4. **屏幕常亮**：训练时默认保持屏幕常亮，可在设置中关闭

## 许可证

MIT License
