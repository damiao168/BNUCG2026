# 打卡助手微信小程序

一个简单易用的微信打卡小程序，支持定位打卡功能。

## 功能特性

- 📍 精准定位打卡
- 📝 添加打卡备注
- 📊 打卡统计（总打卡数、本月、本周）
- 📋 打卡记录查看
- 💾 本地数据存储

## 项目结构

```
miniprogram/
├── app.js                 # 小程序入口文件
├── app.json              # 小程序全局配置
├── app.wxss              # 小程序全局样式
├── sitemap.json          # 站点地图配置
├── pages/                # 页面目录
│   ├── index/           # 首页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── checkin/         # 打卡页面
│   │   ├── checkin.js
│   │   ├── checkin.json
│   │   ├── checkin.wxml
│   │   └── checkin.wxss
│   └── mine/            # 我的页面
│       ├── mine.js
│       ├── mine.json
│       ├── mine.wxml
│       └── mine.wxss
└── images/              # 图片资源目录
```

## 使用说明

### 1. 开发准备

- 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 注册微信小程序账号，获取 AppID

### 2. 导入项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择本项目的 `miniprogram` 目录
4. 填入你的小程序 AppID
5. 点击"导入"

### 3. 配置腾讯地图 Key（可选）

如果需要获取详细的地址信息，需要配置腾讯地图 API Key：

1. 访问 [腾讯位置服务](https://lbs.qq.com/) 注册并创建应用
2. 获取 WebService API Key
3. 在 `miniprogram/pages/checkin/checkin.js` 中替换 `YOUR_TENCENT_MAP_KEY`

### 4. 准备图标资源

在 `miniprogram/images/` 目录下添加以下图标文件：

- `home.png` / `home-active.png` - 首页图标
- `checkin.png` / `checkin-active.png` - 打卡图标
- `mine.png` / `mine-active.png` - 我的图标

图标尺寸建议：81px × 81px

## 主要功能说明

### 首页 (index)
- 显示今日日期
- 显示本周打卡天数
- 快捷打卡入口
- 最近打卡记录展示

### 打卡页 (checkin)
- 自动获取当前位置
- 显示当前时间（实时更新）
- 添加打卡备注
- 一键打卡

### 我的页 (mine)
- 打卡统计（总打卡、本月、本周）
- 完整打卡记录列表
- 清空记录功能
- 导出记录功能（演示版）

## 技术栈

- 微信小程序原生开发
- 本地存储 (wx.setStorageSync / wx.getStorageSync)
- 位置服务 (wx.getLocation)
- 腾讯地图逆地址解析（可选）

## 注意事项

1. **位置权限**：小程序需要获取用户位置权限，请确保在 `app.json` 和 `checkin.json` 中正确配置了权限说明
2. **API Key**：如果使用腾讯地图 API，请确保 Key 的权限设置正确
3. **数据存储**：当前版本使用本地存储，数据仅保存在用户设备上

## 许可证

MIT License
