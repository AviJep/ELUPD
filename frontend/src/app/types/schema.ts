// Frontend TypeScript Interfaces for NIR Geographic Dashboard
// Aligned with Prisma Backend Schema

export type LGUType = 'ICC' | 'HUC' | 'CC' | 'M';
export type IncomeClass = '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th';
export type CLUPStatusLabel = 'Prephase' | 'CLUP Formulation' | 'Review & Approval' | 'Not Determined';
export type PDPFPStatusLabel = 'Approved' | 'Adopted' | 'For Updating' | 'No PDPFP' | 'For Approval';

export interface LGUDirectory {
  id: number;
  region: string;
  province: string;
  city_municipality: string;
  lgu_type: LGUType;
  income_class: IncomeClass;
  geo_json_id: string;
  
  clup_progress?: CLUPProgress;
  pdpfp_status?: PDPFPStatus;
  housing_projects?: HousingProject[];
}

export interface CLUPProgress {
  id: number;
  lgu_id: number;
  clup_status: CLUPStatusLabel;
  current_phase: string;
}

export interface PDPFPStatus {
  id: number;
  lgu_id: number;
  latest_status: PDPFPStatusLabel;
  date_of_approval?: string;
  year_adopted?: number;
  year_approved?: number;
  end_year?: number;
}

export interface HousingProject {
  id: number;
  lgu_id: number;
  project_name: string;
  developer: string;
  project_type: string;
  status: string;
}
