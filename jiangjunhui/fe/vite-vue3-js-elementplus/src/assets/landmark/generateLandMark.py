import random
import math
import string
import china_cities


def generate_random_gps():
    '''
    :return: 随机生成经纬度
    '''
    base_log = 102.7
    base_lat = 25
    radius = 100000
    radius_in_degrees = radius / 111300
    u = float(random.uniform(0.0, 1.0))
    v = float(random.uniform(0.0, 1.0))
    w = radius_in_degrees * math.sqrt(u)
    t = 2 * math.pi * v
    x = w * math.cos(t)
    y = w * math.sin(t)
    longitude = y + base_log
    latitude = x + base_lat
    # 处理经度
    if longitude < 0:
        longitude_str = "W" + format(abs(longitude), ".2f")  # 西经
    else:
        longitude_str = "E" + format(longitude, ".2f")  # 东经
    # 处理纬度
    if latitude < 0:
        latitude_str = "S" + format(abs(latitude), ".2f")  # 南纬
    else:
        latitude_str = "N" + format(latitude, ".2f")  # 北纬
    # 添加单引号
    longitude_str = longitude_str.replace(".", "'")
    latitude_str = latitude_str.replace(".", "'")
    return longitude_str + latitude_str

def generate_random_gps2():
    '''
    :return: 随机生成经纬度
    '''
    base_log = 102.7
    base_lat = 25
    radius = 100000
    radius_in_degrees = radius / 111300
    u = float(random.uniform(0.0, 1.0))
    v = float(random.uniform(0.0, 1.0))
    w = radius_in_degrees * math.sqrt(u)
    t = 2 * math.pi * v
    x = w * math.cos(t)
    y = w * math.sin(t)
    longitude = y + base_log
    latitude = x + base_lat
    # 处理经度
    if longitude < 0:
        longitude_str = "W" + format(abs(longitude), ".2f")  # 西经
    else:
        longitude_str = "东经" + format(longitude, ".2f")  # 东经
    # 处理纬度
    if latitude < 0:
        latitude_str = "S" + format(abs(latitude), ".2f")  # 南纬
    else:
        latitude_str = "北纬" + format(latitude, ".2f")  # 北纬
    # 添加单引号
    longitude_str = longitude_str.replace(".", "'")
    latitude_str = latitude_str.replace(".", "'")
    return longitude_str + latitude_str

def generate_random_string():
    '''
    :return: 随机生成英文字符串
    '''
    length = random.randint(3, 6)  # 随机生成字符串的长度
    random_string = ''.join(random.choices(string.ascii_uppercase, k=length))
    return random_string

def generate_random_name():
    '''
    :return: 随机生成纯汉字、字母+汉字、数字+汉字
    '''
    length = random.randint(3, 6)  # 名称长度范围
    han_start = 0x4E00  # 汉字起始的 Unicode
    han_end = 0x9FA5  # 汉字结束的 Unicode
    # 预留最后一个位置给纯汉字的类型，确保以汉字结尾
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

def get_random_city():
    '''
    :return: 随机生成一个城市名
    '''
    citylist = china_cities.get_cities_cn()
    random_index = random.randint(0, len(citylist) - 1)
    random_element = citylist[random_index]
    return random_element


def get_random_combination():
    '''
    :return: 随机生成一个城市名+字母
    '''
    comb1 = get_random_city().replace('市', '')
    comb2 = ''.join(random.choices(string.ascii_uppercase, k=3))
    return comb1 + comb2


def do_generate():
    '''
    :return: 入口函数
    '''
    function_list = [generate_random_gps, generate_random_gps2, generate_random_string, generate_random_name,
                     get_random_city,
                     get_random_combination]
    res = []
    ran1 = random.randint(10, 90)
    ran2 = random.randint(10, 90)
    res0 = get_random_city() + str(ran1)
    res.append(res0)
    length = random.randint(3, 30)
    for i in range(length):
        # 随机选择一个函数并调用
        random_function = random.choice(function_list)
        res_ = random_function()
        res.append(res_)
    res11 = get_random_city() + str(ran2)
    res.append(res11)
    result = ' '.join(res)
    return result


def get_mount():
    '''
    :return: 返回山脉名称
    '''
    mount_list = open('dict/mount.txt', 'r', encoding='utf-8').readlines()
    random_index = random.randint(0, len(mount_list) - 1)
    return mount_list[random_index].strip()


if __name__ == '__main__':
    with open('./data.txt', 'w', encoding='utf-8') as f:
        for i in range(1000):
            r = do_generate() + '\n'
            f.write(r)
    pass

