import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, Building2, Users, FileText, Code, Globe, Bug, Mail, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";

export function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Blue Header Banner */}
      <div className="bg-[#003087] text-white">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  About the Application
                </h1>
                <p className="text-sm md:text-base font-semibold text-blue-200">
                  System information and details
                </p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-yellow-300 font-semibold text-sm">
                As of March 12, 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">

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
            Version 1.5.0
          </Badge>
        </CardContent>
      </Card>

      {/* Bug Report / Support Section */}
      <Card className="bg-white shadow-md border-l-4 border-red-500 mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-500" />
            <CardTitle className="text-lg font-bold text-gray-900">
              Bug Report & Technical Support
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-6">
            Encountered an issue or have a suggestion? Please contact our technical support team. Your feedback helps us maintain system integrity and improve user experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="mailto:jepoyinere2003@gmail.com" 
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-red-500 transition-colors">
                <Mail className="h-5 w-5 text-red-500 group-hover:text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Support</p>
                <p className="text-sm font-black text-gray-700">jepoyinere2003@gmail.com</p>
              </div>
            </a>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Internal Extension</p>
                <p className="text-sm font-black text-gray-700">ICT-NIR (Ext. 402)</p>
              </div>
            </div>
          </div>
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
                  <span className="text-sm text-gray-700">D3.js (Geo)</span>
                  <Badge variant="outline" className="text-xs">Projection</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">GeoJSON</span>
                  <Badge variant="outline" className="text-xs">Format</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">SVG Engine</span>
                  <Badge variant="outline" className="text-xs">Rendering</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Interactive Layers</span>
                  <Badge variant="outline" className="text-xs">UX</Badge>
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
              <Badge>1.5.0</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Release Date
                </div>
                <div className="text-xs text-gray-500">Unified deployment</div>
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
                Prisma Unified
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
    </div>
  );
}
