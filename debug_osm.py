import json, urllib.request, urllib.parse

url = 'https://overpass-api.de/api/interpreter'
# Get 1 relation with ALL its ways and nodes (no limit)
q = '[out:json][timeout:120];rel(1506746);out body;>;out skel qt;'
data = urllib.parse.urlencode({'data': q}).encode()
req = urllib.request.Request(url, data=data, method='POST')
req.add_header('User-Agent', 'test/1.0')
resp = urllib.request.urlopen(req, timeout=120)
d = json.loads(resp.read())
print(f"Total elements: {len(d['elements'])}")

types = {}
for el in d['elements']:
    t = el['type']
    types[t] = types.get(t, 0) + 1
print(f"Types: {types}")

# Show a way to see what key is used for node references  
for el in d['elements']:
    if el['type'] == 'way':
        print(f"\nWay keys: {list(el.keys())}")
        print(f"Way sample: {json.dumps(el, indent=2)[:600]}")
        break

