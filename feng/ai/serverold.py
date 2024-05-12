from flask import Flask, request
from flask_cors import CORS
import requests


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
    download_image(body[0], '1.png')
    download_image(body[1], '2.png')
    # ./1.png ./2.png 就是你需要合并的图片
    # 经过你的处理后
    # 生成 ./3.png
    # return result

if __name__ == '__main__':
    app.run()

