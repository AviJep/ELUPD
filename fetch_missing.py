"""Fetch the missing NIR municipalities that weren't captured in the first query."""
import json
import urllib.request
import urllib.parse
import os

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# These municipalities are in the interior of Negros Oriental and weren't found
# Try different admin levels and also searching by name
MISSING = [
    "Ayungon", "Bindoy", "Canlaon", "Guihulngan", 
    "Jimalalud", "La Libertad", "Mabinay", "Manjuyod", "Tayasan", "Vallehermoso"
]

def simplify_coords(coords, tolerance=0.003):
    if len(coords) <= 2:
        return coords
    dmax = 0
    idx = 0
    p1 = coords[0]
    p2 = coords[-1]
    for i in range(1, len(coords) - 1):
        p = coords[i]
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        if dx == 0 and dy == 0:
            d = ((p[0] - p1[0])**2 + (p[1] - p1[1])**2)**0.5
        else:
            d = abs(dy * p[0] - dx * p[1] + p2[0]*p1[1] - p2[1]*p1[0]) / (dx**2 + dy**2)**0.5
        if d > dmax:
            dmax = d
            idx = i
    if dmax > tolerance:
        left = simplify_coords(coords[:idx+1], tolerance)
        right = simplify_coords(coords[idx:], tolerance)
        return left[:-1] + right
    else:
        return [coords[0], coords[-1]]

def coords_close(a, b, tol=0.0001):
    return abs(a[0] - b[0]) < tol and abs(a[1] - b[1]) < tol

def merge_ways(way_list):
    if not way_list:
        return []
    rings = []
    remaining = list(way_list)
    while remaining:
        current = list(remaining.pop(0))
        changed = True
        while changed:
            changed = False
            for i, way in enumerate(remaining):
                if not way:
                    continue    
                if coords_close(current[-1], way[0]):
                    current.extend(way[1:])
                    remaining.pop(i)
                    changed = True
                    break
                elif coords_close(current[-1], way[-1]):
                    current.extend(reversed(way[:-1]))
                    remaining.pop(i)
                    changed = True
                    break
                elif coords_close(current[0], way[-1]):
                    current = list(way[:-1]) + current
                    remaining.pop(i)
                    changed = True
                    break
                elif coords_close(current[0], way[0]):
                    current = list(reversed(way[1:])) + current
                    remaining.pop(i)
                    changed = True
                    break
        if len(current) >= 3:
            if not coords_close(current[0], current[-1]):
                current.append(current[0])
            rings.append(current)
    return rings

# Query each missing municipality by name
for muni_name in MISSING:
    print(f"Fetching: {muni_name}...")
    
    # Try multiple admin levels
    for admin_level in ["6", "5", "7"]:
        query = f'[out:json][timeout:60];rel["name"="{muni_name}"]["admin_level"="{admin_level}"]["boundary"="administrative"](8.5,122.0,11.2,124.0);out body;>;out skel qt;'
        data = urllib.parse.urlencode({'data': query}).encode()
        req = urllib.request.Request(OVERPASS_URL, data=data, method='POST')
        req.add_header('User-Agent', 'ELUPD/1.0')
        try:
            resp = urllib.request.urlopen(req, timeout=60)
            result = json.loads(resp.read())
            
            if any(el['type'] == 'relation' for el in result['elements']):
                # Build nodes and ways
                nodes = {}
                for el in result['elements']:
                    if el['type'] == 'node':
                        nodes[el['id']] = (el['lon'], el['lat'])
                
                ways_data = {}
                for el in result['elements']:
                    if el['type'] == 'way':
                        coords = [nodes[nd] for nd in el.get('nodes', []) if nd in nodes]
                        ways_data[el['id']] = coords
                
                for el in result['elements']:
                    if el['type'] != 'relation':
                        continue
                    outer_ways = []
                    for member in el.get('members', []):
                        if member['type'] == 'way' and member.get('role', 'outer') in ('outer', ''):
                            wid = member['ref']
                            if wid in ways_data:
                                outer_ways.append(ways_data[wid])
                    
                    rings = merge_ways(outer_ways)
                    if rings:
                        simplified_rings = []
                        for ring in rings:
                            s = simplify_coords(ring, 0.003)
                            if len(s) >= 4:
                                s = [[round(x, 4), round(y, 4)] for x, y in s]
                                simplified_rings.append(s)
                        
                        if simplified_rings:
                            print(f"  Found {muni_name} at admin_level={admin_level} with {len(simplified_rings)} ring(s)")
                            
                            # Load existing file and add
                            out_path = os.path.join(os.path.dirname(__file__), 'frontend', 'src', 'app', 'utils', 'nir-boundaries.json')
                            with open(out_path) as f:
                                geojson = json.load(f)
                            
                            if len(simplified_rings) == 1:
                                geometry = {"type": "Polygon", "coordinates": simplified_rings}
                            else:
                                geometry = {"type": "MultiPolygon", "coordinates": [[r] for r in simplified_rings]}
                            
                            geojson['features'].append({
                                "type": "Feature",
                                "properties": {"name": muni_name, "admin_level": admin_level},
                                "geometry": geometry
                            })
                            
                            with open(out_path, 'w') as f:
                                json.dump(geojson, f)
                            
                            break  # Found it, no need to try other admin levels
                else:
                    pass  # No relations found at this level
        except Exception as e:
            print(f"  Error at level {admin_level}: {e}")
    else:
        # Check if we found it
        pass

# Final check
out_path = os.path.join(os.path.dirname(__file__), 'frontend', 'src', 'app', 'utils', 'nir-boundaries.json')
with open(out_path) as f:
    geojson = json.load(f)
print(f"\nTotal features now: {len(geojson['features'])}")
size_kb = os.path.getsize(out_path) / 1024
print(f"File size: {size_kb:.1f} KB")
