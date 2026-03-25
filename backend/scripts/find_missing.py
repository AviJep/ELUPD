import json, urllib.request, urllib.parse

url = 'https://overpass-api.de/api/interpreter'
for name in ['Ayungon', 'Bindoy', 'Canlaon', 'Guihulngan', 'Jimalalud', 'La Libertad', 'Mabinay', 'Manjuyod', 'Tayasan', 'Vallehermoso']:
    q = f'[out:json][timeout:30];rel["name"~"{name}",i]["boundary"="administrative"](8.5,122.0,11.2,124.0);out tags;'
    data = urllib.parse.urlencode({'data': q}).encode()
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('User-Agent', 'test/1.0')
    resp = urllib.request.urlopen(req, timeout=30)
    result = json.loads(resp.read())
    rels = [e for e in result['elements'] if e['type'] == 'relation']
    if rels:
        for r in rels:
            tags = r.get('tags', {})
            print(f'{name}: id={r["id"]} name={tags.get("name","?")} level={tags.get("admin_level","?")}')
    else:
        print(f'{name}: NOT FOUND')
