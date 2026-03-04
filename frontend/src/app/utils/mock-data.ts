/**
 * Mock Data for DHSUD HREDR Compliance Monitoring System
 * 
 * This file contains sample data for development and testing.
 * Replace with real data from your database or API.
 */

export interface ComplianceStatus {
  updated: number;
  updating: number;
  nonCompliant: number;
  expired: number;
}

export interface Municipality {
  id: number;
  name: string;
  province: string;
  barangays: number;
  status: "updated" | "updating" | "non-compliance" | "expired";
  lastUpdate: string;
  compliancePercentage?: number;
}

export interface Province {
  id: number;
  name: string;
  municipalities: number;
  barangays: number;
  status: string;
}

// Dashboard Stats
export const mockStats: ComplianceStatus = {
  updated: 48,
  updating: 12,
  nonCompliant: 8,
  expired: 2,
};

// Provinces Data
export const mockProvinces: Province[] = [
  { id: 1, name: "Negros Occidental", municipalities: 43, barangays: 662, status: "active" },
  { id: 2, name: "Negros Oriental", municipalities: 19, barangays: 557, status: "active" },
  { id: 3, name: "Siquijor", municipalities: 6, barangays: 137, status: "active" },
];

// Municipalities Data
export const mockMunicipalities: Municipality[] = [
  { id: 1, name: "Bacolod City", province: "Negros Occidental", barangays: 61, status: "updated", lastUpdate: "2026-03-02", compliancePercentage: 98 },
  { id: 2, name: "Dumaguete City", province: "Negros Oriental", barangays: 30, status: "updated", lastUpdate: "2026-03-03", compliancePercentage: 96 },
  { id: 3, name: "Silay City", province: "Negros Occidental", barangays: 16, status: "updated", lastUpdate: "2026-03-01", compliancePercentage: 94 },
  { id: 4, name: "Cadiz City", province: "Negros Occidental", barangays: 23, status: "non-compliance", lastUpdate: "2026-01-15", compliancePercentage: 45 },
  { id: 5, name: "Bayawan City", province: "Negros Oriental", barangays: 28, status: "non-compliance", lastUpdate: "2026-01-10", compliancePercentage: 52 },
  { id: 6, name: "Talisay City", province: "Negros Occidental", barangays: 14, status: "updating", lastUpdate: "2026-02-28", compliancePercentage: 78 },
  { id: 7, name: "Bago City", province: "Negros Occidental", barangays: 24, status: "updating", lastUpdate: "2026-02-25", compliancePercentage: 72 },
  { id: 8, name: "Kabankalan City", province: "Negros Occidental", barangays: 32, status: "expired", lastUpdate: "2025-11-20", compliancePercentage: 35 },
  { id: 9, name: "Maria", province: "Siquijor", barangays: 21, status: "non-compliance", lastUpdate: "2026-01-20", compliancePercentage: 48 },
  { id: 10, name: "Siquijor", province: "Siquijor", barangays: 42, status: "updated", lastUpdate: "2026-03-01", compliancePercentage: 97 },
];

// Status color configuration
export const statusColors = {
  updated: "#10b981",
  updating: "#f59e0b",
  "non-compliance": "#ef4444",
  expired: "#6b7280",
};

// Recent activities
export const mockRecentActivities = [
  { location: "Bacolod City", action: "Status updated to Compliant", time: "2 hours ago" },
  { location: "Dumaguete City", action: "Barangay data imported", time: "5 hours ago" },
  { location: "Silay City", action: "Compliance report generated", time: "1 day ago" },
  { location: "Siquijor", action: "New barangay added", time: "2 days ago" },
  { location: "Talisay City", action: "Status marked as Updating", time: "3 days ago" },
];
