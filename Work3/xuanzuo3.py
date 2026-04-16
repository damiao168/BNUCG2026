import taichi as ti
import math

# 直接使用 Vulkan，避免 CUDA 缺失警告
ti.init(arch=ti.vulkan)

# =========================
# 基本参数
# =========================
WIDTH, HEIGHT = 960, 720
pixels = ti.Vector.field(3, dtype=ti.f32, shape=(WIDTH, HEIGHT))

EPS = 1e-4
INF = 1e8

# 摄像机
camera_pos = ti.Vector([0.0, 0.0, 5.0])

# 光源
light_pos = ti.Vector([2.0, 3.0, 4.0])
light_color = ti.Vector([1.0, 1.0, 1.0])

# 背景色（深青色）
bg_color = ti.Vector([0.03, 0.14, 0.16])

# 球体参数
sphere_center = ti.Vector([-1.2, -0.2, 0.0])
sphere_radius = 1.2
sphere_color = ti.Vector([0.8, 0.1, 0.1])

# 圆锥参数
# 题目要求：顶点在 (1.2, 1.2, 0)，底面在 y = -1.4
cone_apex = ti.Vector([1.2, 1.2, 0.0])
cone_base_y = -1.4
cone_radius = 1.2
cone_height = cone_apex.y - cone_base_y
cone_color = ti.Vector([0.6, 0.2, 0.8])

cone_k = cone_radius / cone_height
cone_k2 = cone_k * cone_k

# 视场角
FOV = math.radians(45.0)
TAN_HALF_FOV = math.tan(FOV * 0.5)


# =========================
# 工具函数
# =========================
@ti.func
def safe_normalize(v):
    n = v.norm()
    res = ti.Vector([0.0, 0.0, 0.0])
    if n >= 1e-8:
        res = v / n
    return res


@ti.func
def reflect_vec(i, n):
    return i - 2.0 * i.dot(n) * n


# =========================
# 球体求交
# =========================
@ti.func
def intersect_sphere(ray_o, ray_d):
    oc = ray_o - sphere_center
    a = ray_d.dot(ray_d)
    b = 2.0 * oc.dot(ray_d)
    c = oc.dot(oc) - sphere_radius * sphere_radius
    delta = b * b - 4.0 * a * c

    hit = 0
    t_hit = INF
    n_hit = ti.Vector([0.0, 0.0, 0.0])

    if delta >= 0.0:
        sqrt_delta = ti.sqrt(delta)
        t1 = (-b - sqrt_delta) / (2.0 * a)
        t2 = (-b + sqrt_delta) / (2.0 * a)

        t = INF
        if t1 > EPS:
            t = t1
        elif t2 > EPS:
            t = t2

        if t < INF:
            hit = 1
            t_hit = t
            p = ray_o + t * ray_d
            n_hit = safe_normalize(p - sphere_center)

    return hit, t_hit, n_hit


# =========================
# 有限圆锥求交（侧面 + 底面）
# 轴线沿 -Y 方向
# 侧面隐式方程：
# (x-ax)^2 + (z-az)^2 = k^2 * (ay-y)^2
# 其中 y ∈ [base_y, apex_y]
# =========================
@ti.func
def intersect_cone(ray_o, ray_d):
    hit = 0
    t_hit = INF
    n_hit = ti.Vector([0.0, 0.0, 0.0])

    ox = ray_o.x - cone_apex.x
    oy = ray_o.y
    oz = ray_o.z - cone_apex.z

    dx = ray_d.x
    dy = ray_d.y
    dz = ray_d.z

    alpha = cone_apex.y - oy

    A = dx * dx + dz * dz - cone_k2 * dy * dy
    B = 2.0 * (ox * dx + oz * dz + cone_k2 * alpha * dy)
    C = ox * ox + oz * oz - cone_k2 * alpha * alpha

    # ---------- 侧面 ----------
    if ti.abs(A) > 1e-8:
        delta = B * B - 4.0 * A * C
        if delta >= 0.0:
            sqrt_delta = ti.sqrt(delta)
            t1 = (-B - sqrt_delta) / (2.0 * A)
            t2 = (-B + sqrt_delta) / (2.0 * A)

            for kk in ti.static(range(2)):
                t = t1 if kk == 0 else t2
                if t > EPS and t < t_hit:
                    p = ray_o + t * ray_d
                    s = cone_apex.y - p.y
                    if 0.0 <= s <= cone_height:
                        local_x = p.x - cone_apex.x
                        local_z = p.z - cone_apex.z

                        # F = x^2 + z^2 - k^2(ay-y)^2
                        # ∇F = (2x, 2k^2(ay-y), 2z)
                        n = ti.Vector([
                            local_x,
                            cone_k2 * (cone_apex.y - p.y),
                            local_z
                        ])
                        n = safe_normalize(n)

                        hit = 1
                        t_hit = t
                        n_hit = n

    # ---------- 底面圆盘 ----------
    if ti.abs(ray_d.y) > 1e-8:
        t_base = (cone_base_y - ray_o.y) / ray_d.y
        if t_base > EPS and t_base < t_hit:
            p_base = ray_o + t_base * ray_d
            dx_base = p_base.x - cone_apex.x
            dz_base = p_base.z - cone_apex.z
            if dx_base * dx_base + dz_base * dz_base <= cone_radius * cone_radius:
                hit = 1
                t_hit = t_base
                n_hit = ti.Vector([0.0, -1.0, 0.0])

    return hit, t_hit, n_hit


# =========================
# 场景求交（深度竞争）
# obj_id: 0 无命中, 1 球体, 2 圆锥
# =========================
@ti.func
def intersect_scene(ray_o, ray_d):
    obj_id = 0
    t_min = INF
    n_min = ti.Vector([0.0, 0.0, 0.0])
    base_color = ti.Vector([0.0, 0.0, 0.0])

    hit_s, t_s, n_s = intersect_sphere(ray_o, ray_d)
    if hit_s == 1 and t_s < t_min:
        obj_id = 1
        t_min = t_s
        n_min = n_s
        base_color = sphere_color

    hit_c, t_c, n_c = intersect_cone(ray_o, ray_d)
    if hit_c == 1 and t_c < t_min:
        obj_id = 2
        t_min = t_c
        n_min = n_c
        base_color = cone_color

    return obj_id, t_min, n_min, base_color


# =========================
# 阴影检测
# =========================
@ti.func
def in_shadow(hit_point, light_position):
    to_light = light_position - hit_point
    light_dist = to_light.norm()
    shadow_dir = safe_normalize(to_light)

    shadow_origin = hit_point + shadow_dir * EPS * 10.0
    obj_id, t_min, _, _ = intersect_scene(shadow_origin, shadow_dir)

    blocked = 0
    if obj_id != 0 and t_min < light_dist - EPS:
        blocked = 1
    return blocked


# =========================
# 着色
# use_blinn = 0 -> Phong
# use_blinn = 1 -> Blinn-Phong
# use_shadow = 0/1
# =========================
@ti.func
def shade(hit_point, normal, base_color, ka, kd, ks, shininess, use_blinn, use_shadow):
    N = safe_normalize(normal)
    L = safe_normalize(light_pos - hit_point)
    V = safe_normalize(camera_pos - hit_point)

    ambient = ka * light_color * base_color
    diffuse = ti.Vector([0.0, 0.0, 0.0])
    specular = ti.Vector([0.0, 0.0, 0.0])

    shadowed = 0
    if use_shadow == 1:
        shadowed = in_shadow(hit_point, light_pos)

    if shadowed == 0:
        ndotl = ti.max(0.0, N.dot(L))
        diffuse = kd * ndotl * light_color * base_color

        if use_blinn == 0:
            # 经典 Phong
            R = safe_normalize(reflect_vec(-L, N))
            rdotv = ti.max(0.0, R.dot(V))
            specular = ks * ti.pow(rdotv, shininess) * light_color
        else:
            # Blinn-Phong
            H = safe_normalize(L + V)
            ndoth = ti.max(0.0, N.dot(H))
            specular = ks * ti.pow(ndoth, shininess) * light_color

    color = ambient + diffuse + specular
    color = ti.math.clamp(color, 0.0, 1.0)
    return color


# =========================
# 渲染
# =========================
@ti.kernel
def render(
    ka: ti.f32,
    kd: ti.f32,
    ks: ti.f32,
    shininess: ti.f32,
    use_blinn: ti.i32,
    use_shadow: ti.i32
):
    aspect = WIDTH / HEIGHT
    scale = TAN_HALF_FOV

    for i, j in pixels:
        x = (2.0 * (i + 0.5) / WIDTH - 1.0) * aspect * scale

        # 这里改成这个方向，保证画面显示时“上方”对应世界坐标中的正 y
        y = (2.0 * (j + 0.5) / HEIGHT - 1.0) * scale

        ray_o = camera_pos
        ray_d = safe_normalize(ti.Vector([x, y, -1.0]))

        obj_id, t_hit, n_hit, base_color = intersect_scene(ray_o, ray_d)

        color = bg_color
        if obj_id != 0:
            hit_point = ray_o + t_hit * ray_d
            color = shade(
                hit_point,
                n_hit,
                base_color,
                ka,
                kd,
                ks,
                shininess,
                use_blinn,
                use_shadow
            )

        pixels[i, j] = color


# =========================
# 主函数
# =========================
def main():
    window = ti.ui.Window("Phong Lighting Model - Taichi", (WIDTH, HEIGHT))
    canvas = window.get_canvas()

    ka = 0.2
    kd = 0.7
    ks = 0.5
    shininess = 32.0

    use_blinn = False
    use_shadow = False

    while window.running:
        while window.get_event(ti.ui.PRESS):
            if window.event.key == 'b' or window.event.key == 'B':
                use_blinn = not use_blinn
            elif window.event.key == 'h' or window.event.key == 'H':
                use_shadow = not use_shadow
            elif window.event.key == ti.ui.ESCAPE:
                window.running = False

        gui = window.get_gui()
        gui.begin("Control Panel", 0.02, 0.02, 0.30, 0.34)

        ka = gui.slider_float("Ka (Ambient)", ka, 0.0, 1.0)
        kd = gui.slider_float("Kd (Diffuse)", kd, 0.0, 1.0)
        ks = gui.slider_float("Ks (Specular)", ks, 0.0, 1.0)
        shininess = gui.slider_float("Shininess", shininess, 1.0, 128.0)

        gui.text("Press B : toggle Blinn-Phong")
        gui.text("Press H : toggle Hard Shadow")
        gui.text(f"Blinn-Phong : {'ON' if use_blinn else 'OFF'}")
        gui.text(f"Hard Shadow : {'ON' if use_shadow else 'OFF'}")
        gui.end()

        render(
            ka,
            kd,
            ks,
            shininess,
            1 if use_blinn else 0,
            1 if use_shadow else 0
        )

        canvas.set_image(pixels)
        window.show()


if __name__ == "__main__":
    main()