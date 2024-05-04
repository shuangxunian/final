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
