from flask import Flask, request
from flask_cors import CORS
import paddlehub as hub
import cv2
import requests
import os

ocr = hub.Module(name="chinese_ocr_db_crnn_mobile", enable_mkldnn=True)       # mkldnn加速仅在CPU下有效

def download_image(url, save_path):
    response = requests.get(url, stream=True)
    response.raise_for_status()

    with open(save_path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/airesult', methods=['POST'])
def airesult():
    body = request.json['body']
    download_image(body, '1.png')
    result = ocr.recognize_text(images=[cv2.imread('./1.png')])
    return result

if __name__ == '__main__':
    app.run()

