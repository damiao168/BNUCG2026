# 助眠混音小程序

一个极简的环境音混音播放器，帮助用户通过自定义环境音组合来助眠、放松、冥想。

## 项目结构

```
sleepmix/
├── app.js                      # 小程序入口
├── app.json                    # 小程序配置
├── app.wxss                    # 全局样式
├── project.config.json         # 项目配置
├── sitemap.json                # 站点地图
│
├── assets/                     # 静态资源
│   └── audio/                  # 音频文件（需自行添加）
│
├── components/                 # 自定义组件
│   ├── audio-block/            # 音频块组件
│   └── control-bar/            # 控制栏组件
│
├── pages/                      # 页面
│   ├── login/                  # 登录页面
│   └── index/                  # 主页面
│
├── utils/                      # 工具函数
│   ├── audio-track.js          # 音轨类
│   ├── mix-manager.js          # 混音管理器
│   ├── random-mixer.js         # 随机混音算法
│   └── storage.js              # 本地存储工具
│
├── config/                     # 配置文件
│   └── audio-config.js         # 音频配置
│
└── constants/                  # 常量定义
    └── constants.js            # 全局常量
```

## 使用说明

### 1. 添加音频文件

在 `assets/audio/` 目录下添加以下音频文件（MP3格式，建议3-5分钟，可无缝循环）：

- rain.mp3（雨声）
- wind.mp3（风声）
- ocean.mp3（海浪）
- fire.mp3（篝火）
- forest.mp3（森林）
- stream.mp3（溪流）
- whitenoise.mp3（白噪音）
- cricket.mp3（夜晚虫鸣）
- keyboard.mp3（键盘声）
- cafe.mp3（咖啡馆）

详细下载指南请查看：[assets/audio/README.md](./assets/audio/README.md)

### 2. 导入微信开发者工具

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `sleepmix` 目录
4. 填写 AppID（可使用测试号）

### 3. 预览和调试

- 点击"编译"按钮预览小程序
- 在模拟器或真机上测试功能

## 功能特性

- ✅ 微信登录：使用微信账号一键登录
- ✅ 自定义混音：自由选择和组合多种环境音
- ✅ 随机混音：一键生成随机混音组合
- ✅ 音量调节：每个音轨独立调节音量占比
- ✅ 无限循环：音频无限循环播放
- ✅ 配置保存：自动保存用户混音配置
- ✅ 极简设计：简洁的用户界面

## 音频素材来源建议

推荐从以下渠道获取免费环境音素材：

- [Freesound](https://freesound.org/)
- [Pixabay Music](https://pixabay.com/music/)
- [Mixkit](https://mixkit.co/free-stock-music/)
- [SoundBible](https://soundbible.com/)

注意：请确保使用的音频素材符合版权要求。

## 提审说明

### 小程序简介
助眠混音是一款极简的环境音混音播放器，帮助用户通过自定义环境音组合来助眠、放松、冥想。用户需登录后使用。

### 测试路径
1. 进入小程序，显示登录页面
2. 点击"微信一键登录"按钮授权登录
3. 登录成功后进入主页，展示音频块列表
4. 点击任意音频块的开关，启用该音轨
5. 拖动滑杆调节音量占比
6. 点击"播放"按钮，开始播放混音
7. 点击"随机混音"按钮，生成随机组合
8. 点击右上角"退出"可退出登录

### 测试账号
本小程序使用微信登录，测试时请使用微信开发者工具的测试账号功能，或使用真实微信账号登录。

## 开发规范

- 遵循微信小程序开发规范
- 使用 ES6+ 语法
- 组件化开发
- 统一代码风格

## License

MIT
