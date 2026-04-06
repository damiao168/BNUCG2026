import taichi as ti
import math

# 初始化 Taichi，指定使用 CPU 后端
ti.init(arch=ti.cpu)

# 声明 Taichi 的 Field：立方体有 8 个顶点
vertices = ti.Vector.field(3, dtype=ti.f32, shape=8)
screen_coords = ti.Vector.field(2, dtype=ti.f32, shape=8)

@ti.func
def get_model_matrix(angle_x: ti.f32, angle_y: ti.f32, angle_z: ti.f32):
    """
    模型变换矩阵：同时绕 X、Y、Z 轴旋转 (360° 全方位)
    """
    # 角度转弧度
    rad_x = angle_x * math.pi / 180.0
    rad_y = angle_y * math.pi / 180.0
    rad_z = angle_z * math.pi / 180.0
    
    cx, sx = ti.cos(rad_x), ti.sin(rad_x)
    cy, sy = ti.cos(rad_y), ti.sin(rad_y)
    cz, sz = ti.cos(rad_z), ti.sin(rad_z)
    
    # 绕 X 轴旋转矩阵
    Rx = ti.Matrix([
        [1.0, 0.0, 0.0, 0.0],
        [0.0,  cx, -sx, 0.0],
        [0.0,  sx,  cx, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ])
    
    # 绕 Y 轴旋转矩阵
    Ry = ti.Matrix([
        [ cy, 0.0,  sy, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [-sy, 0.0,  cy, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ])
    
    # 绕 Z 轴旋转矩阵
    Rz = ti.Matrix([
        [cz, -sz, 0.0, 0.0],
        [sz,  cz, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ])
    
    # 组合旋转：顺序为 Rz * Ry * Rx
    return Rz @ Ry @ Rx

@ti.func
def get_view_matrix(eye_pos):
    """
    视图变换矩阵：将相机移动到原点
    """
    return ti.Matrix([
        [1.0, 0.0, 0.0, -eye_pos[0]],
        [0.0, 1.0, 0.0, -eye_pos[1]],
        [0.0, 0.0, 1.0, -eye_pos[2]],
        [0.0, 0.0, 0.0, 1.0]
    ])

@ti.func
def get_projection_matrix(eye_fov: ti.f32, aspect_ratio: ti.f32, zNear: ti.f32, zFar: ti.f32):
    """
    透视投影矩阵
    """
    # 视线看向 -Z 轴，实际坐标为负
    n = -zNear
    f = -zFar
    
    # 视角转化为弧度并求出 t, b, r, l
    fov_rad = eye_fov * math.pi / 180.0
    t = ti.tan(fov_rad / 2.0) * ti.abs(n)
    b = -t
    r = aspect_ratio * t
    l = -r
    
    # 1. 挤压矩阵: 透视平截头体 -> 长方体
    M_p2o = ti.Matrix([
        [n, 0.0, 0.0, 0.0],
        [0.0, n, 0.0, 0.0],
        [0.0, 0.0, n + f, -n * f],
        [0.0, 0.0, 1.0, 0.0]
    ])
    
    # 2. 正交投影矩阵: 缩放与平移至 [-1, 1]^3
    M_ortho_scale = ti.Matrix([
        [2.0 / (r - l), 0.0, 0.0, 0.0],
        [0.0, 2.0 / (t - b), 0.0, 0.0],
        [0.0, 0.0, 2.0 / (n - f), 0.0],
        [0.0, 0.0, 0.0, 1.0]
    ])
    
    M_ortho_trans = ti.Matrix([
        [1.0, 0.0, 0.0, -(r + l) / 2.0],
        [0.0, 1.0, 0.0, -(t + b) / 2.0],
        [0.0, 0.0, 1.0, -(n + f) / 2.0],
        [0.0, 0.0, 0.0, 1.0]
    ])
    
    M_ortho = M_ortho_scale @ M_ortho_trans
    
    # 返回组合矩阵
    return M_ortho @ M_p2o

@ti.kernel
def compute_transform(angle_x: ti.f32, angle_y: ti.f32, angle_z: ti.f32):
    """
    在并行架构上计算顶点的坐标变换
    """
    eye_pos = ti.Vector([0.0, 0.0, 5.0])
    model = get_model_matrix(angle_x, angle_y, angle_z)
    view = get_view_matrix(eye_pos)
    proj = get_projection_matrix(45.0, 1.0, 0.1, 50.0)
    
    # MVP 矩阵：右乘原则
    mvp = proj @ view @ model
    
    # 循环范围改为 8 个顶点
    for i in range(8):
        v = vertices[i]
        # 补全齐次坐标
        v4 = ti.Vector([v[0], v[1], v[2], 1.0])
        v_clip = mvp @ v4
        
        # 透视除法，转化为 NDC 坐标 [-1, 1]
        v_ndc = v_clip / v_clip[3]
        
        # 视口变换：映射到 GUI 的 [0, 1] x [0, 1] 空间
        screen_coords[i][0] = (v_ndc[0] + 1.0) / 2.0
        screen_coords[i][1] = (v_ndc[1] + 1.0) / 2.0

def main():
    # 初始化立方体的 8 个顶点 (中心在原点，边长为 2)
    vertices[0] = [-1.0, -1.0,  1.0]
    vertices[1] = [ 1.0, -1.0,  1.0]
    vertices[2] = [ 1.0,  1.0,  1.0]
    vertices[3] = [-1.0,  1.0,  1.0]
    vertices[4] = [-1.0, -1.0, -1.0]
    vertices[5] = [ 1.0, -1.0, -1.0]
    vertices[6] = [ 1.0,  1.0, -1.0]
    vertices[7] = [-1.0,  1.0, -1.0]
    
    # 定义立方体的 12 条边 (顶点索引对)
    edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], # 前面
        [4, 5], [5, 6], [6, 7], [7, 4], # 后面
        [0, 4], [1, 5], [2, 6], [3, 7]  # 连接前后的边
    ]
    
    # 创建 GUI 窗口
    gui = ti.GUI("360° Rotating Cube", res=(700, 700))
    
    # 三个轴的旋转角度
    angle_x = 0.0
    angle_y = 0.0
    angle_z = 0.0
    
    while gui.running:
        # 按 Esc 退出
        if gui.get_event(ti.GUI.PRESS):
            if gui.event.key == ti.GUI.ESCAPE:
                gui.running = False
        
        # 自动更新角度 (360° 持续旋转)
        angle_x += 1.0  # X 轴旋转速度
        angle_y += 1.5  # Y 轴旋转速度 (稍快一点更有层次感)
        angle_z += 0.5  # Z 轴旋转速度
        
        # 计算变换
        compute_transform(angle_x, angle_y, angle_z)
        
        # 遍历 12 条边并绘制
        for e in edges:
            a = screen_coords[e[0]]
            b = screen_coords[e[1]]
            gui.line(a, b, radius=2, color=0xFFFFFF)
        
        gui.show()

if __name__ == '__main__':
    main()