#!/usr/bin/env python
import numpy as np
from scipy.linalg import expm


def skew_mat(omega):
    return np.array([[0, -omega[2], omega[1]],
                     [omega[2], 0, -omega[0]],
                     [-omega[1], omega[0], 0]])


PI = np.pi


def Get_MS():
    # =================== Your code starts here ====================#
    S1 = [0, 0, 1]
    S2 = [0, 1, 0]
    S3 = [0, 1, 0]
    S4 = [0, 1, 0]
    S5 = [1, 0, 0]
    S6 = [0, 1, 0]

    S = [S1, S2, S3, S4, S5, S6]
    q1 = np.array([-150, 150, 10]).reshape((3, 1))
    q2 = np.array([-150, 270, 162]).reshape((3, 1))
    q3 = np.array([94, 270, 162]).reshape((3, 1))
    q4 = np.array([307, 177, 162]).reshape((3, 1))
    q5 = np.array([307, 260, 162]).reshape((3, 1))
    q6 = np.array([390, 260, 162]).reshape((3, 1))

    Q = [q1, q2, q3, q4, q5, q6]

    zeros = np.zeros((1, 4))
    V = [-skew_mat(omega) @ q for (omega, q) in zip(S, Q)]

    S_mat = [np.block([[skew_mat(omega), v], [zeros]])
             for (omega, v) in zip(S, V)]

    R = np.array([[0, 0, 1], [-1, 0, 0], [0, -1, 0]]).T
    p = np.array([[390], [401], [215.5]])

    M = np.block([[R, p], [np.array([0, 0, 0]), 1]])
    # ==============================================================#
    return M, S_mat


def lab_fk(theta1, theta2, theta3, theta4, theta5, theta6):

    return_value = [None, None, None, None, None, None]
    print("Foward kinematics calculated: \n")

    # =================== Your code starts here ====================#
    thetas = [theta1, theta2, theta3, theta4, theta5, theta6]
    M, S = Get_MS()
    T = np.eye(4, 4)
    for i, s in enumerate(S):
        T = T @ expm(s * thetas[i])
    T = T @ M
    print(str(T) + "\n")
    # ==============================================================#

    return_value[0] = theta1 + PI
    return_value[1] = theta2
    return_value[2] = theta3
    return_value[3] = theta4 - (0.5 * PI)
    return_value[4] = theta5
    return_value[5] = theta6

    return return_value


def lab_invk(xWgrip, yWgrip, zWgrip, yaw_WgripDegree):
    print("X", xWgrip)
    print("Y", yWgrip)
    print("Z", zWgrip)
    # =================== Geometric IK (elbow-up) ====================#
    L1 = 152.0
    L3 = 244.0
    L5 = 213.0
    L6 = 83.0
    L9 = 53.5
    Y_OFFSET_J1_TO_J6 = 110.0
    Z_OFFSET_GRIP_TO_J6 = 141.0
    q1 = np.array([-150.0, 150.0, 10.0])

    x_grip = xWgrip
    y_grip = yWgrip
    z_grip = zWgrip
    print(f"Expected grip point: {x_grip:.2f}, {y_grip:.2f}, {z_grip:.2f}")
    yaw = np.radians(yaw_WgripDegree)

    x_cen = x_grip - L9 * np.cos(yaw)
    y_cen = y_grip - L9 * np.sin(yaw)
    z_cen = z_grip + Z_OFFSET_GRIP_TO_J6

    dx = x_cen - q1[0]
    dy = y_cen - q1[1]
    r_xy = np.hypot(dx, dy)
    theta1 = np.arctan2(dy, dx) - np.arcsin(
        np.clip(Y_OFFSET_J1_TO_J6 / r_xy, -1.0, 1.0))

    theta6 = np.pi / 2.0 + theta1 - yaw

    c1 = np.cos(-theta1)
    s1 = np.sin(-theta1)
    Rz_neg_theta1 = np.array([
        [c1, -s1, 0.0],
        [s1, c1, 0.0],
        [0.0, 0.0, 1.0],
    ])
    p_cen_1 = Rz_neg_theta1 @ np.array([dx, dy, z_cen - q1[2]])

    x_planar = p_cen_1[0] - L6
    z_planar = p_cen_1[2] - L1

    cos_theta3 = (x_planar**2 + z_planar**2 - L3**2 - L5**2) / (2.0 * L3 * L5)
    theta3 = np.arccos(cos_theta3)  # elbow-up

    theta2 = np.arctan2(-z_planar, x_planar) - np.arctan2(
        L5 * np.sin(theta3),
        L3 + L5 * np.cos(theta3),
    )

    theta4 = -(theta2 + theta3)
    theta5 = -np.pi / 2.0

    print(f"grip (base): {x_grip:.2f}, {y_grip:.2f}, {z_grip:.2f}")
    print(f"cen (joint6): {x_cen:.2f}, {y_cen:.2f}, {z_cen:.2f}")
    print(f"thetas (deg): "
          f"{[np.degrees(t) for t in [theta1, theta2, theta3, theta4, theta5, theta6]]}")
    dest = [theta1, theta2, theta3, theta4, theta5, theta6]
    lab_fk(theta1, theta2, theta3, theta4, theta5, theta6)
    return dest
