// CLUP/PDPFP Status types for DHSUD NIR ELUPD System

export type CLUPStatus = 'updated' | 'for-updating' | 'no-clup' | 'expired';

export interface Municipality {
  id: string;
  name: string;
  province: string;
  clupStatus: CLUPStatus;
  yearApproved: number | null;
  endYear: number | null;
  riskInformed: boolean;
  integratedShelterPlan: boolean;
  lastUpdate: string;
  // Legacy compat
  status?: 'updated' | 'updating' | 'non-compliance';
}

export type MunicipalityStatus = 'updated' | 'updating' | 'non-compliance';

export const CLUP_STATUS_COLORS: Record<CLUPStatus, string> = {
  'updated': '#10b981',
  'for-updating': '#f59e0b',
  'no-clup': '#ef4444',
  'expired': '#eab308',
};

export const CLUP_STATUS_BG: Record<CLUPStatus, string> = {
  'updated': 'bg-green-500',
  'for-updating': 'bg-orange-500',
  'no-clup': 'bg-red-500',
  'expired': 'bg-yellow-500',
};

export const CLUP_STATUS_LABELS: Record<CLUPStatus, string> = {
  'updated': 'Updated',
  'for-updating': 'For Updating',
  'no-clup': 'No CLUP',
  'expired': 'Expired',
};

// Legacy exports for backward compatibility
export const STATUS_COLORS: Record<MunicipalityStatus, string> = {
  'updated': 'bg-green-500',
  'updating': 'bg-orange-500',
  'non-compliance': 'bg-red-500',
};

export const STATUS_LABELS: Record<MunicipalityStatus, string> = {
  'updated': 'Updated',
  'updating': 'Updating / Expired',
  'non-compliance': 'Non-Compliance',
};
