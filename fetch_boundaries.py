"""
Download municipality boundaries for Negros Island Region from OpenStreetMap
via the Overpass API, simplify them, and save as GeoJSON for the frontend.
"""
import json
import urllib.request
import urllib.parse
import sys
import os

# Overpass query: get all admin_level=4 boundaries (municipalities/cities)
# in Negros Occidental, Negros Oriental, and Siquijor provinces
# Bounding box: roughly 9.0,122.3,11.1,123.7
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

QUERY = """
[out:json][timeout:300];
(
  rel["boundary"="administrative"]["admin_level"="6"](9.0,122.2,11.1,123.75);
);
out body;
>;
out skel qt;
"""

def fetch_overpass(query):
    """Fetch data from Overpass API."""
    data = urllib.parse.urlencode({'data': query}).encode('utf-8')
    req = urllib.request.Request(OVERPASS_URL, data=data, method='POST')
    req.add_header('User-Agent', 'ELUPD-Dashboard/1.0')
    print("Fetching from Overpass API (this may take a minute)...")
    with urllib.request.urlopen(req, timeout=180) as resp:
        return json.loads(resp.read().decode('utf-8'))

def simplify_coords(coords, tolerance=0.002):
    """Douglas-Peucker simplification."""
    if len(coords) <= 2:
        return coords
    
    # Find the point with max distance from line between first and last
    dmax = 0
    idx = 0
    p1 = coords[0]
    p2 = coords[-1]
    
    for i in range(1, len(coords) - 1):
        p = coords[i]
        # Distance from point to line
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

def build_geojson(osm_data):
    """Convert OSM data to GeoJSON features."""
    # Index nodes
    nodes = {}
    for el in osm_data['elements']:
        if el['type'] == 'node':
            nodes[el['id']] = (el['lon'], el['lat'])
    
    # Index ways
    ways = {}
    for el in osm_data['elements']:
        if el['type'] == 'way':
            coords = []
            for nd in el.get('nodes', []):
                if nd in nodes:
                    coords.append(nodes[nd])
            ways[el['id']] = coords
    
    # Process relations (municipalities)
    features = []
    for el in osm_data['elements']:
        if el['type'] != 'relation':
            continue
        tags = el.get('tags', {})
        name = tags.get('name', '')
        admin_level = tags.get('admin_level', '')
        
        if not name:
            continue
        
        # Collect outer ways
        outer_ways = []
        for member in el.get('members', []):
            if member['type'] == 'way' and member.get('role', 'outer') in ('outer', ''):
                wid = member['ref']
                if wid in ways:
                    outer_ways.append(ways[wid])
        
        if not outer_ways:
            continue
        
        # Merge ways into rings
        rings = merge_ways(outer_ways)
        
        if not rings:
            continue
        
        # Simplify
        simplified_rings = []
        for ring in rings:
            s = simplify_coords(ring, 0.003)
            if len(s) >= 4:
                # Round coordinates
                s = [[round(x, 4), round(y, 4)] for x, y in s]
                simplified_rings.append(s)
        
        if not simplified_rings:
            continue
        
        if len(simplified_rings) == 1:
            geometry = {"type": "Polygon", "coordinates": simplified_rings}
        else:
            geometry = {"type": "MultiPolygon", "coordinates": [[r] for r in simplified_rings]}
        
        feature = {
            "type": "Feature",
            "properties": {
                "name": name,
                "admin_level": admin_level,
            },
            "geometry": geometry
        }
        features.append(feature)
        print(f"  Processed: {name} ({len(simplified_rings)} ring(s))")
    
    return {"type": "FeatureCollection", "features": features}

def merge_ways(way_list):
    """Merge ways into closed rings."""
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
                # Try to connect
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
        
        # Close ring if needed
        if len(current) >= 3:
            if not coords_close(current[0], current[-1]):
                current.append(current[0])
            rings.append(current)
    
    return rings

def coords_close(a, b, tol=0.0001):
    return abs(a[0] - b[0]) < tol and abs(a[1] - b[1]) < tol

if __name__ == '__main__':
    print("=== Fetching NIR Municipality Boundaries from OpenStreetMap ===")
    osm_data = fetch_overpass(QUERY)
    print(f"Got {len(osm_data.get('elements', []))} elements")
    
    geojson = build_geojson(osm_data)
    print(f"\nTotal features: {len(geojson['features'])}")
    
    # Save output
    out_path = os.path.join(os.path.dirname(__file__), 'frontend', 'src', 'app', 'utils', 'nir-boundaries.json')
    with open(out_path, 'w') as f:
        json.dump(geojson, f)
    
    size_kb = os.path.getsize(out_path) / 1024
    print(f"\nSaved to: {out_path}")
    print(f"File size: {size_kb:.1f} KB")
    
    # List features
    print("\nMunicipalities found:")
    for feat in sorted(geojson['features'], key=lambda f: f['properties']['name']):
        print(f"  - {feat['properties']['name']}")
