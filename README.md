# BNUCG2026
## 课程链接

课程主页：[https://zhanghongwen.cn/cg](https://zhanghongwen.cn/cg)
# work0
# CG-Lab 图形学开发工具实验 - 万有引力粒子群仿真
## 项目简介

本实验为计算机图形学课程的入门实验，旨在通过构建现代化的 Python 工程环境，完成一个基于 GPU 加速的万有引力粒子群仿真。实验引入了高性能包管理器 `uv` 实现项目级依赖隔离，采用经典 `src` 布局规范代码结构，并结合 `Taichi` 编程语言发挥 GPU 并行计算能力，最终实现“环境搭建-逻辑解耦-GPU计算-可视化”的完整图形学开发链路。

## 项目结构

```
CG-Lab/
├── .venv/                    # uv 自动生成的虚拟环境（Git 忽略）
├── .gitignore                # Git 忽略配置
├── pyproject.toml            # uv 项目配置与依赖清单
├── README.md                 # 本说明文档
└── src/                      # 核心代码存放区（src 布局）
    └── Work0/                # 实验零专属包
        ├── __init__.py       # 标识 Python 包
        ├── config.py         # 参数配置中心
        ├── physics.py        # GPU 核心逻辑区
        └── main.py           # 程序入口与视图层
```

## 运行方式

确保终端路径位于项目根目录（`CG-Lab/`），执行以下命令：
```bash
uv run -m src.Work0.main
```
程序将编译 GPU 内核并弹出渲染窗口，移动鼠标即可与粒子群交互。

## 效果展示

### GPU 调用验证
运行程序后，观察终端输出：
- 成功调用 GPU：显示 `[Taichi] Starting on architecture: cuda/metal/vulkan/opengl`
- 退回 CPU：显示 `[Taichi] Starting on architecture: cpu`（帧率可能下降）

### 交互效果
窗口中大量粒子会受鼠标引力吸引，同时受空气阻力和边界反弹影响，形成流畅的动态效果。


