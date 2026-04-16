#!/usr/bin/env python

import cv2
import numpy as np
from scipy.spatial.transform import Rotation as R

# ========================= Student's code starts here =========================

c_diff = 356 - 274
r_diff = 0
y_w_diff = 100

O_r = 240
O_c = 320

u_c_w = 217.0
v_c_w = 136.0

# Params for camera calibration
theta = np.arctan2(150 - 141, 295 - 216.17)
beta = c_diff / y_w_diff
ty = (u_c_w - O_c) / beta - 30
tx = (v_c_w - O_r) / beta
R_cw = R.from_euler('z', theta, degrees=False).as_matrix()

t_vertical = np.array([[tx], [ty], [0]])

T_cw = np.block([[R_cw, t_vertical], [0, 0, 0, 1]])
T_wc = np.block([[R_cw.T, -R_cw.T @ t_vertical], [0, 0, 0, 1]])


# Function that converts image coord to world coord
def IMG2W(col, row):
    y_c = (col - O_c) / beta
    x_c = (row - O_r) / beta
    array = np.array([[x_c], [y_c], [0], [1]])
    p_w = T_wc @ array
    return p_w

# ========================= Student's code ends here ===========================


def blob_search(image_raw, color):

    # Setup SimpleBlobDetector parameters.
    params = cv2.SimpleBlobDetector_Params()

    # ========================= Student's code starts here =========================

    # Filter by Color
    params.filterByColor = False

    # Filter by Area.
    params.filterByArea = False

    # Filter by Circularity
    params.filterByCircularity = False

    # Filter by Inertia
    params.filterByInertia = False

    # Filter by Convexity
    params.filterByConvexity = False

    # ========================= Student's code ends here ===========================

    # Create a detector with the parameters
    detector = cv2.SimpleBlobDetector_create(params)

    # Convert the image into the HSV color space
    hsv_image = cv2.cvtColor(image_raw, cv2.COLOR_BGR2HSV)

    # ========================= Student's code starts here =========================

    r, g, b = (255, 50, 0) if color == "orange" else (45, 120, 30)
    bgr = np.uint8([[[b, g, r]]])
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).flatten()
    h, s, v = int(hsv[0]), int(hsv[1]), int(hsv[2])

    delta = 20
    lower = (max(0, h - delta), max(0, s - delta), max(0, v - delta))
    upper = (min(h + delta, 179), min(s + delta, 255), min(v + delta, 255))

    # Define a mask using the lower and upper bounds of the target color
    mask_image = cv2.inRange(hsv_image, lower, upper)

    # ========================= Student's code ends here ===========================

    keypoints = detector.detect(mask_image)

    # Find blob centers in the image coordinates
    blob_image_center = []
    num_blobs = len(keypoints)
    for i in range(num_blobs):
        blob_image_center.append((keypoints[i].pt[0], keypoints[i].pt[1]))

    # ========================= Student's code starts here =========================

    # Draw the keypoints on the detected block
    im_with_keypoints = cv2.drawKeypoints(image_raw, keypoints, (b, g, r))

    # ========================= Student's code ends here ===========================

    for b in blob_image_center:
        if b is not None:
            p = IMG2W(b[0], b[1])
            xw_yw = []

    if (num_blobs == 0):
        print("No block found!")
    else:
        for i in range(num_blobs):
            xw_yw.append(IMG2W(blob_image_center[i][0], blob_image_center[i][1]))

    cv2.namedWindow("Camera View")
    cv2.imshow("Camera View", image_raw)
    cv2.namedWindow("Mask View")
    cv2.imshow("Mask View", mask_image)
    cv2.namedWindow("Keypoint View")
    cv2.imshow("Keypoint View", im_with_keypoints)

    cv2.waitKey(2)

    return xw_yw
