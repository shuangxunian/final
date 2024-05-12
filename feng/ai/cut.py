# Import packages
import cv2
import numpy as np
class cut:
    def Cut(self,img):

        height, width = img.shape[:2]
        left_half = img[:, :width//2]
        right_half = img[:, width//2:]


            # Display cropped image
        #保存在包下
        cv2.imwrite('left_half.jpg', left_half)
        cv2.imwrite('right_half.jpg', right_half)
        return (left_half ,right_half)

