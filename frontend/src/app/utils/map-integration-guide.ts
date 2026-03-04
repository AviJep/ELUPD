/**
 * DHSUD HREDR Compliance Monitoring System
 * 
 * Integration Guide for Map Intelligence Module
 * 
 * This system is designed to work with Leaflet.js for interactive GIS mapping.
 * The Leaflet library is already installed and configured.
 * 
 * TO INTEGRATE REAL GEOJSON DATA:
 * 
 * 1. Replace the mock negrosGeoJSON data in /src/app/pages/MapIntelligence.tsx
 *    with your actual GeoJSON file containing Negros Island Region boundaries.
 * 
 * 2. Your GeoJSON should follow this structure:
 *    {
 *      "type": "FeatureCollection",
 *      "features": [
 *        {
 *          "type": "Feature",
 *          "properties": {
 *            "name": "Municipality Name",
 *            "province": "Province Name",
 *            "status": "updated|updating|non-compliance|expired",
 *            "barangayCount": 30,
 *            "lastUpdate": "2026-03-04"
 *          },
 *          "geometry": {
 *            "type": "Polygon",
 *            "coordinates": [[[lng, lat], [lng, lat], ...]]
 *          }
 *        }
 *      ]
 *    }
 * 
 * 3. To load from external file:
 *    - Place your GeoJSON file in /public/data/negros-boundaries.json
 *    - Use fetch API to load it:
 *      ```
 *      useEffect(() => {
 *        fetch('/data/negros-boundaries.json')
 *          .then(res => res.json())
 *          .then(data => {
 *            // Use data instead of negrosGeoJSON
 *          });
 *      }, []);
 *      ```
 * 
 * 4. Status Colors:
 *    - updated: #10b981 (green) - Compliant and up to date
 *    - updating: #f59e0b (orange) - In progress
 *    - non-compliance: #ef4444 (red) - Non-compliant
 *    - expired: #6b7280 (gray) - Expired records
 * 
 * 5. Map Features:
 *    - Click on any region to open the management panel
 *    - Hover over regions for tooltip information
 *    - Use the legend to filter by status
 *    - Polygons automatically change color based on status
 * 
 * 6. Customizing Map Tiles:
 *    The default uses OpenStreetMap. To use other providers:
 *    - Change the tile URL in MapIntelligence.tsx
 *    - Example providers: Mapbox, Google Maps, HERE Maps
 * 
 * LEAFLET.JS DOCUMENTATION:
 * https://leafletjs.com/reference.html
 * 
 * For local ZIP API integration:
 * - Leaflet can be used with local tile servers
 * - The current setup loads from npm package (included)
 * - All Leaflet assets are bundled automatically by Vite
 */

export const MAP_INTEGRATION_GUIDE = {
  leafletVersion: "1.9.4",
  geoJSONFormat: "FeatureCollection",
  requiredProperties: ["name", "province", "status", "barangayCount", "lastUpdate"],
  statusOptions: ["updated", "updating", "non-compliance", "expired"],
  coordinateSystem: "WGS84 (EPSG:4326)",
};
