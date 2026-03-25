import json
from pathlib import Path
from shapely.geometry import Polygon

BOUNDARIES_PATH = Path(__file__).resolve().parents[2] / "frontend" / "src" / "app" / "utils" / "nir-boundaries.json"

with BOUNDARIES_PATH.open() as f:
    data = json.load(f)

siq_names = {'Siquijor','Enrique Villanueva','Larena','Lazi','Maria','San Juan'}

for feat in data['features']:
    name = feat['properties']['name']
    coords = feat['geometry']['coordinates'][0]
    approx = feat['properties'].get('approximate', False)
    
    lons = [c[0] for c in coords]
    lats = [c[1] for c in coords]
    
    if name in siq_names or approx:
        tag = ' [APPROX]' if approx else ' [SIQ]'
        p = Polygon(coords)
        print(f'{name}{tag}: {len(coords)} pts, area={p.area:.6f}, lon=[{min(lons):.4f},{max(lons):.4f}], lat=[{min(lats):.4f},{max(lats):.4f}]')

print(f'\nTotal features: {len(data["features"])}')

# Check how big the gap-fill approximate boundaries are vs real ones
print('\n--- All Negros boundary areas ---')
areas = []
for feat in data['features']:
    name = feat['properties']['name']
    if name in siq_names:
        continue
    coords = feat['geometry']['coordinates'][0]
    p = Polygon(coords)
    if not p.is_valid:
        p = p.buffer(0)
    approx = feat['properties'].get('approximate', False)
    areas.append((name, p.area, approx))

areas.sort(key=lambda x: x[1], reverse=True)
for name, area, approx in areas:
    tag = ' *' if approx else ''
    print(f'  {name}: {area:.6f}{tag}')
