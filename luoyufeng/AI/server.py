from flask import Flask, redirect, url_for, request
import json
from paddlenlp import Taskflow
import threading
similarity = Taskflow("text_similarity")
# similarity = Taskflow("text_similarity")
lock = threading.Lock()

app = Flask(__name__)



@app.route('/airesult',methods = ['POST'])
def airesult():
  print(request.json['body'])
  lock.acquire()
  result = similarity([request.json['body']])
  # result = similarity([["春天适合种什么花？", "春天适合种什么菜？"], ["小蝌蚪找妈妈怎么样", "小蝌蚪找妈妈是谁画的"]])
  # [['夏季赛必解散，但是也买不到合适的人，所以解散了也是史', '我饿了,我好想吃烤肉'], ['我也好想吃螺蛳粉,想起来前几天在零食很忙买的李子柒螺蛳粉还没煮呢', '我饿了,我好想吃烤肉']]
  lock.release()
  # flag = -1
  # score = 0.7
  # for index,obj in enumerate(result):
  #   print(obj['similarity'])
  #   if(obj['similarity'] > score and obj['similarity'] <= 1):
  #     score = obj['similarity']
  #     flag = index
  # if(flag != -1):
  #   print(result[flag])

  return json.dumps(result)


if __name__ == '__main__':
  app.run(host="0.0.0.0",port=5000, debug=True) 