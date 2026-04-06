import taichi as ti
import numpy as np

# 更稳：先用 CPU 跑通
ti.init(arch=ti.cpu)

WIDTH = 800
HEIGHT = 800

MAX_CONTROL_POINTS = 100

# 调低采样数，让不开反走样时锯齿更明显，便于观察 A 键效果
BEZIER_SEGMENTS = 300
BSPLINE_SEGMENTS_PER_SPAN = 30

MAX_CURVE_POINTS = max(
    BEZIER_SEGMENTS + 1,
    (MAX_CONTROL_POINTS - 3) * BSPLINE_SEGMENTS_PER_SPAN + 1
)

pixels = ti.Vector.field(3, dtype=ti.f32, shape=(WIDTH, HEIGHT))
curve_points_field = ti.Vector.field(2, dtype=ti.f32, shape=MAX_CURVE_POINTS)

BG = ti.Vector([0.08, 0.08, 0.08])
CURVE_COLOR = ti.Vector([0.15, 0.95, 0.25])
POINT_COLOR = ti.Vector([0.95, 0.20, 0.20])
POLY_COLOR = ti.Vector([0.60, 0.60, 0.60])


def de_casteljau(points, t):
    tmp = [np.array(p, dtype=np.float32) for p in points]
    n = len(tmp)
    for r in range(1, n):
        for i in range(n - r):
            tmp[i] = (1.0 - t) * tmp[i] + t * tmp[i + 1]
    return tmp[0]


def sample_bezier(points, num_segments=BEZIER_SEGMENTS):
    if len(points) < 2:
        return np.zeros((0, 2), dtype=np.float32)

    result = np.zeros((num_segments + 1, 2), dtype=np.float32)
    for i in range(num_segments + 1):
        t = i / num_segments
        result[i] = de_casteljau(points, t)
    return result


def bspline_point(p0, p1, p2, p3, u):
    u2 = u * u
    u3 = u2 * u

    b0 = (-u3 + 3 * u2 - 3 * u + 1) / 6.0
    b1 = (3 * u3 - 6 * u2 + 4) / 6.0
    b2 = (-3 * u3 + 3 * u2 + 3 * u + 1) / 6.0
    b3 = u3 / 6.0

    return b0 * p0 + b1 * p1 + b2 * p2 + b3 * p3


def sample_bspline(points, num_per_span=BSPLINE_SEGMENTS_PER_SPAN):
    n = len(points)
    if n < 4:
        return np.zeros((0, 2), dtype=np.float32)

    result = []
    for i in range(n - 3):
        p0 = np.array(points[i], dtype=np.float32)
        p1 = np.array(points[i + 1], dtype=np.float32)
        p2 = np.array(points[i + 2], dtype=np.float32)
        p3 = np.array(points[i + 3], dtype=np.float32)

        for s in range(num_per_span):
            u = s / num_per_span
            result.append(bspline_point(p0, p1, p2, p3, u))

    result.append(
        bspline_point(
            np.array(points[-4], dtype=np.float32),
            np.array(points[-3], dtype=np.float32),
            np.array(points[-2], dtype=np.float32),
            np.array(points[-1], dtype=np.float32),
            1.0,
        )
    )
    return np.array(result, dtype=np.float32)


def upload_curve_points(curve_points):
    arr = np.full((MAX_CURVE_POINTS, 2), -10.0, dtype=np.float32)
    n = min(len(curve_points), MAX_CURVE_POINTS)
    if n > 0:
        arr[:n] = curve_points[:n]
    curve_points_field.from_numpy(arr)
    return n


@ti.kernel
def clear_pixels():
    for i, j in pixels:
        pixels[i, j] = BG


@ti.kernel
def draw_curve_kernel(n: ti.i32, antialias: ti.i32):
    for i in range(n):
        p = curve_points_field[i]
        xf = p[0] * (WIDTH - 1)
        yf = p[1] * (HEIGHT - 1)

        if antialias == 0:
            x = int(xf)
            y = int(yf)
            if 0 <= x < WIDTH and 0 <= y < HEIGHT:
                pixels[x, y] = CURVE_COLOR
        else:
            # 更明显的反走样：5x5 邻域 + 更强权重衰减
            base_x = int(xf)
            base_y = int(yf)
            for dx in ti.static(range(-2, 3)):
                for dy in ti.static(range(-2, 3)):
                    x = base_x + dx
                    y = base_y + dy
                    if 0 <= x < WIDTH and 0 <= y < HEIGHT:
                        cx = x + 0.5
                        cy = y + 0.5
                        dist = ti.sqrt((cx - xf) * (cx - xf) + (cy - yf) * (cy - yf))

                        # 权重更明显，方便观察 A 键效果
                        w = ti.max(0.0, 2.0 - dist) / 2.0
                        w = w * w

                        pixels[x, y] = pixels[x, y] * (1.0 - w) + CURVE_COLOR * w


def draw_control_polygon(gui, points):
    if len(points) >= 2:
        arr = np.array(points, dtype=np.float32)
        gui.lines(arr[:-1], arr[1:], radius=1.5, color=0x999999)


def draw_control_points(gui, points):
    if len(points) > 0:
        arr = np.array(points, dtype=np.float32)
        gui.circles(arr, radius=5, color=0xFF4444)


def main():
    gui = ti.GUI("Bezier / B-Spline Optional Tasks", res=(WIDTH, HEIGHT))

    control_points = []
    use_bspline = False
    use_antialias = False

    while gui.running:
        for e in gui.get_events(ti.GUI.PRESS):
            if e.key == ti.GUI.ESCAPE:
                gui.running = False
            elif e.key == ti.GUI.LMB:
                if len(control_points) < MAX_CONTROL_POINTS:
                    control_points.append([e.pos[0], e.pos[1]])
            elif e.key == 'c':
                control_points.clear()
            elif e.key == 'b':
                use_bspline = not use_bspline
            elif e.key == 'a':
                use_antialias = not use_antialias

        clear_pixels()

        if use_bspline:
            if len(control_points) >= 4:
                curve = sample_bspline(control_points)
                n = upload_curve_points(curve)
                draw_curve_kernel(n, 1 if use_antialias else 0)
        else:
            if len(control_points) >= 2:
                curve = sample_bezier(control_points)
                n = upload_curve_points(curve)
                draw_curve_kernel(n, 1 if use_antialias else 0)

        gui.set_image(pixels)
        draw_control_polygon(gui, control_points)
        draw_control_points(gui, control_points)

        mode_text = "Mode: B-Spline" if use_bspline else "Mode: Bezier"
        aa_text = "AntiAliasing: ON" if use_antialias else "AntiAliasing: OFF"
        aa_color = 0xFFDD44 if use_antialias else 0xFFFFFF

        gui.text(content=mode_text, pos=(0.02, 0.97), color=0xFFFFFF)
        gui.text(content=aa_text, pos=(0.02, 0.93), color=aa_color)
        gui.text(
            content="LMB:add point   C:clear   B:switch curve   A:antialias",
            pos=(0.02, 0.89),
            color=0xFFFFFF
        )

        gui.show()


if __name__ == "__main__":
    main()