# from flask import Flask, redirect, url_for, request
# import json
# import threading
# import paddlehub as hub
# senta = hub.Module(name="senta_lstm")
# # from paddlenlp import Taskflow
# # similarity = Taskflow("text_similarity")
# lock = threading.Lock()

# app = Flask(__name__)



# # test_text = ["这家餐厅很好吃", "这部电影真的很差劲"]

# # results = senta.sentiment_classify(texts=test_text)


# # print(results)

# @app.route('/getss',methods = ['POST'])
# def getss():
#   print(request.json)
#   lock.acquire()
#   lock.release()
#   return json.dumps(request.json)
#   # result = similarity(request.json)
#   # flag = -1
#   # score = 0.7
#   # for index,obj in enumerate(result):
#   #   print(obj['similarity'])
#   #   if(obj['similarity'] > score and obj['similarity'] <= 1):
#   #     score = obj['similarity']
#   #     flag = index
#   # if(flag != -1):
#   #   print(result[flag])

#   # return json.dumps(flag)


# if __name__ == '__main__':
#   app.run(host="0.0.0.0",port=5000, debug=True) 

from flask import Flask, request
from flask_cors import CORS
import paddlehub as hub
senta = hub.Module(name="senta_lstm")

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/airesult', methods=['POST'])
def airesult():
    # data = request.args.get('data', '')
    body = request.json['body']
    results = senta.sentiment_classify(texts=[body])
    print(results)
    return results

if __name__ == '__main__':
    app.run()
