# BNUCG2026
## 课程链接

课程主页：[https://zhanghongwen.cn/cg](https://zhanghongwen.cn/cg)

##  项目结构

```text
BNUCG2026/                              # 项目根目录（GitHub 仓库首页）
├── .gitignore                          # Git 忽略规则：屏蔽虚拟环境、缓存等无需上传的文件
├── pyproject.toml                      # 项目依赖与构建配置（记录 Taichi 等核心库）
├── uv.lock                             # 依赖锁定文件，保证环境可复现
├── README.md                           # 项目总说明文档
│
├── Work0/                              # 实验 0：万有引力粒子群仿真
│   ├── __init__.py                     # 标识 Work0 为 Python 包
│   ├── config.py                       # 参数配置文件：粒子数量、引力强度等
│   ├── physics.py                      # 粒子运动与物理更新逻辑
│   ├── main.py                         # 程序入口：GUI 渲染、鼠标交互、主循环控制
│   └── __pycache__/                    # Python 缓存目录（通常可忽略）
│
├── Work1/                              # 实验 1：基础图形学变换与立方体渲染
│   ├── lab2_cube.py                    # 立方体渲染实现
│   ├── lab2_transform.py               # 平移、旋转、缩放等变换实现
│   └── lab2_cube_interp.py             # 选做：插值/过渡效果实现
│
├── Work2/                              # 实验 2：贝塞尔曲线
│   ├── README.md                       # 实验 2 说明文档
│   ├── lab3_bezier.py                  # 必做：De Casteljau 算法 + 贝塞尔曲线绘制
│   └── lab3_xuanzuo.py                 # 选做：反走样 + 均匀三次 B 样条曲线
│
└── Work3/                              # 实验 3：Phong 光照模型
    ├── 3_1.py                          # 必做：Phong 光照模型基础实现
    ├── xuanzuo3.py                     # 选做：Blinn-Phong + 硬阴影实现
    └── README.md                       # 实验 3 说明文档
