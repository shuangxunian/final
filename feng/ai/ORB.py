import cv2
import numpy as np
# 读取两张图像
image1 = cv2.imread('111- (2).jpg')
image2 = cv2.imread('111- (1).jpg')
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
N = 50
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
result = cv2.resize(result, (0, 0), fx=0.3, fy=0.3)
cv2.imshow("ORB Stitching", result)
cv2.waitKey(0)
cv2.destroyAllWindows()