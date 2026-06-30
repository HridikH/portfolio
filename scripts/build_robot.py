import numpy as np
import trimesh
from trimesh.transformations import rotation_matrix, translation_matrix, concatenate_matrices

scene = trimesh.Scene()

def add(name, mesh, pos=(0, 0, 0), rot=None, scale=None):
    if scale is not None:
        S = np.eye(4)
        S[0, 0], S[1, 1], S[2, 2] = scale
        mesh.apply_transform(S)
    if rot is not None:
        mesh.apply_transform(rot)
    mesh.apply_translation(pos)
    scene.add_geometry(mesh, node_name=name, geom_name=name)

def sphere(r, sub=2):
    return trimesh.creation.icosphere(subdivisions=sub, radius=r)

def capsule_y(length, radius):
    """Smooth rounded limb, centered at origin, aligned along +Y."""
    cyl = max(length - 2 * radius, 1e-3)
    m = trimesh.creation.capsule(height=cyl, radius=radius, count=[16, 12])
    c = m.bounds.mean(axis=0)
    m.apply_translation(-c)                 # center at origin (axis Z)
    m.apply_transform(rotation_matrix(-np.pi / 2, [1, 0, 0]))  # Z -> Y
    return m

def box(sx, sy, sz):
    return trimesh.creation.box(extents=(sx, sy, sz))

# ----- torso -----
add('pelvis', sphere(1), pos=(0, 0.97, 0), scale=(0.17, 0.13, 0.14))
add('spine',  capsule_y(0.42, 0.045), pos=(0, 1.20, -0.05))
add('chest',  sphere(1), pos=(0, 1.27, 0), scale=(0.21, 0.25, 0.16))
add('neck',   capsule_y(0.10, 0.05), pos=(0, 1.49, 0))

# ----- head + face -----
add('head', sphere(1), pos=(0, 1.63, 0), scale=(0.125, 0.145, 0.125))
add('eye_L', sphere(0.026), pos=(0.052, 1.655, 0.108))
add('eye_R', sphere(0.026), pos=(-0.052, 1.655, 0.108))
add('mouth', box(0.075, 0.016, 0.02), pos=(0, 1.58, 0.11))

# ----- arms (L = +x) -----
for side, sx in (('L', 1), ('R', -1)):
    add(f'shoulder_{side}', sphere(0.072), pos=(sx * 0.245, 1.42, 0))
    add(f'arm_upper_{side}', capsule_y(0.30, 0.052), pos=(sx * 0.27, 1.25, 0))
    add(f'elbow_{side}', sphere(0.05), pos=(sx * 0.285, 1.07, 0))
    add(f'arm_lower_{side}', capsule_y(0.28, 0.046), pos=(sx * 0.30, 0.91, 0))
    add(f'hand_{side}', sphere(1), pos=(sx * 0.31, 0.73, 0.01), scale=(0.05, 0.07, 0.035))

# ----- legs (L = +x) -----
for side, sx in (('L', 1), ('R', -1)):
    add(f'leg_upper_{side}', capsule_y(0.42, 0.078), pos=(sx * 0.105, 0.70, 0))
    add(f'knee_{side}', sphere(0.072), pos=(sx * 0.105, 0.48, 0))
    add(f'leg_lower_{side}', capsule_y(0.40, 0.062), pos=(sx * 0.105, 0.26, 0))
    add(f'foot_{side}', sphere(1), pos=(sx * 0.105, 0.035, 0.06), scale=(0.07, 0.042, 0.16))

scene.export('/sessions/funny-great-ritchie/mnt/Portfolio/public/models/robot.glb')
print('parts:', len(scene.geometry))
print('names:', sorted(scene.geometry.keys()))
