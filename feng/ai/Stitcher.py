
import cv2
import numpy as np


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

        M = self.matchKeypoints(kpsA,kpsB,featureA,featureB,ratio,reprojThresh)
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
        result = cv2.warpPerspective(imageA, H, (imageA.shape[1] + imageB.shape[1], imageA.shape[0]) )
        result1 = cv2.resize(result, (0, 0), fx=0.3, fy=0.3)
        self.cv_show('result', result1) # 显示视角变换之后的图片

        # 检测是否需要显示图片最最左端
        result[0:imageB.shape[0],0:imageB.shape[1]] = imageB
        # self.cv_show('result', result) # 显示左端图片（大图）

        # 检查是否需要显示图像匹配
        #vis = self.bf_match(imageA,imageB,kpsA,kpsB,featureA,featureB)


        return result




    def detectAndDescrib(self,image): #  检测描述特征点
        #转灰度图
        gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)

        #建立sift生成器
        descriptor = cv2.SIFT_create()
        #检测SIFT特征点，并计算描述子
        (kps,feature) = descriptor.detectAndCompute(image,None)

        kps = np.float32([kp.pt for kp in kps])

        return (kps,feature)

    def bf_match(self,imageA,imageB,kpsA,kpsB,featureA,featureB):

            # 创建BFMatcher实例
        bf = cv2.BFMatcher()

            # knn检测来自两张图片的特征匹配对 获得最佳匹配
        matches = bf.knnMatch(featureA, featureB, k=2)
        good = []
        for m, n in matches:
            if m.distance < 0.75 * n.distance:
                good.append([m])
            # 绘制匹配结果
        AllmatchK = cv2.drawMatchesKnn(self, imageA, kpsA, imageB, kpsB, good, None, flags=2)


    def matchKeypoints(self, kpsA,kpsB,featureA,featureB,ratio,reprojThresh):
         matches= cv2.BFMatcher()
         rawMatches = matches.knnMatch(featureA, featureB, 2)

         matches = []
         for m in rawMatches:
             if len(m) == 2 and m[0].distance < m[1].distance * ratio:
                matches.append((m[0].trainIdx, m[0].queryIdx))
        #匹配对大于4对时，计算视角变换矩阵
         if len(matches) > 4:
            # 获取匹配对的坐标
            ptsA = np.float32([kpsA[i] for (_, i) in matches])
            ptsB = np.float32([kpsB[i] for (i,_) in matches])

            #计算视角变换矩阵
            (H, status) = cv2.findHomography(ptsA, ptsB, cv2.RANSAC, reprojThresh)
         return (matches, H, status)

    def cv_show(self, name, img):
        cv2.imshow('name', img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
