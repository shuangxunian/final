"""
import cv2
import numpy as np
import matplotlib.pyplot as plt
from Stitcher import Stitcher

catL = cv2.imread('D:/project/PythonProject/pythonProject/Matching/Matching/images/4_1.jpg')  # 图片地址
catR = cv2.imread('D:/project/PythonProject/pythonProject/Matching/Matching/images/4.jpg')


stitcher = Stitcher()
result = stitcher.stitch([catL,catR], showMatches=True)

# 缩小展示
catL1 = cv2.resize(catL, (0, 0), fx=0.3, fy=0.3)
catR1 = cv2.resize(catR, (0, 0), fx=0.3, fy=0.3)
sresult = cv2.resize(result, (0, 0), fx=0.4, fy=0.4)
cv2.imshow('light', catL1)
cv2.imshow('right', catR1)
cv2.imshow('Result',sresult)

cv2.waitKey(0)
cv2.destroyAllWindows()

cv2.waitKey(0)
cv2.destroyAllWindows()
"""


import cv2
import numpy as np
import matplotlib.pyplot as plt
from Stitcher import Stitcher
import tkinter as tk
from tkinter import filedialog
from PIL import Image, ImageTk
from cut import cut


def calWeight(d, k):
    '''
    :param d: 融合重叠部分直径
    :param k: 融合计算权重参数
    :return:
    '''

    x = np.arange(-d / 2, d / 2)
    # 创建一个数组，包含从重叠区域中心向两边延伸的值。
    y = 1 / (1 + np.exp(-k * x))
    # 计算权重分布，这里使用了逻辑函数的逆，随着距离中心越远，权重逐渐减小。
    return y
    # 返回权重数组


def imgFusion(img1, img2, overlap=128, left_right=True):
    '''
    图像加权融合
    :param img1:
    :param img2:
    :param overlap: 重合长度
    :param left_right: 是否是左右融合
    :return:
    '''
    # 这里先暂时考虑平行向融合
    w = calWeight(overlap, 0.05)  # k=5 这里是超参
    row1, col1, chl1 = img1.shape
    row2, col2, chl2 = img2.shape
    img1_bak = img1
    img2_bak = img2
    if chl1 != chl2:
        print("图片拼接通道数不一致，退出")
        exit(-1)
    if left_right:
        img_new_dst = np.zeros((img1.shape[0], img1.shape[1] + img2.shape[1] - overlap, img1.shape[2]))
    else:
        img_new_dst = np.zeros((img1.shape[0] + img2.shape[0] - overlap, img1.shape[1], img1.shape[2]))
    for i in range(chl1):
        img1 = img1_bak[:, :, i]
        img2 = img2_bak[:, :, i]
        if left_right:  # 左右融合
            img_new = np.zeros((row1, col1 + col2 - overlap))
            img_new[0:row1, 0:col1] = img1  # 赋值第一张图片
            w_expand = np.tile(w, (row1, 1))  # 权重扩增
            img_new[0:row1, (col1 - overlap):col1] = \
                (1 - w_expand) * img1[0:row1, (col1 - overlap):col1] + \
                w_expand * img2[0:row2, 0:overlap]  # 重叠部分左右两个图片进行权重相加融合
            img_new[:, col1:] = img2[:, overlap:]
            img_new_dst[:, :, i] = img_new
        else:  # 上下融合
            img_new = np.zeros((row1 + row2 - overlap, col1))
            img_new[0:row1, 0:col1] = img1
            w = np.reshape(w, (overlap, 1))
            w_expand = np.tile(w, (1, col1))
            img_new[row1 - overlap:row1, 0:col1] = \
                (1 - w_expand) * img1[(row1 - overlap):row1, 0:col1] + \
                w_expand * img2[0:overlap, 0:col2]
            img_new[row1:, :] = img2[overlap:, :]  # 右侧图像赋值
            img_new_dst[:, :, i] = img_new  # 单个通道传递给多通道
    return img_new_dst


catL = cv2.imread('D:/project/PythonProject/pythonProject/Matching/Matching/images/111- (1).jpg')  # 图片1地址
catR = cv2.imread('D:/project/PythonProject/pythonProject/Matching/Matching/images/111- (2).jpg')  # 图片2地址



stitcher = Stitcher()
cut = cut()
result = stitcher.stitch([catL,catR], showMatches=True)


catL1 = cv2.resize(catL, (0, 0), fx=0.3, fy=0.3)
catR1 = cv2.resize(catR, (0, 0), fx=0.3, fy=0.3)
cv2.imshow('Left', catL1)
cv2.imshow('Right', catR1)


cv2.waitKey(0)
cv2.destroyAllWindows()
cv2.waitKey(0)
cv2.destroyAllWindows()


sresult = cv2.resize(result, (0, 0), fx=0.4, fy=0.4)
cv2.imwrite(r'.\test_new1.png', sresult)
cv2.imshow('Result1', sresult)  # 未融合前图片

cutL,cutR=cut.Cut(sresult)  # 拼接好的图片平均分成两半

# img1是左半张img2是右半张
img1= cv2.imread('left_half.jpg',cv2.IMREAD_UNCHANGED)
img2 = cv2.imread('right_half.jpg',cv2.IMREAD_UNCHANGED)



cv2.waitKey(0)
cv2.destroyAllWindows()
cv2.waitKey(0)
cv2.destroyAllWindows()


img1 = (img1 - img1.min())/img1.ptp()
img2 = (img2 - img2.min())/img2.ptp()
img_new = imgFusion(img1, img2)
img_new = np.uint16(img_new*65535)
cv2.imwrite(r'.\test_new3.png',img_new)
cv2.imshow('Result', img_new)

cv2.waitKey(0)
cv2.destroyAllWindows()

