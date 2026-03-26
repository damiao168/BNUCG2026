import math
import taichi as ti

ti.init(arch=ti.gpu)

WIDTH, HEIGHT = 900, 760
VIEWPORT_MARGIN = 0.08
CUBE_SCALE = 0.82

vertices = ti.Vector.field(3, dtype=ti.f32, shape=8)
screen_start = ti.Vector.field(2, dtype=ti.f32, shape=8)
screen_end = ti.Vector.field(2, dtype=ti.f32, shape=8)
screen_interp = ti.Vector.field(2, dtype=ti.f32, shape=8)


def translation_matrix(tx: float, ty: float, tz: float):
    return ti.Matrix([
        [1.0, 0.0, 0.0, tx],
        [0.0, 1.0, 0.0, ty],
        [0.0, 0.0, 1.0, tz],
        [0.0, 0.0, 0.0, 1.0],
    ])


def scale_matrix(sx: float, sy: float, sz: float):
    return ti.Matrix([
        [sx,  0.0, 0.0, 0.0],
        [0.0, sy,  0.0, 0.0],
        [0.0, 0.0, sz,  0.0],
        [0.0, 0.0, 0.0, 1.0],
    ])


def get_view_matrix(eye_pos):
    return ti.Matrix([
        [1.0, 0.0, 0.0, -eye_pos[0]],
        [0.0, 1.0, 0.0, -eye_pos[1]],
        [0.0, 0.0, 1.0, -eye_pos[2]],
        [0.0, 0.0, 0.0, 1.0],
    ])


def get_projection_matrix(eye_fov: float, aspect_ratio: float, z_near: float, z_far: float):
    n = -z_near
    f = -z_far

    fov_rad = math.radians(eye_fov)
    t = math.tan(fov_rad / 2.0) * abs(n)
    b = -t
    r = aspect_ratio * t
    l = -r

    m_p2o = ti.Matrix([
        [n,   0.0, 0.0,   0.0],
        [0.0, n,   0.0,   0.0],
        [0.0, 0.0, n + f, -n * f],
        [0.0, 0.0, 1.0,   0.0],
    ])

    m_ortho_trans = ti.Matrix([
        [1.0, 0.0, 0.0, -(r + l) / 2.0],
        [0.0, 1.0, 0.0, -(t + b) / 2.0],
        [0.0, 0.0, 1.0, -(n + f) / 2.0],
        [0.0, 0.0, 0.0, 1.0],
    ])

    m_ortho_scale = ti.Matrix([
        [2.0 / (r - l), 0.0, 0.0, 0.0],
        [0.0, 2.0 / (t - b), 0.0, 0.0],
        [0.0, 0.0, 2.0 / (n - f), 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ])

    return m_ortho_scale @ m_ortho_trans @ m_p2o


def normalize_quaternion(q):
    w, x, y, z = q
    norm = math.sqrt(w * w + x * x + y * y + z * z)
    return (w / norm, x / norm, y / norm, z / norm)


def euler_to_quaternion(angle_x: float, angle_y: float, angle_z: float):
    rx = math.radians(angle_x) * 0.5
    ry = math.radians(angle_y) * 0.5
    rz = math.radians(angle_z) * 0.5

    cx, sx = math.cos(rx), math.sin(rx)
    cy, sy = math.cos(ry), math.sin(ry)
    cz, sz = math.cos(rz), math.sin(rz)

    w = cx * cy * cz + sx * sy * sz
    x = sx * cy * cz - cx * sy * sz
    y = cx * sy * cz + sx * cy * sz
    z = cx * cy * sz - sx * sy * cz

    return normalize_quaternion((w, x, y, z))


def slerp(q0, q1, t: float):
    w0, x0, y0, z0 = normalize_quaternion(q0)
    w1, x1, y1, z1 = normalize_quaternion(q1)

    dot = w0 * w1 + x0 * x1 + y0 * y1 + z0 * z1

    if dot < 0.0:
        w1, x1, y1, z1 = -w1, -x1, -y1, -z1
        dot = -dot

    if dot > 0.9995:
        w = w0 + t * (w1 - w0)
        x = x0 + t * (x1 - x0)
        y = y0 + t * (y1 - y0)
        z = z0 + t * (z1 - z0)
        return normalize_quaternion((w, x, y, z))

    theta_0 = math.acos(dot)
    theta = theta_0 * t
    sin_theta = math.sin(theta)
    sin_theta_0 = math.sin(theta_0)

    s0 = math.cos(theta) - dot * sin_theta / sin_theta_0
    s1 = sin_theta / sin_theta_0

    w = s0 * w0 + s1 * w1
    x = s0 * x0 + s1 * x1
    y = s0 * y0 + s1 * y1
    z = s0 * z0 + s1 * z1

    return normalize_quaternion((w, x, y, z))


def quaternion_to_matrix(q):
    w, x, y, z = normalize_quaternion(q)

    return ti.Matrix([
        [1.0 - 2.0 * (y * y + z * z), 2.0 * (x * y - z * w),       2.0 * (x * z + y * w),       0.0],
        [2.0 * (x * y + z * w),       1.0 - 2.0 * (x * x + z * z), 2.0 * (y * z - x * w),       0.0],
        [2.0 * (x * z - y * w),       2.0 * (y * z + x * w),       1.0 - 2.0 * (x * x + y * y), 0.0],
        [0.0,                         0.0,                         0.0,                           1.0],
    ])


@ti.kernel
def compute_transform(mvp: ti.types.matrix(4, 4, ti.f32), out_coords: ti.template()):
    for i in range(8):
        v = vertices[i]
        v4 = ti.Vector([v[0], v[1], v[2], 1.0])
        v_clip = mvp @ v4
        v_ndc = v_clip / v_clip[3]

        # 给屏幕坐标加边距，避免贴边或超出
        out_coords[i][0] = VIEWPORT_MARGIN + (v_ndc[0] + 1.0) * 0.5 * (1.0 - 2.0 * VIEWPORT_MARGIN)
        out_coords[i][1] = VIEWPORT_MARGIN + (v_ndc[1] + 1.0) * 0.5 * (1.0 - 2.0 * VIEWPORT_MARGIN)


def draw_cube(gui, coords, edges, color=0xFFFFFF, radius=2):
    for a, b in edges:
        gui.line(coords[a], coords[b], radius=radius, color=color)


def main():
    cube_data = [
        [-1.0, -1.0,  1.0],
        [ 1.0, -1.0,  1.0],
        [ 1.0,  1.0,  1.0],
        [-1.0,  1.0,  1.0],
        [-1.0, -1.0, -1.0],
        [ 1.0, -1.0, -1.0],
        [ 1.0,  1.0, -1.0],
        [-1.0,  1.0, -1.0],
    ]
    for i in range(8):
        vertices[i] = cube_data[i]

    edges = [
        (0, 1), (1, 2), (2, 3), (3, 0),
        (4, 5), (5, 6), (6, 7), (7, 4),
        (0, 4), (1, 5), (2, 6), (3, 7),
    ]

    gui = ti.GUI("Lab2 Optional - Cube Rotation Interpolation", res=(WIDTH, HEIGHT))

    eye_pos = (0.0, 0.0, 8.5)
    view = get_view_matrix(eye_pos)
    proj = get_projection_matrix(50.0, WIDTH / HEIGHT, 0.1, 50.0)

    q0 = euler_to_quaternion(0.0, 0.0, 0.0)
    q1 = euler_to_quaternion(135.0, 210.0, 45.0)

    t = 0.0
    direction = 1.0
    auto_play = True

    base_scale = scale_matrix(CUBE_SCALE, CUBE_SCALE, CUBE_SCALE)

    while gui.running:
        if gui.get_event(ti.GUI.PRESS):
            if gui.event.key == ti.GUI.ESCAPE:
                gui.running = False
            elif gui.event.key == ti.GUI.SPACE:
                auto_play = not auto_play
            elif gui.event.key == "a":
                t = max(0.0, t - 0.05)
            elif gui.event.key == "d":
                t = min(1.0, t + 0.05)

        if auto_play:
            t += 0.03 * direction
            if t >= 1.0:
                t = 1.0
                direction = -1.0
            elif t <= 0.0:
                t = 0.0
                direction = 1.0

        # 调整三个立方体的位置，避免超出屏幕
        model_start = translation_matrix(-2.2, -1.75, 0.0) @ quaternion_to_matrix(q0) @ base_scale
        model_end = translation_matrix( 2.2, -1.75, 0.0) @ quaternion_to_matrix(q1) @ base_scale
        model_interp = translation_matrix(0.0, 1.45, 0.0) @ quaternion_to_matrix(slerp(q0, q1, t)) @ base_scale

        mvp_start = proj @ view @ model_start
        mvp_end = proj @ view @ model_end
        mvp_interp = proj @ view @ model_interp

        compute_transform(mvp_start, screen_start)
        compute_transform(mvp_end, screen_end)
        compute_transform(mvp_interp, screen_interp)

        gui.clear(0x081226)

        draw_cube(gui, screen_start, edges, color=0x8ED8FF, radius=2)
        draw_cube(gui, screen_end, edges, color=0x8ED8FF, radius=2)
        draw_cube(gui, screen_interp, edges, color=0xFFD166, radius=3)

        gui.text("SPACE: play/pause", pos=(0.03, 0.96), color=0xDDDDDD)
        gui.text("A/D: adjust t", pos=(0.03, 0.925), color=0xDDDDDD)
        gui.text("ESC: quit", pos=(0.03, 0.89), color=0xDDDDDD)

        gui.text("R0", pos=(0.18, 0.14), color=0xA0D8EF)
        gui.text("R1", pos=(0.77, 0.14), color=0xA0D8EF)
        gui.text(f"Rt (t={t:.2f})", pos=(0.43, 0.84), color=0xFFD166)

        gui.show()


if __name__ == "__main__":
    main()