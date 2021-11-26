import json
import os
from colorthief import ColorThief

"""
Add pics in pics
run the script
"""

IMG_DIR = "./pics"
FILE_NAME = "img_colors.json"


def get_img_colors(img_path):
    color_thief = ColorThief(img_path)
    dominant_color = color_thief.get_color(quality=1)
    return dominant_color


def get_file_value(file_name):
    with open(file_name, 'r') as read_file:
        try:
            res = json.load(read_file)
        except Exception as e:
            res = []
    return res


def write_in_file(file_name, data):
    with open(file_name, 'w') as output_file:
        try:
            res = json.dump(data, output_file)
        except:
            res = []
    return res

def main():
    res = get_file_value(FILE_NAME)

    img_names = os.listdir(IMG_DIR)
    valid_extensions = ['jpg', 'png', 'jpeg']
    for idx, img_name in enumerate(img_names):
        if idx == 800:
            break
        print(idx, len(img_names), img_name)
        if img_name in list(map(lambda x: x['name'], res)):
            continue
        if not any(extension in img_name for extension in valid_extensions):
            continue
        dominant_color = get_img_colors(f'{IMG_DIR}/{img_name}')
        res.append({"name": img_name, "color": dominant_color})

    write_in_file(FILE_NAME, res)


if __name__ == "__main__":
    main()
