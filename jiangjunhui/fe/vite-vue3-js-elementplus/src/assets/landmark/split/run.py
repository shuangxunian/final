import re

def recognize_withspace():
    file1 = open('../data.txt', 'r', encoding='utf-8')
    data_list = file1.readlines()
    file1.close()
    for text in data_list:
        word_array = text.split()
        # print(word_array)
        local_words = []
        # 循环遍历数组，针对每个元素分别处理
        for word in word_array:
            #  r'E\d{3}\'\d{2}N\d{2}\'\d{2}'
            #  r"东经\d{2}'\d{2}北纬\d{2}'\d{2}|E\d{3}'\d{2}N\d{2}'\d{2}"
            #  r"东经\d{1,3}'\d{1,2}北纬\d{1,3}'\d{1,2}|E\d{1,3}'\d{1,2}N\d{1,3}'\d{1,2}"
            if re.search(r"东经\d{1,3}'\d{1,2}北纬\d{1,3}'\d{1,2}|E\d{1,3}'\d{1,2}N\d{1,3}'\d{1,2}", word):
                local_words.append(word)
            else:
                local_words.append(re.sub(r'[^a-zA-Z\u4e00-\u9fa5\']', '', word))
        print("local_words:", local_words)

def recognize_nospace():
    # file1 = open('./data.txt', 'r', encoding='utf-8')
    # 输入字符串
    input_string = "安宁市23武陵山楚雄BBJE102'03N24'84FQGRDYKPK三亚市QRO什邡市万源FRZ侯马FEQWWVT湘乡市东经103'30北纬24'87R台东山四会市41"
    pattern = r"([\u4e00-\u9fa5]+|\d+|[A-Z]+[A-Za-z\d']*)"
    matches = re.findall(pattern, input_string)
    result = [match for match in matches if match]
    print(result)
    # # 使用正则表达式匹配纯汉字
    # chinese_pattern = r"[\u4e00-\u9fa5]+"
    # # 使用正则表达式匹配纯数字
    # numeric_pattern = r"\d+"
    # # 使用正则表达式匹配纯字母
    # alphabet_pattern = r"[A-Za-z]+"
    # # 使用正则表达式匹配纯英文组成的组数
    # english_pattern = r"[A-Za-z\d]+"


if __name__ == '__main__':
    recognize_withspace()
    recognize_nospace()
