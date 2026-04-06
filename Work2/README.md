````md
# 实验三：贝塞尔曲线

## 文件说明

- `lab3_bezier.py`：必做实验代码
- `lab3_xuanzuo.py`：选做实验代码
- `README.md`：实验说明

## 实验内容

本实验完成了贝塞尔曲线的交互式绘制，并实现了两个选做内容：

- 反走样
- 均匀三次 B 样条曲线

## 必做部分

必做部分实现了以下功能：

- 鼠标左键添加控制点
- 使用 De Casteljau 算法计算贝塞尔曲线
- 使用 GPU 缓冲区绘制曲线
- 绘制控制点和控制多边形
- 按 `C` 键清空画布

## 选做部分

### 1. 反走样

通过对曲线采样点周围像素进行加权混合，减弱锯齿现象，使曲线边缘更加平滑。  
按 `A` 键可以切换反走样开关。

### 2. B 样条曲线

在原有交互基础上，增加了均匀三次 B 样条曲线绘制功能。  
按 `B` 键可以切换贝塞尔曲线和 B 样条曲线模式。

## 运行方式

安装依赖：

```bash
pip install taichi numpy
````

运行必做代码：

```bash
python lab3_bezier.py
```

运行选做代码：

```bash
python lab3_xuanzuo.py
```

## 交互说明

* 左键：添加控制点
* `C`：清空画布
* `A`：切换反走样
* `B`：切换贝塞尔 / B 样条模式

## 运行结果
![ezgif-57f42a4f5d09975a](https://github.com/user-attachments/assets/1d0d8cfe-581a-4716-82f7-50f93e4ea3f7)
![ezgif-5201119546eaa1e5](https://github.com/user-attachments/assets/8a17d985-5161-4043-900a-fd85beef7cfa)



## 实验总结

本实验实现了贝塞尔曲线的基本绘制流程，理解了 De Casteljau 算法、曲线光栅化以及 CPU 与 GPU 协同工作的方式。同时通过选做内容进一步实现了反走样和平滑显示，以及 B 样条曲线的局部控制效果。

```
```
