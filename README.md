# BNUCG2026
## 课程链接

课程主页：[https://zhanghongwen.cn/cg](https://zhanghongwen.cn/cg)

##  项目结构

```
BNUCG2026/                          # 项目根目录（GitHub 仓库首页）
├── .gitignore                      # Git 忽略规则：屏蔽虚拟环境、缓存等无需上传的文件
├── pyproject.toml                  # uv 项目配置与依赖清单（记录 Taichi 等核心库）
├── uv.lock                         # uv 依赖锁定文件：保证环境可精准复现
├── README.md                       # 项目说明文档（本文档）
│
├── Work0/                          # 实验 0：万有引力粒子群仿真模块
│   ├── __init__.py                 # 标识 Work0 为 Python 可导入包
│   ├── config.py                   # 参数配置中心：统一管理粒子数量、引力强度等可调参数
│   ├── physics.py                  # GPU 核心逻辑：Taichi 并行计算、粒子物理更新规则
│   ├── main.py                     # 程序入口：GUI 渲染、鼠标交互、主循环控制
│   └── __pycache__/                # Python 运行缓存（已被 .gitignore 忽略）
│
└── Work1/                          # 实验 1：基础图形学变换与立方体渲染模块
    ├── lab2_cube.py                # 立方体渲染实现代码
    ├──lab2_transform.py            # 图形学变换（平移/旋转/缩放）实现代码
    └── lab2_cube_interp.py         # 添加旋转的插值功能
```


