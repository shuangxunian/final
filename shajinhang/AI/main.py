import paddlehub as hub

senta = hub.Module(name="senta_lstm")

test_text = ["这家餐厅很好吃", "这部电影真的很差劲"]

results = senta.sentiment_classify(texts=test_text)


print(results)


