#!/usr/bin/env python3
"""Lists Are.na images (home + project channels) that have no entry in
src/content/alt.json, so alt texts can be written and added for them."""
import json, re, urllib.request, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
alt = json.loads((root / 'src/content/alt.json').read_text())


def get(path):
    request = urllib.request.Request(f'https://api.are.na/v2/channels/{path}?per=100', headers={'User-Agent': 'asso-alt'})
    return json.load(urllib.request.urlopen(request))


slugs = {'adddgd', 'about-the-studio'}
missing = {}


def scan(channel, label):
    for block in channel['contents']:
        description = block.get('description') or ''
        if re.search(r'type:\s*hidden', description, re.I):
            continue
        if block['class'] == 'Image' and block.get('image') and str(block['id']) not in alt:
            missing[block['id']] = (label, block.get('title'), block['image']['original']['url'])
        if block['class'] == 'Channel':
            scan(get(block['slug']), f"{label}/{block['slug']}")
        for match in re.finditer(r'/project/([a-z0-9][a-z0-9_-]*)', description + ' ' + (block.get('content') or ''), re.I):
            slugs.add(match.group(1).lower())


done = set()
while slugs - done:
    slug = (slugs - done).pop()
    done.add(slug)
    scan(get(slug), slug)

for block_id, (label, title, url) in missing.items():
    print(f'{block_id}\t{label}\t{title}\t{url}')
print(f'{len(missing)} image(s) missing alt text')
