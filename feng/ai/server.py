from flask import Flask, request
from flask_cors import CORS
import requests
import cv2
import numpy as np
import matplotlib.pyplot as plt
from Stitcher import Stitcher
import tkinter as tk
from tkinter import filedialog
from PIL import Image, ImageTk
from cut import cut
import oss2
import time

accessKeyId = ''
accessKeySecret = ''

def download_image(url, save_path):
    response = requests.get(url, stream=True)
    response.raise_for_status()

    with open(save_path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)


# class Cut:
#     def cut(self, img):
#         height, width = img.shape[:2]
#         left_half = img[:, :width // 2]
#         right_half = img[:, width // 2:]

#         # Display cropped image
#         # 保存在包下
#         cv2.imwrite('left_half.jpg', left_half)
#         cv2.imwrite('right_half.jpg', right_half)
#         return (left_half, right_half)


class Stitcher:

    def stitch(self, images, ratio=0.75, reprojThresh=4.0, showMatches=False):
        """
        :param images: 要拼接的图像列表。
        :param ratio: 用于特征点匹配的阈值比率。
        :param reprojThresh:  RANSAC算法中用于判断离群值的重投影误差阈值。
        :param showMatches: 指示是否显示特征点匹配的可视化结果。
        :return:result
        """
        (imageB, imageA) = images

        # 特征点提取
        (kpsA, featureA) = self.detectAndDescrib(imageA)
        (kpsB, featureB) = self.detectAndDescrib(imageB)

        M = self.matchKeypoints(kpsA, kpsB, featureA, featureB, ratio, reprojThresh)
        # 无匹配点
        if M is None:
            return None
        # H是3*3视角变换矩阵
        # matches是保存匹配点的信息
        # statues标记匹配点的状态
        (matches, H, status) = M
        # M = cv2.getAffineTransform(src, np.array([[[0, 0]], [[0, 10]], [[10, 10]]], dtype=np.float32))
        # dst = cv2.perspectiveTransform(src, M)

        # 将图片A进行视角变换，
        result = cv2.warpPerspective(imageA, H, (imageA.shape[1] + imageB.shape[1], imageA.shape[0]))
        result1 = cv2.resize(result, (0, 0), fx=0.3, fy=0.3)
        # self.cv_show('result', result1) # 显示视角变换之后的图片

        # 检测是否需要显示图片最最左端
        result[0:imageB.shape[0], 0:imageB.shape[1]] = imageB
        # self.cv_show('result', result) # 显示左端图片（大图）

        # 检查是否需要显示图像匹配
        # vis = self.bf_match(imageA,imageB,kpsA,kpsB,featureA,featureB)

        return result

    def detectAndDescrib(self, image):
        # 转灰度图

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # 建立sift生成器
        descriptor = cv2.SIFT_create()
        # 检测SIFT特征点，并计算描述子
        (kps, feature) = descriptor.detectAndCompute(image, None)

        kps = np.float32([kp.pt for kp in kps])

        return (kps, feature)

    def bf_match(self, imageA, imageB, kpsA, kpsB, featureA, featureB):

        # 创建BFMatcher实例
        bf = cv2.BFMatcher()

        # 获得最佳匹配
        matches = bf.knnMatch(featureA, featureB, k=2)
        good = []
        for m, n in matches:
            if m.distance < 0.75 * n.distance:
                good.append([m])
            # 绘制匹配结果
        AllmatchK = cv2.drawMatchesKnn(self, imageA, kpsA, imageB, kpsB, good, None, flags=2)

    def matchKeypoints(self, kpsA, kpsB, featureA, featureB, ratio, reprojThresh):
        matches = cv2.BFMatcher()
        rawMatches = matches.knnMatch(featureA, featureB, 2)

        matches = []
        for m in rawMatches:
            if len(m) == 2 and m[0].distance < m[1].distance * ratio:
                matches.append((m[0].trainIdx, m[0].queryIdx))
        # 匹配对大于4对时，计算视角变换矩阵
        if len(matches) > 4:
            # 获取匹配对的坐标
            ptsA = np.float32([kpsA[i] for (_, i) in matches])
            ptsB = np.float32([kpsB[i] for (i, _) in matches])

            # 计算视角变换矩阵
            (H, status) = cv2.findHomography(ptsA, ptsB, cv2.RANSAC, reprojThresh)
        return (matches, H, status)

    def cv_show(self, name, img):
        cv2.imshow('name', img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()


'''
def Cut(self, img):
    height, width = img.shape[:2]
    left_half = img[:, :width // 2]
    right_half = img[:, width // 2:]

    # Display cropped image
    # 保存在包下
    cv2.imwrite('left_half.jpg', left_half)
    cv2.imwrite('right_half.jpg', right_half)
    return (left_half, right_half)
'''


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


'''
def cut(self,img):
    height, width = img.shape[:2]
    left_half = img[:, :width // 2]
    right_half = img[:, width // 2:]

    # Display cropped image
    # 保存在包下
    cv2.imwrite('left_half.jpg', left_half)
    cv2.imwrite('right_half.jpg', right_half)
    return (left_half, right_half)
'''


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


def imgFusion(img1, img2, overlap=128, left_right=True, some_initial_value=None):
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
        if left_right:  # 左右融合\
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


app = Flask(__name__)
CORS(app, supports_credentials=True)


# Sift处理结果
@app.route('/airesult1', methods=['POST'])
def airesult1():
    body = request.json['body']
    download_image(body['leftUrl'], '1.png')
    download_image(body['rightUrl'], '2.png')
    # ./1.png ./2.png 就是你需要合并的图片
    stitcher = Stitcher()
    imag1 = cv2.imread('1.png')
    imag2 = cv2.imread('2.png')
    result1 = stitcher.stitch([imag1, imag2], showMatches=True)
    sresult1 = cv2.resize(result1, (0, 0), fx=0.4, fy=0.4)
    cv2.imwrite('3.png', sresult1)
    auth = oss2.Auth(accessKeyId, accessKeySecret)
    bucket = oss2.Bucket(auth, 'https://oss-cn-beijing.aliyuncs.com', 'sxntest')
    t = time.time()
    file_name = 'uploads/插入时间戳.png'
    new_file_name = file_name.replace('插入时间戳', str(t))
    bucket.put_object_from_file(new_file_name, '3.png')
    return new_file_name


# ORB处理结果
@app.route('/airesult2', methods=['POST'])
def airesult2():
    body = request.json['body']
    download_image(body['leftUrl'], '1.png')
    download_image(body['rightUrl'], '2.png')
    # ./1.png ./2.png 就是你需要合并的图片
    image1 = cv2.imread('1.png')
    image2 = cv2.imread('2.png')
    # 使用ORB算法检测特征点和计算特征描述子
    orb = cv2.ORB_create()
    keypoints1, descriptors1 = orb.detectAndCompute(image1, None)
    keypoints2, descriptors2 = orb.detectAndCompute(image2, None)
    # 使用BFMatcher进行特征点匹配
    matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = matcher.match(descriptors1, descriptors2)
    # 根据特征点的距离进行排序
    matches = sorted(matches, key=lambda x: x.distance)
    # 选择前N个最佳匹配的特征点
    N = 150
    best_matches = matches[:N]
    # 提取最佳匹配特征点的坐标
    points1 = np.float32([keypoints1[m.queryIdx].pt for m in best_matches]).reshape(-1, 1, 2)
    points2 = np.float32([keypoints2[m.trainIdx].pt for m in best_matches]).reshape(-1, 1, 2)
    # 使用RANSAC算法估计两张图像之间的透视变换矩阵
    M, mask = cv2.findHomography(points1, points2, cv2.RANSAC, 5.0)
    # 进行透视变换，将图像1拼接到图像2上
    result = cv2.warpPerspective(image1, M, (image2.shape[1] + image1.shape[1], image2.shape[0]))
    result[0:image2.shape[0], 0:image2.shape[1]] = image2
    # 显示拼接结果
    result2 = cv2.resize(result, (0, 0), fx=0.3, fy=0.3)
    cv2.imwrite('3.png', result2)
    auth = oss2.Auth(accessKeyId, accessKeySecret)
    bucket = oss2.Bucket(auth, 'https://oss-cn-beijing.aliyuncs.com', 'sxntest')
    t = time.time()
    file_name = 'uploads/插入时间戳.png'
    new_file_name = file_name.replace('插入时间戳', str(t))
    bucket.put_object_from_file(new_file_name, '3.png')
    return new_file_name


# Sift+加权平均融合处理结果
@app.route('/airesult3', methods=['POST'])
def airesult3():
    body = request.json['body']
    download_image(body['leftUrl'], '1.png')
    download_image(body['rightUrl'], '2.png')
    # ./1.png ./2.png 就是你需要合并的图片

    imag1 = cv2.imread('1.png')
    imag2 = cv2.imread('2.png')

    # 先将两张图片按照stiter方法进行拼接
    stitcher = Stitcher()
    result1 = stitcher.stitch([imag1, imag2], showMatches=True)
    # 将拼接的结果利用cut方法分割为两个部分，以接缝处分割
    # cut = cut()

    # cutL, cutR = cut.cut(img=result1)  # 拼接好的图片平均分成两半
    # cv2.imwrite('left_half.png', cutL)
    # cv2.imwrite('right_half.png', cutR)


    height, width = result1.shape[:2]
    left_half = result1[:, :width // 2]
    right_half = result1[:, width // 2:]

    # Display cropped image
    # 保存在包下
    cv2.imwrite('left_half.jpg', left_half)
    cv2.imwrite('right_half.jpg', right_half)

    # img1是左半张img2是右半张
    img1 = cv2.imread('left_half.png', cv2.IMREAD_UNCHANGED)
    img2 = cv2.imread('right_half.png', cv2.IMREAD_UNCHANGED)
    # 计算融合操作，原理为加权平均融合 ：将分好的图片接缝处像素进行加权平均处理 让像素值过度的更自然
    img1 = (img1 - img1.min()) / img1.ptp()
    img2 = (img2 - img2.min()) / img2.ptp()
    img_new = imgFusion(img1, img2)
    # sresult3为加权平均融合之后的最终图像
    sresult3 = np.uint16(img_new * 65535)
    # 经过你的处理后
    # 生成 ./3.png
    cv2.imwrite('3.png', sresult3)
    auth = oss2.Auth(accessKeyId, accessKeySecret)
    bucket = oss2.Bucket(auth, 'https://oss-cn-beijing.aliyuncs.com', 'sxntest')
    t = time.time()
    file_name = 'uploads/插入时间戳.png'
    new_file_name = file_name.replace('插入时间戳', str(t))
    bucket.put_object_from_file(new_file_name, '3.png')
    return new_file_name


if __name__ == '__main__':
    app.run()
