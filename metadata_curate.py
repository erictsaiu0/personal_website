import os
import json
import argparse
from datetime import datetime

def collect_tree(path, save_path='tree.json'):
    """
    Collect the file tree structure under the given path.
    """
    files = []
    for dirpath, dirnames, filenames in os.walk(path):
        for filename in filenames:
            files.append(os.path.join(dirpath, filename))
    # save as json file
    with open('tree.json', 'w') as f:
        json.dump(files, f, indent=4)
    return files

def collect_dirname(path, save_path='work_dirs.json'):
    """
    Collect the directory names under the given path.
    """
    dirs = {}
    for dirpath, dirnames, filenames in os.walk(path):
        for idx, dirname in enumerate(dirnames):
            dirs[idx] = dirname
    # save as json file
    with open(save_path, 'w') as f:
        json.dump(dirs, f, indent=4)
    return dirs

def collect_metadata(path='works', save_path='content.json'):
    """
    Collect the metadata of the given path.
    """
    metadata = {}
    for dirpath, dirnames, filenames in os.walk(path):
        for filename in filenames:
            if filename == 'metadata.json':
                with open(os.path.join(dirpath, filename), 'r') as f:
                    metadata[os.path.basename(dirpath)] = json.load(f)
    # save as json file
    with open(save_path, 'w') as f:
        json.dump(metadata, f, indent=4)
    return metadata

def build_index_content(top_n=5):
    # read content.json and choose top_n works
    with open('content.json', 'r') as f:
        content = json.load(f)
    # sort by date which the date data is stored in metadata "date" as format "MM-DD-YYYY"
    content = sorted(content.items(), key=lambda x: datetime.strptime(x[1]['date'], '%m-%d-%Y'), reverse=True)
    # choose top_n works
    content = content[:top_n]

    content_dict = {}
    for work in content:
        content_dict[work[0]] = work[1]

    # save as json file
    with open('index_content.json', 'w') as f:
        json.dump(content_dict, f, indent=4)
    return content

def build_digiart_content():
    with open('content.json', 'r') as f:
        content = json.load(f)
    # collect digiart works, which has "digital-art" in the tag list
    digiart_content = {}
    for work in content.items():
        if 'digital-art' in work[1]['tags']:
            digiart_content[work[0]] = work[1]
    # sort by date which the date data is stored in metadata "date" as format "MM-DD-YYYY"
    digiart_content = sorted(digiart_content.items(), key=lambda x: datetime.strptime(x[1]['date'], '%m-%d-%Y'), reverse=True)

    digiart_content_dict = {}
    for work in digiart_content:
        digiart_content_dict[work[0]] = work[1]

    # save as json file
    with open('digiart_content.json', 'w') as f:
        json.dump(digiart_content_dict, f, indent=4)
    return digiart_content

def build_photoart_content():
    with open('content.json', 'r') as f:
        content = json.load(f)
    # collect photoart works, which has "photo-art" in the tag list
    photoart_content = {}
    for work in content.items():
        if 'photography' in work[1]['tags'] or 'photobook' in work[1]['tags']:
            photoart_content[work[0]] = work[1]
    # sort by date which the date data is stored in metadata "date" as format "MM-DD-YYYY"
    photoart_content = sorted(photoart_content.items(), key=lambda x: datetime.strptime(x[1]['date'], '%m-%d-%Y'), reverse=True)

    photoart_content_dict = {}
    for work in photoart_content:
        photoart_content_dict[work[0]] = work[1]

    # save as json file
    with open('photoart_content.json', 'w') as f:
        json.dump(photoart_content_dict, f, indent=4)
    return photoart_content


collect_metadata()
build_index_content()
build_digiart_content()
build_photoart_content()

