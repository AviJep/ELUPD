import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, Building2, Users, FileText, Code, Globe } from "lucide-react";

export function About() {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          About the Application
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          System information and details
        </p>
      </div>

      {/* Hero Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg mb-6">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-2xl">D</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                DHSUD HREDR CLUP / PDPFPD Monitoring System
              </h2>
              <p className="text-blue-100 mt-1">
                Negros Island Region Monitoring Platform
              </p>
            </div>
          </div>
          <Badge className="bg-white text-blue-700 hover:bg-white">
            Version 1.0.0
          </Badge>
        </CardContent>
      </Card>

      {/* System Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Agency Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Department
                </div>
                <div className="text-sm text-gray-600">
                  Department of Human Settlements and Urban Development (DHSUD)
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Coverage Area
                </div>
                <div className="text-sm text-gray-600">
                  Negros Island Region (Negros Occidental, Negros Oriental, Siquijor)
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Project Code
                </div>
                <div className="text-sm text-gray-600">
                  HREDR-NIR-2026
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              System Purpose
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Monitor compliance status across all municipalities and cities in the Negros Island Region
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Provide real-time GIS mapping and visualization of compliance data
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Facilitate efficient data management and reporting for HREDR compliance
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Enable archive management and monitoring capabilities
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Statistics */}
      <Card className="bg-white shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Coverage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-700">3</div>
              <div className="text-sm text-gray-700 mt-2">Provinces</div>
              <div className="text-xs text-gray-500 mt-1">
                Negros Occidental, Negros Oriental, Siquijor
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-700">62</div>
              <div className="text-sm text-gray-700 mt-2">Cities & Municipalities</div>
              <div className="text-xs text-gray-500 mt-1">
                Monitored and tracked
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-700">1,847</div>
              <div className="text-sm text-gray-700 mt-2">Total Barangays</div>
              <div className="text-xs text-gray-500 mt-1">
                Across all regions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Information */}
      <Card className="bg-white shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            System Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Frontend Technologies
                </h3>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">React 18</span>
                  <Badge variant="outline" className="text-xs">Framework</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">TypeScript</span>
                  <Badge variant="outline" className="text-xs">Language</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Tailwind CSS v4</span>
                  <Badge variant="outline" className="text-xs">Styling</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Recharts</span>
                  <Badge variant="outline" className="text-xs">Visualization</Badge>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-5 w-5 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Mapping Technologies
                </h3>
              </div>
              <div className="space-y-2 ml-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Leaflet.js</span>
                  <Badge variant="outline" className="text-xs">Maps</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">GeoJSON</span>
                  <Badge variant="outline" className="text-xs">Data Format</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">OpenStreetMap</span>
                  <Badge variant="outline" className="text-xs">Tiles</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Interactive Polygons</span>
                  <Badge variant="outline" className="text-xs">Layers</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developer Information */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Development Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Version
                </div>
                <div className="text-xs text-gray-500">Current release</div>
              </div>
              <Badge>1.0.0</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Release Date
                </div>
                <div className="text-xs text-gray-500">Initial deployment</div>
              </div>
              <Badge>March 2026</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Environment
                </div>
                <div className="text-xs text-gray-500">Deployment mode</div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Production
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>© 2026 Department of Human Settlements and Urban Development (DHSUD)</p>
        <p className="mt-1">All rights reserved. For official use only.</p>
      </div>
    </div>
  );
}
