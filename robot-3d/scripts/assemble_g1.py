#!/usr/bin/env python3
"""Assemble Unitree G1 (g1_29dof_with_hand_rev_1_0.urdf) into a single GLB.

Forward kinematics at a chosen pose, one named node per link, Z-up -> Y-up,
facing +Z. Materials assigned per URDF ('dark'/'white') so three.js can
re-map by name AND by material group.
"""
import numpy as np
import trimesh
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path("/tmp/unitree_ros/robots/g1_description")
URDF = ROOT / "g1_29dof_with_hand_rev_1_0.urdf"
OUT = Path("/tmp/g1_raw.glb")

# Pose overrides (radians). G1 zero pose has elbows flexed 90 deg (forearms
# forward); extend them so the arms hang naturally, keep a soft bend.
POSE: dict[str, float] = {
    "left_elbow_joint": 1.15,
    "right_elbow_joint": 1.15,
    "left_shoulder_roll_joint": 0.07,
    "right_shoulder_roll_joint": -0.07,
    "left_shoulder_pitch_joint": 0.12,
    "right_shoulder_pitch_joint": 0.12,
    # wrists neutral, fingers softly curled
    "left_hand_index_0_joint": 0.1, "left_hand_index_1_joint": 0.15,
    "left_hand_middle_0_joint": 0.1, "left_hand_middle_1_joint": 0.15,
    "right_hand_index_0_joint": 0.1, "right_hand_index_1_joint": 0.15,
    "right_hand_middle_0_joint": 0.1, "right_hand_middle_1_joint": 0.15,
}

def rpy_to_matrix(rpy):
    r, p, y = rpy
    return trimesh.transformations.euler_matrix(r, p, y, axes="sxyz")

def origin_matrix(el):
    M = np.eye(4)
    if el is None:
        return M
    xyz = [float(v) for v in (el.get("xyz") or "0 0 0").split()]
    rpy = [float(v) for v in (el.get("rpy") or "0 0 0").split()]
    M = rpy_to_matrix(rpy)
    M[:3, 3] = xyz
    return M

tree = ET.parse(URDF)
robot = tree.getroot()

links = {}   # name -> list of (mesh_path, visual_origin_matrix, material)
for link in robot.findall("link"):
    name = link.get("name")
    vis = []
    for v in link.findall("visual"):
        mesh_el = v.find("geometry/mesh")
        if mesh_el is None:
            continue
        fn = mesh_el.get("filename")
        mat_el = v.find("material")
        mat = mat_el.get("name") if mat_el is not None else "white"
        vis.append((ROOT / fn, origin_matrix(v.find("origin")), mat))
    links[name] = vis

joints = []  # (name, type, parent, child, origin, axis)
for j in robot.findall("joint"):
    joints.append((
        j.get("name"), j.get("type"),
        j.find("parent").get("link"), j.find("child").get("link"),
        origin_matrix(j.find("origin")),
        [float(v) for v in (j.find("axis").get("xyz").split() if j.find("axis") is not None else "0 0 1".split())],
    ))

# FK from 'pelvis' (root; 'world' joint is commented out in this URDF)
children = {}
for name, jtype, parent, child, origin, axis in joints:
    children.setdefault(parent, []).append((name, jtype, child, origin, axis))

world = {"pelvis": np.eye(4)}
stack = ["pelvis"]
while stack:
    p = stack.pop()
    for jname, jtype, child, origin, axis in children.get(p, []):
        M = world[p] @ origin
        angle = POSE.get(jname, 0.0)
        if jtype in ("revolute", "continuous") and angle != 0.0:
            M = M @ trimesh.transformations.rotation_matrix(angle, axis)
        world[child] = M
        stack.append(child)

# Root transform: Z-up -> Y-up, face +Z, feet at y=0
zup_to_yup = trimesh.transformations.rotation_matrix(-np.pi / 2, [1, 0, 0])
face_z = trimesh.transformations.rotation_matrix(-np.pi / 2, [0, 1, 0])
ROOT_M = face_z @ zup_to_yup

scene = trimesh.Scene()
counts = {}
skipped = []
for lname, vis in links.items():
    if lname not in world:
        if vis: skipped.append(lname)
        continue
    for i, (mesh_path, vorigin, mat) in enumerate(vis):
        if not mesh_path.exists():
            skipped.append(f"{lname} (missing {mesh_path.name})")
            continue
        m = trimesh.load(str(mesh_path), force="mesh")
        # bake only the visual origin; keep link frame as node transform (pivot!)
        m.apply_transform(vorigin)
        # split hard/soft edges at 35 deg for machined look
        m = trimesh.graph.smooth_shade(m, angle=np.radians(35))
        node = f"{lname}" if i == 0 else f"{lname}__{i}"
        m.visual = trimesh.visual.TextureVisuals(
            material=trimesh.visual.material.PBRMaterial(
                name=mat,
                baseColorFactor=[51, 51, 51, 255] if mat == "dark" else [179, 179, 179, 255],
                metallicFactor=1.0 if mat == "white" else 0.4,
                roughnessFactor=0.35 if mat == "white" else 0.6,
            )
        )
        scene.add_geometry(m, node_name=node, geom_name=node,
                           transform=ROOT_M @ world[lname])
        counts[node] = len(m.faces)

# stats
tot = sum(counts.values())
print(f"nodes: {len(counts)}, total tris: {tot:,}")
bounds = scene.bounds
print("bounds min/max:", np.round(bounds, 3).tolist())
if skipped:
    print("skipped:", skipped)
scene.export(str(OUT), include_normals=True)
print("wrote", OUT, f"{OUT.stat().st_size/1e6:.1f} MB")
