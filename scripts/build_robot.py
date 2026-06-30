import numpy as np
import trimesh
from trimesh.transformations import rotation_matrix

scene = trimesh.Scene()

def add(name, mesh, pos=(0, 0, 0), rot=None, scale=None):
    if scale is not None:
        S = np.eye(4); S[0, 0], S[1, 1], S[2, 2] = scale
        mesh.apply_transform(S)
    if rot is not None:
        mesh.apply_transform(rot)
    mesh.apply_translation(pos)
    scene.add_geometry(mesh, node_name=name, geom_name=name)

def sphere(r, sub=3):
    return trimesh.creation.icosphere(subdivisions=sub, radius=r)

def capsule_y(length, radius):
    cyl = max(length - 2 * radius, 1e-3)
    m = trimesh.creation.capsule(height=cyl, radius=radius, count=[18, 14])
    m.apply_translation(-m.bounds.mean(axis=0))
    m.apply_transform(rotation_matrix(-np.pi / 2, [1, 0, 0]))  # Z -> Y
    return m

def box(sx, sy, sz):
    return trimesh.creation.box(extents=(sx, sy, sz))

# ---------- torso (silver paneled) ----------
add('pelvis', sphere(1), pos=(0, 0.96, 0), scale=(0.16, 0.12, 0.14))
add('spine',  capsule_y(0.40, 0.05), pos=(0, 1.20, -0.06))
add('chest',  sphere(1), pos=(0, 1.27, 0), scale=(0.205, 0.25, 0.15))
add('chest_plate', box(0.26, 0.34, 0.07), pos=(0, 1.28, 0.10))   # decorative front panel
add('neck',   capsule_y(0.09, 0.045), pos=(0, 1.50, 0))

# ---------- head: dark helmet + glowing visor ----------
add('head', sphere(1), pos=(0, 1.64, -0.01), scale=(0.125, 0.155, 0.14))
# visor: thin curved glowing band across the front of the helmet
add('visor', sphere(1), pos=(0, 1.645, 0.085), scale=(0.105, 0.055, 0.055))
# eyes -> small recessed sensor dots inside the visor (region: vision)
add('eye_L', sphere(0.014), pos=(0.038, 1.652, 0.135))
add('eye_R', sphere(0.014), pos=(-0.038, 1.652, 0.135))
# mouth -> thin vent slit under the visor (region: language)
add('mouth', box(0.055, 0.01, 0.02), pos=(0, 1.585, 0.12))

# ---------- arms (L = +x) ----------
for side, sx in (('L', 1), ('R', -1)):
    add(f'shoulder_{side}', sphere(0.075), pos=(sx * 0.245, 1.42, 0))
    add(f'arm_upper_{side}', capsule_y(0.30, 0.05), pos=(sx * 0.27, 1.25, 0))
    add(f'elbow_{side}', sphere(0.052), pos=(sx * 0.285, 1.07, 0))
    add(f'arm_lower_{side}', capsule_y(0.27, 0.044), pos=(sx * 0.30, 0.92, 0))
    add(f'hand_{side}', sphere(1), pos=(sx * 0.31, 0.74, 0.01), scale=(0.05, 0.075, 0.035))

# ---------- legs (L = +x) ----------
for side, sx in (('L', 1), ('R', -1)):
    add(f'leg_upper_{side}', capsule_y(0.42, 0.08), pos=(sx * 0.105, 0.70, 0))
    add(f'knee_{side}', sphere(0.07), pos=(sx * 0.105, 0.48, 0))
    add(f'leg_lower_{side}', capsule_y(0.40, 0.062), pos=(sx * 0.105, 0.26, 0))
    add(f'foot_{side}', sphere(1), pos=(sx * 0.105, 0.035, 0.07), scale=(0.07, 0.045, 0.18))

scene.export('/tmp/robot.glb')
print('parts:', len(scene.geometry))
print('names:', sorted(scene.geometry.keys()))
