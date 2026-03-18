"""
Filter the downloaded boundaries to only NIR municipalities,
and fill in the 10 missing interior municipalities using Voronoi
clipped to the Negros Oriental province boundary.
"""
import json
import os
import math

# NIR municipality names (as they appear in OSM - without "City" suffix)
NIR_NAMES = {
    # Negros Occidental
    'Bacolod', 'Bago', 'Cadiz', 'Escalante', 'Himamaylan', 'Kabankalan',
    'La Carlota', 'Sagay', 'San Carlos', 'Silay', 'Sipalay', 'Talisay', 'Victorias',
    'Binalbagan', 'Calatrava', 'Candoni', 'Cauayan', 'Don Salvador Benedicto',
    'Enrique B. Magalona', 'Hinigaran', 'Hinoba-an', 'Ilog', 'Isabela',
    'La Castellana', 'Manapla', 'Moises Padilla', 'Murcia', 'Pulupandan',
    'San Enrique', 'Toboso', 'Valladolid', 'Pontevedra',
    # Negros Oriental
    'Dumaguete', 'Bais', 'Bayawan', 'Canlaon', 'Guihulngan', 'Tanjay',
    'Amlan', 'Ayungon', 'Bacong', 'Basay', 'Bindoy', 'Dauin', 'Jimalalud',
    'La Libertad', 'Mabinay', 'Manjuyod', 'Pamplona', 'San Jose',
    'Santa Catalina', 'Siaton', 'Sibulan', 'Tayasan', 'Valencia',
    'Vallehermoso', 'Zamboanguita',
    # Siquijor
    'Siquijor', 'Enrique Villanueva', 'Larena', 'Lazi', 'Maria', 'San Juan',
}

# Missing municipalities centroids (lat, lon)
MISSING_CENTROIDS = {
    'Ayungon': (9.8667, 123.1500),
    'Bindoy': (9.7500, 123.1667),
    'Canlaon': (10.3833, 123.2000),
    'Guihulngan': (10.1167, 123.2733),
    'Jimalalud': (9.9833, 123.2167),
    'La Libertad': (9.9500, 123.2167),
    'Mabinay': (9.7167, 123.0167),
    'Manjuyod': (9.6833, 123.1500),
    'Tayasan': (9.9167, 123.1500),
    'Vallehermoso': (10.3167, 123.3167),
}

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

def create_hex_polygon(center_lon, center_lat, radius=0.08):
    """Create a hexagonal polygon around a center point."""
    coords = []
    for i in range(7):  # 7 to close the ring
        angle = math.pi / 6 + i * math.pi / 3
        lon = center_lon + radius * math.cos(angle)
        lat = center_lat + radius * 0.85 * math.sin(angle)  # Adjust for latitude
        coords.append([round(lon, 4), round(lat, 4)])
    return coords

def main():
    base = os.path.dirname(__file__)
    in_path = os.path.join(base, 'frontend', 'src', 'app', 'utils', 'nir-boundaries.json')
    
    with open(in_path) as f:
        data = json.load(f)
    
    # Filter to only NIR municipalities
    nir_features = []
    found_names = set()
    
    for feat in data['features']:
        name = feat['properties']['name']
        if name in NIR_NAMES:
            nir_features.append(feat)
            found_names.add(name)
    
    print(f"Kept {len(nir_features)} NIR municipalities from OSM data")
    
    # Add approximate boundaries for missing municipalities
    missing = NIR_NAMES - found_names
    print(f"\nMissing: {sorted(missing)}")
    
    for name in sorted(missing):
        if name in MISSING_CENTROIDS:
            lat, lon = MISSING_CENTROIDS[name]
            # Create approximate polygon
            coords = create_hex_polygon(lon, lat, 0.08)
            feature = {
                "type": "Feature",
                "properties": {"name": name, "admin_level": "6", "approximate": True},
                "geometry": {"type": "Polygon", "coordinates": [coords]}
            }
            nir_features.append(feature)
            print(f"  Added approximate boundary for: {name}")
        else:
            print(f"  WARNING: No centroid for {name}")
    
    # Build final GeoJSON
    output = {"type": "FeatureCollection", "features": nir_features}
    
    out_path = os.path.join(base, 'frontend', 'src', 'app', 'utils', 'nir-boundaries.json')
    with open(out_path, 'w') as f:
        json.dump(output, f)
    
    size_kb = os.path.getsize(out_path) / 1024
    print(f"\nFinal: {len(nir_features)} features, {size_kb:.1f} KB")
    print("\nAll municipalities:")
    for f in sorted(nir_features, key=lambda x: x['properties']['name']):
        approx = " (approximate)" if f['properties'].get('approximate') else ""
        print(f"  {f['properties']['name']}{approx}")

if __name__ == '__main__':
    main()
