"""
Fix boundaries comprehensive:
1. Siquijor: Replace OSM marine-jurisdiction boundaries with clean Voronoi-based
   municipalities clipped to the actual island outline polygon.
2. Negros: Fill interior gaps for 10 missing municipalities using Voronoi,
   clipped tightly to the convex hull of real boundaries.
"""
import json
import numpy as np
from scipy.spatial import Voronoi
from shapely.geometry import Polygon, MultiPolygon, box, Point, GeometryCollection
from shapely.ops import unary_union
from shapely import simplify

# ============ SIQUIJOR ============

# Siquijor island outline (approximate coastline).
# The island is roughly oval, ~20km EW x ~13km NS, centered around (123.54, 9.19)
SIQUIJOR_OUTLINE = [
    [123.440, 9.190], [123.445, 9.215], [123.458, 9.237],
    [123.480, 9.255], [123.510, 9.268], [123.545, 9.273],
    [123.580, 9.270], [123.610, 9.258], [123.635, 9.240],
    [123.652, 9.215], [123.658, 9.190], [123.655, 9.165],
    [123.642, 9.143], [123.620, 9.125], [123.592, 9.112],
    [123.558, 9.105], [123.522, 9.105], [123.490, 9.112],
    [123.465, 9.128], [123.450, 9.150], [123.442, 9.170],
    [123.440, 9.190],
]

# Siquijor municipality centroids (lon, lat) - approximate positions on the island
SIQUIJOR_CENTROIDS = {
    'Siquijor':             [123.505, 9.215],   # NW
    'Larena':               [123.572, 9.245],   # N
    'Enrique Villanueva':   [123.625, 9.215],   # NE / E
    'Maria':                [123.618, 9.148],   # SE
    'Lazi':                 [123.555, 9.130],   # S
    'San Juan':             [123.478, 9.155],   # SW / W
}

# ============ NEGROS ============

NEGROS_CENTROIDS = {
    'Bacolod': [122.9570, 10.6840],
    'Bago': [122.8367, 10.5383],
    'Cadiz': [123.3083, 10.9500],
    'Escalante': [123.5000, 10.8400],
    'Himamaylan': [122.8700, 10.1000],
    'Kabankalan': [122.8167, 9.5833],
    'La Carlota': [122.9167, 10.4167],
    'Sagay': [123.4239, 10.8944],
    'San Carlos': [123.4100, 10.4933],
    'Silay': [122.9700, 10.8117],
    'Sipalay': [122.4000, 9.7500],
    'Talisay': [122.9683, 10.7383],
    'Victorias': [123.1000, 10.9000],
    'Binalbagan': [122.8611, 10.1944],
    'Calatrava': [123.4833, 10.6167],
    'Candoni': [122.6000, 9.8167],
    'Cauayan': [122.7167, 9.8333],
    'Don Salvador Benedicto': [123.1333, 10.6000],
    'Enrique B. Magalona': [123.0167, 10.8500],
    'Hinigaran': [122.8500, 10.2667],
    'Hinoba-an': [122.5000, 9.5833],
    'Ilog': [122.7667, 10.0167],
    'Isabela': [122.5500, 9.9500],
    'La Castellana': [122.9333, 10.3333],
    'Manapla': [123.1167, 10.9500],
    'Moises Padilla': [122.9500, 10.2833],
    'Murcia': [122.9000, 10.6000],
    'Pulupandan': [122.8000, 10.5167],
    'San Enrique': [122.8500, 10.4167],
    'Toboso': [123.5167, 10.7000],
    'Valladolid': [122.8333, 10.4667],
    'Dumaguete': [123.3085, 9.3068],
    'Bais': [123.1216, 9.5916],
    'Bayawan': [122.8017, 9.3632],
    'Canlaon': [123.2000, 10.3833],
    'Guihulngan': [123.2733, 10.1167],
    'Tanjay': [123.1583, 9.5167],
    'Amlan': [123.2833, 9.2333],
    'Ayungon': [123.1500, 9.8667],
    'Bacong': [123.3000, 9.2500],
    'Basay': [122.6200, 9.4000],
    'Bindoy': [123.1667, 9.7500],
    'Dauin': [123.2700, 9.1917],
    'Jimalalud': [123.2167, 9.9833],
    'La Libertad': [123.2167, 9.9500],
    'Mabinay': [123.0167, 9.7167],
    'Manjuyod': [123.1500, 9.6833],
    'Pamplona': [123.3500, 9.4833],
    'San Jose': [123.0500, 9.4167],
    'Santa Catalina': [122.8550, 9.3667],
    'Siaton': [123.0333, 9.0667],
    'Sibulan': [123.2833, 9.3500],
    'Tayasan': [123.1500, 9.9167],
    'Valencia': [123.2333, 9.2833],
    'Vallehermoso': [123.3167, 10.3167],
    'Zamboanguita': [123.1833, 9.1000],
    'Pontevedra': [122.8700, 10.3500],
}

SIQUIJOR_NAMES = set(SIQUIJOR_CENTROIDS.keys())

MISSING_NAMES = {
    'Ayungon', 'Bindoy', 'Canlaon', 'Guihulngan', 'Jimalalud',
    'La Libertad', 'Mabinay', 'Manjuyod', 'Tayasan', 'Vallehermoso'
}


def voronoi_finite_polygons_2d(vor, radius=None):
    """Reconstruct infinite Voronoi regions as finite polygons."""
    new_regions = []
    new_vertices = vor.vertices.tolist()
    center = vor.points.mean(axis=0)
    if radius is None:
        radius = vor.points.ptp(axis=0).max() * 2

    all_ridges = {}
    for (p1, p2), (v1, v2) in zip(vor.ridge_points, vor.ridge_vertices):
        all_ridges.setdefault(p1, []).append((p2, v1, v2))
        all_ridges.setdefault(p2, []).append((p1, v1, v2))

    for p1, region_idx in enumerate(vor.point_region):
        vertices = vor.regions[region_idx]
        if all(v >= 0 for v in vertices):
            new_regions.append(vertices)
            continue

        ridges = all_ridges.get(p1, [])
        new_region = [v for v in vertices if v >= 0]

        for p2, v1, v2 in ridges:
            if v2 < 0:
                v1, v2 = v2, v1
            if v1 >= 0:
                continue
            t = vor.points[p2] - vor.points[p1]
            n_t = np.linalg.norm(t)
            if n_t == 0:
                continue
            t /= n_t
            n = np.array([-t[1], t[0]])
            midpoint = vor.points[[p1, p2]].mean(axis=0)
            direction = np.sign(np.dot(midpoint - center, n)) * n
            far_point = vor.vertices[v2] + direction * radius
            new_region.append(len(new_vertices))
            new_vertices.append(far_point.tolist())

        vs = np.asarray([new_vertices[v] for v in new_region])
        if len(vs) < 3:
            new_regions.append(new_region)
            continue
        c = vs.mean(axis=0)
        angles = np.arctan2(vs[:, 1] - c[1], vs[:, 0] - c[0])
        new_region = [new_region[i] for i in np.argsort(angles)]
        new_regions.append(new_region)

    return new_regions, np.asarray(new_vertices)


def make_polygon(coords):
    p = Polygon(coords)
    if not p.is_valid:
        p = p.buffer(0)
    return p


def extract_polygon(geom):
    """Extract the largest polygon from any geometry type."""
    if geom is None or geom.is_empty:
        return None
    if isinstance(geom, Polygon):
        return geom
    if isinstance(geom, MultiPolygon):
        return max(geom.geoms, key=lambda g: g.area)
    if isinstance(geom, GeometryCollection):
        polys = [g for g in geom.geoms if isinstance(g, Polygon)]
        if polys:
            return max(polys, key=lambda g: g.area)
    return None


def to_coords(poly, decimals=4):
    return [[round(x, decimals), round(y, decimals)] for x, y in poly.exterior.coords]


def build_voronoi_cells(centroids_dict, clip_polygon):
    """Build Voronoi cells for a set of named centroids, clipped to a polygon."""
    names = list(centroids_dict.keys())
    points = np.array([centroids_dict[n] for n in names])

    vor = Voronoi(points)
    regions, vertices = voronoi_finite_polygons_2d(vor, radius=5.0)

    cells = {}
    for idx, name in enumerate(names):
        region = regions[idx]
        poly_coords = [vertices[i] for i in region]
        if len(poly_coords) < 3:
            continue
        vor_poly = make_polygon(poly_coords)
        cell = vor_poly.intersection(clip_polygon)
        cell = extract_polygon(cell)
        if cell and not cell.is_empty and cell.area > 0:
            cells[name] = cell

    return cells


def fix_siquijor():
    """Create clean Siquijor municipality boundaries using Voronoi on island outline."""
    island = make_polygon(SIQUIJOR_OUTLINE)
    print(f"Siquijor island outline area: {island.area:.6f}")

    cells = build_voronoi_cells(SIQUIJOR_CENTROIDS, island)

    features = []
    for name, cell in cells.items():
        cell = simplify(cell, tolerance=0.001)
        cell = extract_polygon(cell)
        if cell and not cell.is_empty:
            features.append({
                "type": "Feature",
                "properties": {"name": name, "admin_level": "6"},
                "geometry": {"type": "Polygon", "coordinates": [to_coords(cell)]}
            })
            print(f"  Siquijor/{name}: area={cell.area:.6f}, {len(list(cell.exterior.coords))} pts")

    return features


def fix_negros(data):
    """Keep real Negros boundaries, fill gaps for missing municipalities."""
    real_features = []
    real_polys = []

    for feat in data['features']:
        name = feat['properties']['name']
        if feat['properties'].get('approximate'):
            continue
        if name in SIQUIJOR_NAMES:
            continue
        real_features.append(feat)
        p = make_polygon(feat['geometry']['coordinates'][0])
        real_polys.append(p)

    print(f"\nReal Negros municipalities: {len(real_features)}")

    covered = unary_union(real_polys)

    # Use convex hull of real boundaries as island outline
    # This ensures ALL interior gaps are included (even wide ones)
    island_outline = covered.convex_hull.buffer(0.02)
    gap = island_outline.difference(covered)

    print(f"Covered area: {covered.area:.4f}")
    print(f"Island outline area: {island_outline.area:.4f}")
    print(f"Gap area: {gap.area:.4f}")

    if gap.is_empty or gap.area < 0.001:
        print("WARNING: Gap is very small, approximate boundaries will be tiny")

    # Voronoi over ALL Negros centroids to partition the gap
    names_ordered = list(NEGROS_CENTROIDS.keys())
    points = np.array([NEGROS_CENTROIDS[n] for n in names_ordered])

    vor = Voronoi(points)
    regions, vertices = voronoi_finite_polygons_2d(vor, radius=5.0)

    approx_features = []
    for idx, name in enumerate(names_ordered):
        if name not in MISSING_NAMES:
            continue

        region = regions[idx]
        poly_coords = [vertices[i] for i in region]
        if len(poly_coords) < 3:
            print(f"  {name}: too few vertices, skipping")
            continue

        vor_poly = make_polygon(poly_coords)

        # Intersect Voronoi cell with the gap area
        cell = vor_poly.intersection(gap)
        cell = extract_polygon(cell)

        if cell is None or cell.is_empty or cell.area < 0.001:
            # Fallback: Voronoi cell clipped to gap, try with larger gap
            bigger_gap = covered.convex_hull.buffer(0.05).difference(covered)
            cell = vor_poly.intersection(bigger_gap)
            cell = extract_polygon(cell)
            if cell is None or cell.is_empty or cell.area < 0.001:
                # Last resort: centroid buffer clipped to any available space
                centroid = Point(NEGROS_CENTROIDS[name])
                cell = centroid.buffer(0.08).intersection(bigger_gap)
                cell = extract_polygon(cell)
                if cell is None or cell.is_empty:
                    print(f"  {name}: FAILED to generate boundary")
                    continue
                print(f"  {name}: used centroid buffer fallback")
            else:
                print(f"  {name}: used expanded gap fallback")

        cell = simplify(cell, tolerance=0.002)
        cell = extract_polygon(cell)

        if cell and not cell.is_empty:
            approx_features.append({
                "type": "Feature",
                "properties": {"name": name, "admin_level": "6", "approximate": True},
                "geometry": {"type": "Polygon", "coordinates": [to_coords(cell)]}
            })
            print(f"  {name}: area={cell.area:.6f}, {len(list(cell.exterior.coords))} pts")
        else:
            print(f"  {name}: empty after simplify")

    return real_features, approx_features


def main():
    with open('frontend/src/app/utils/nir-boundaries.json', 'r') as f:
        data = json.load(f)

    # Fix Siquijor: replace with clean Voronoi-based boundaries
    print("=== Fixing Siquijor ===")
    siquijor_features = fix_siquijor()

    # Fix Negros: keep real, fill gaps
    print("\n=== Fixing Negros ===")
    real_negros, approx_negros = fix_negros(data)

    # Combine
    all_features = real_negros + siquijor_features + approx_negros

    output = {"type": "FeatureCollection", "features": all_features}
    output_json = json.dumps(output, separators=(',', ':'))

    with open('frontend/src/app/utils/nir-boundaries.json', 'w') as f:
        f.write(output_json)

    approx_count = sum(1 for f in all_features if f['properties'].get('approximate'))
    size_kb = len(output_json) / 1024
    print(f"\n=== Final ===")
    print(f"Total: {len(all_features)} features ({len(all_features)-approx_count} real, {approx_count} approx), {size_kb:.1f} KB")

    for feat in sorted(all_features, key=lambda x: x['properties']['name']):
        tag = " *" if feat['properties'].get('approximate') else ""
        print(f"  {feat['properties']['name']}{tag}")


if __name__ == '__main__':
    main()
