import random
import string

import china_cities


def get_random_city():
    '''
    :return: 生成城市字典
    '''
    citylist = china_cities.get_cities_cn()
    with open('../dict/city.txt', 'w', encoding='utf-8') as f:
        for data in citylist:
            f.write(data + '\n')
    f.close()


def generate_random_string():
    '''
    :return: 随机生成英文字符串
    '''
    d1 = set()
    for i in range(0, 300):
        length = random.randint(3, 6)  # 随机生成字符串的长度
        random_string = ''.join(random.choices(string.ascii_uppercase, k=length))
        d1.add(random_string)
    with open('../dict/code.txt', 'w', encoding='utf-8') as f:
        for data in d1:
            f.write(data+'\n')
    f.close()

def get_mount():
    '''
    :return: 返回山脉名称
    '''
    mount_list = open('./dict/mount.txt', 'r', encoding='utf-8').readlines()
    random_index = random.randint(0, len(mount_list) - 1)
    return mount_list[random_index].strip()


def generate_random_name():
    '''
    :return: 随机生成纯汉字、字母+汉字、数字+汉字
    '''
    type_num = random.randint(0, 2)
    if type_num == 0:
        name = get_mount()
    elif type_num == 1:
        l1 = random.randint(1, 4)
        name = ''.join(random.choices(string.ascii_uppercase, k=l1))
        name += get_mount()
    else:
        name = str(random.randint(10, 199))  # 随机选择一个数字作为起始字符
        name += get_mount()
    return name


if __name__ == '__main__':
    pass
    # get_random_city()
    generate_random_string()
