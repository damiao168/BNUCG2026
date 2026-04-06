# 音频文件下载指南

本小程序需要10个环境音音频文件才能正常运行。请按照以下步骤下载音频文件。

## 音频文件列表

| 文件名 | 音频类型 | 推荐下载来源 |
|--------|----------|--------------|
| rain.mp3 | 雨声 | Pixabay / Freesound |
| wind.mp3 | 风声 | Pixabay / Freesound |
| ocean.mp3 | 海浪 | Pixabay / Freesound |
| fire.mp3 | 篝火 | Pixabay / Freesound |
| forest.mp3 | 森林 | Pixabay / Freesound |
| stream.mp3 | 溪流 | Pixabay / Freesound |
| whitenoise.mp3 | 白噪音 | Pixabay / Freesound |
| cricket.mp3 | 夜晚虫鸣 | Pixabay / Freesound |
| keyboard.mp3 | 键盘声 | Pixabay / Freesound |
| cafe.mp3 | 咖啡馆 | Pixabay / Freesound |

## 下载来源

### 1. Pixabay Music（推荐）
- 网址：https://pixabay.com/music/
- 特点：免费、可商用、无需注册
- 搜索关键词：rain, ocean, fire, forest, stream, white noise, nature sounds

### 2. Freesound
- 网址：https://freesound.org/
- 特点：免费音效库，需注册
- 搜索关键词：rain, wind, ocean waves, fire crackling, forest ambience

### 3. Mixkit
- 网址：https://mixkit.co/free-stock-music/
- 特点：免费、可商用

### 4. SoundBible
- 网址：https://soundbible.com/
- 特点：免费音效下载

## 下载步骤

1. 访问上述网站之一
2. 搜索对应的音频类型（如 "rain sound"）
3. 选择合适的音频文件
4. 下载 MP3 格式文件
5. 将文件重命名为对应的文件名（如 rain.mp3）
6. 将文件放入 `assets/audio/` 目录

## 音频要求

- 格式：MP3
- 采样率：44.1kHz
- 比特率：128kbps 或更高
- 时长：建议 3-5 分钟，可无缝循环
- 文件大小：建议不超过 5MB

## 注意事项

- 请确保使用的音频素材符合版权要求
- 建议使用 CC0 协议（无版权）或可商用的素材
- 音频应可无缝循环播放

## 快速下载脚本（可选）

如果你有 Node.js 环境，可以使用以下脚本批量下载：

```bash
# 安装依赖
npm install axios

# 运行下载脚本
node scripts/download-audio.js
```

## 示例音频来源

以下是一些可直接使用的音频链接（Pixabay）：

- 雨声：搜索 "Rain Sounds" on Pixabay Music
- 海浪：搜索 "Ocean Waves" on Pixabay Music
- 篝火：搜索 "Fire Crackling" on Pixabay Music
- 森林：搜索 "Forest Ambience" on Pixabay Music
