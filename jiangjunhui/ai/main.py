from pprint import pprint
from paddlenlp import Taskflow
schema = ['行动代号', '执行时间', '机型', '途经', '需配合单位'] # Define the schema for entity extraction
ie = Taskflow('information_extraction', schema=schema)
pprint(ie("行动代号：猎鹰，执行时间：二四年三月三十日，机型：歼十，途经：长春、沈阳、大连、北京，需配合单位：长春航空局、沈阳航空局、大连航空局")) 
