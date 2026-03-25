export interface AnnexClupRow {
  cityMunicipality: string;
  province: string;
  planningStartYear: number | null;
  planningEndYear: number | null;
  resolutionNumber: string | null;
  clupStatus: string | null;
  prePhase: number;
  phase1: number;
  phase2: number;
  phase3: number;
  phase4: number;
  phase5: number;
  currentProgress: string;
}

export interface AnnexPdpfpRow {
  region: string;
  province: string;
  incomeClassification: string | null;
  version: string | null;
  startYear: number | null;
  endYear: number | null;
  resolutionApprovingPlan: string | null;
  yearApproved: number | null;
  yearAdopted: number | null;
  status: string;
  technicalAssistance: string | null;
  supportFromOtherInstitutions: string | null;
  withLocalShelterPlan: string | null;
  institutions: string | null;
  remarks: string | null;
}

export interface DefinitionStatusRow {
  class: string | null;
  subclass: string | null;
  definition: string | null;
  meansOfVerification: string | null;
}

export const annexClupStatus: AnnexClupRow[] = [
  {
    "cityMunicipality": "Bago",
    "province": "Negros Occidental",
    "planningStartYear": 2013,
    "planningEndYear": 2023,
    "resolutionNumber": "SP R-0623 s 2014",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 2"
  },
  {
    "cityMunicipality": "Binalbagan",
    "province": "Negros Occidental",
    "planningStartYear": 2014,
    "planningEndYear": 2023,
    "resolutionNumber": "SP R-0045 s 2015",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Cadiz",
    "province": "Negros Occidental",
    "planningStartYear": 2022,
    "planningEndYear": 2031,
    "resolutionNumber": "SP R-0740 s. 2024",
    "clupStatus": "Updated",
    "prePhase": 0,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "None Indicated"
  },
  {
    "cityMunicipality": "Calatrava",
    "province": "Negros Occidental",
    "planningStartYear": 2000,
    "planningEndYear": 2009,
    "resolutionNumber": "SP R-452",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Candoni",
    "province": "Negros Occidental",
    "planningStartYear": 2000,
    "planningEndYear": 2010,
    "resolutionNumber": "SP R-799",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Cauayan",
    "province": "Negros Occidental",
    "planningStartYear": 2000,
    "planningEndYear": 2009,
    "resolutionNumber": "SP R-455",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Enrique B. Magalona",
    "province": "Negros Occidental",
    "planningStartYear": 1997,
    "planningEndYear": 2010,
    "resolutionNumber": "SP R-458",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Escalante",
    "province": "Negros Occidental",
    "planningStartYear": 2000,
    "planningEndYear": 2009,
    "resolutionNumber": "SP R-912",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Himamaylan",
    "province": "Negros Occidental",
    "planningStartYear": 2022,
    "planningEndYear": 2032,
    "resolutionNumber": "SP R-0681 s. 2024",
    "clupStatus": "Updated",
    "prePhase": 0,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "None Indicated"
  },
  {
    "cityMunicipality": "Hinigaran",
    "province": "Negros Occidental",
    "planningStartYear": 2000,
    "planningEndYear": 2009,
    "resolutionNumber": "SP R-823",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Hinoba-an",
    "province": "Negros Occidental",
    "planningStartYear": 2020,
    "planningEndYear": 2030,
    "resolutionNumber": "SP R-0149",
    "clupStatus": "Updated",
    "prePhase": 0,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "None Indicated"
  },
  {
    "cityMunicipality": "Ilog",
    "province": "Negros Occidental",
    "planningStartYear": 2000,
    "planningEndYear": 2010,
    "resolutionNumber": "SP R-104",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Isabela",
    "province": "Negros Occidental",
    "planningStartYear": 2005,
    "planningEndYear": 2010,
    "resolutionNumber": "SP R-0946",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Kabankalan",
    "province": "Negros Occidental",
    "planningStartYear": 2018,
    "planningEndYear": 2027,
    "resolutionNumber": "SP R-1065",
    "clupStatus": "Updated",
    "prePhase": 0,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "None Indicated"
  },
  {
    "cityMunicipality": "La Carlota",
    "province": "Negros Occidental",
    "planningStartYear": 2013,
    "planningEndYear": 2022,
    "resolutionNumber": "SP R-0391 s 2013",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "La Castellana",
    "province": "Negros Occidental",
    "planningStartYear": 1995,
    "planningEndYear": 2025,
    "resolutionNumber": "SP R-822",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Manapla",
    "province": "Negros Occidental",
    "planningStartYear": 2013,
    "planningEndYear": 2022,
    "resolutionNumber": "SP R-0718 s 2014",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 1"
  },
  {
    "cityMunicipality": "Moises Padilla",
    "province": "Negros Occidental",
    "planningStartYear": 2000,
    "planningEndYear": 2010,
    "resolutionNumber": "SP R-960",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 1"
  },
  {
    "cityMunicipality": "Murcia",
    "province": "Negros Occidental",
    "planningStartYear": 2001,
    "planningEndYear": 2010,
    "resolutionNumber": "SP R-671",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Pontevedra",
    "province": "Negros Occidental",
    "planningStartYear": 1999,
    "planningEndYear": 2009,
    "resolutionNumber": "SP R-918",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Pulupandan",
    "province": "Negros Occidental",
    "planningStartYear": 2000,
    "planningEndYear": 2010,
    "resolutionNumber": "SP R-75",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 3"
  },
  {
    "cityMunicipality": "Sagay",
    "province": "Negros Occidental",
    "planningStartYear": 2021,
    "planningEndYear": 2030,
    "resolutionNumber": "SP R-1081 s 2022",
    "clupStatus": "Updated",
    "prePhase": 0,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "None Indicated"
  },
  {
    "cityMunicipality": "San Carlos",
    "province": "Negros Occidental",
    "planningStartYear": 2014,
    "planningEndYear": 2023,
    "resolutionNumber": "SP R-0737 s 2015",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "San Enrique",
    "province": "Negros Occidental",
    "planningStartYear": 2013,
    "planningEndYear": 2023,
    "resolutionNumber": "SP R-0859 s 2015",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Silay",
    "province": "Negros Occidental",
    "planningStartYear": 2008,
    "planningEndYear": 2017,
    "resolutionNumber": "SP R-0092",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Sipalay",
    "province": "Negros Occidental",
    "planningStartYear": 2006,
    "planningEndYear": 2015,
    "resolutionNumber": "SP R-300",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Talisay",
    "province": "Negros Occidental",
    "planningStartYear": 2022,
    "planningEndYear": 2032,
    "resolutionNumber": "SP R-1382 s 2023",
    "clupStatus": "Updated",
    "prePhase": 0,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "None Indicated"
  },
  {
    "cityMunicipality": "Toboso",
    "province": "Negros Occidental",
    "planningStartYear": 2013,
    "planningEndYear": 2022,
    "resolutionNumber": "SP R-0378 s 2018",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Valladolid",
    "province": "Negros Occidental",
    "planningStartYear": 2001,
    "planningEndYear": 2010,
    "resolutionNumber": "SP R-534",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Victorias",
    "province": "Negros Occidental",
    "planningStartYear": 2018,
    "planningEndYear": 2028,
    "resolutionNumber": "SP R-0674",
    "clupStatus": "Updated",
    "prePhase": 0,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "None Indicated"
  },
  {
    "cityMunicipality": "Salvador Benedicto",
    "province": "Negros Occidental",
    "planningStartYear": 2001,
    "planningEndYear": 2010,
    "resolutionNumber": "SP R-21",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Bacolod",
    "province": "Negros Occidental",
    "planningStartYear": 2017,
    "planningEndYear": 2026,
    "resolutionNumber": "DHSUD DC No. 2023-004",
    "clupStatus": "Updated",
    "prePhase": 0,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "None Indicated"
  },
  {
    "cityMunicipality": "Amlan",
    "province": "Negros Oriental",
    "planningStartYear": 1982,
    "planningEndYear": 1991,
    "resolutionNumber": "SP 771",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 1"
  },
  {
    "cityMunicipality": "Ayungon",
    "province": "Negros Oriental",
    "planningStartYear": 2006,
    "planningEndYear": 2015,
    "resolutionNumber": "SP 716",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Bacong",
    "province": "Negros Oriental",
    "planningStartYear": 1983,
    "planningEndYear": 1993,
    "resolutionNumber": "Res. No. 25",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 2"
  },
  {
    "cityMunicipality": "Bais",
    "province": "Negros Oriental",
    "planningStartYear": 1996,
    "planningEndYear": 2005,
    "resolutionNumber": "SP 91 s.96",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Basay",
    "province": "Negros Oriental",
    "planningStartYear": 1979,
    "planningEndYear": 1990,
    "resolutionNumber": "HSRC Res. No. R-38-2 s.1980",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 1"
  },
  {
    "cityMunicipality": "Bayawan",
    "province": "Negros Oriental",
    "planningStartYear": 2003,
    "planningEndYear": 2012,
    "resolutionNumber": "SP 367 s. 2003",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Bindoy",
    "province": "Negros Oriental",
    "planningStartYear": 2020,
    "planningEndYear": 2030,
    "resolutionNumber": "SP Res. No. 1261 s2024",
    "clupStatus": "Updated",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Canlaon",
    "province": "Negros Oriental",
    "planningStartYear": 1996,
    "planningEndYear": 2026,
    "resolutionNumber": "SP 67 s. 2001",
    "clupStatus": "Updated",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Dauin",
    "province": "Negros Oriental",
    "planningStartYear": 2020,
    "planningEndYear": 2029,
    "resolutionNumber": "SP Resolution No. 755",
    "clupStatus": "Updated",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Dumaguete",
    "province": "Negros Oriental",
    "planningStartYear": 2013,
    "planningEndYear": 2023,
    "resolutionNumber": "SP 703 s.2015",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 1"
  },
  {
    "cityMunicipality": "Guihulngan",
    "province": "Negros Oriental",
    "planningStartYear": 2021,
    "planningEndYear": 2029,
    "resolutionNumber": "SP Res. No. 1099-2023",
    "clupStatus": "Updated",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Jimalalud",
    "province": "Negros Oriental",
    "planningStartYear": null,
    "planningEndYear": null,
    "resolutionNumber": null,
    "clupStatus": "#VALUE!",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 3"
  },
  {
    "cityMunicipality": "La Libertad",
    "province": "Negros Oriental",
    "planningStartYear": null,
    "planningEndYear": null,
    "resolutionNumber": null,
    "clupStatus": "#VALUE!",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 3"
  },
  {
    "cityMunicipality": "Mabinay",
    "province": "Negros Oriental",
    "planningStartYear": 2022,
    "planningEndYear": 2031,
    "resolutionNumber": "SP. Resolution No. 354",
    "clupStatus": "Updated",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Manjuyod",
    "province": "Negros Oriental",
    "planningStartYear": 1982,
    "planningEndYear": 1992,
    "resolutionNumber": "R 214 s. 1984",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "Pamplona",
    "province": "Negros Oriental",
    "planningStartYear": 2006,
    "planningEndYear": 2016,
    "resolutionNumber": "SP 319",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 0,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Prephase"
  },
  {
    "cityMunicipality": "San Jose",
    "province": "Negros Oriental",
    "planningStartYear": 2020,
    "planningEndYear": 2029,
    "resolutionNumber": "SP Resolution No. 547, Series of 2022",
    "clupStatus": "Updated",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Santa Catalina",
    "province": "Negros Oriental",
    "planningStartYear": 2010,
    "planningEndYear": 2019,
    "resolutionNumber": "SP 559",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 0,
    "currentProgress": "Phase 4"
  },
  {
    "cityMunicipality": "Siaton",
    "province": "Negros Oriental",
    "planningStartYear": 1979,
    "planningEndYear": 2000,
    "resolutionNumber": "Resolution No. R11 s. 1981",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 2"
  },
  {
    "cityMunicipality": "Sibulan",
    "province": "Negros Oriental",
    "planningStartYear": 2020,
    "planningEndYear": 2029,
    "resolutionNumber": "SP Resolution No. 111",
    "clupStatus": "Updated",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Tanjay",
    "province": "Negros Oriental",
    "planningStartYear": 1998,
    "planningEndYear": 2010,
    "resolutionNumber": "SP 312",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 2"
  },
  {
    "cityMunicipality": "Tayasan",
    "province": "Negros Oriental",
    "planningStartYear": 1979,
    "planningEndYear": 2000,
    "resolutionNumber": "R38-2 s.1980",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 2"
  },
  {
    "cityMunicipality": "Valencia",
    "province": "Negros Oriental",
    "planningStartYear": 2004,
    "planningEndYear": 2013,
    "resolutionNumber": "SP Res. 1009-2025",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Vallehermoso",
    "province": "Negros Oriental",
    "planningStartYear": 2020,
    "planningEndYear": 2029,
    "resolutionNumber": "SP Res. No 35",
    "clupStatus": "Updated",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Zamboanguita",
    "province": "Negros Oriental",
    "planningStartYear": 2008,
    "planningEndYear": 2017,
    "resolutionNumber": "SP 394",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Enrique Villanueva",
    "province": "Siquijor",
    "planningStartYear": 2001,
    "planningEndYear": 2010,
    "resolutionNumber": "SP 092",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 1"
  },
  {
    "cityMunicipality": "Larena",
    "province": "Siquijor",
    "planningStartYear": 2001,
    "planningEndYear": 2010,
    "resolutionNumber": "SP 092",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 1"
  },
  {
    "cityMunicipality": "Lazi",
    "province": "Siquijor",
    "planningStartYear": 2001,
    "planningEndYear": 2010,
    "resolutionNumber": "SP 092",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 1"
  },
  {
    "cityMunicipality": "Maria",
    "province": "Siquijor",
    "planningStartYear": 2001,
    "planningEndYear": 2010,
    "resolutionNumber": "SP 092",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 0,
    "phase3": 0,
    "phase4": 0,
    "phase5": 0,
    "currentProgress": "Phase 1"
  },
  {
    "cityMunicipality": "San Juan",
    "province": "Siquijor",
    "planningStartYear": 2002,
    "planningEndYear": 2012,
    "resolutionNumber": "SP 034",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  },
  {
    "cityMunicipality": "Siquijor",
    "province": "Siquijor",
    "planningStartYear": 2001,
    "planningEndYear": 2010,
    "resolutionNumber": "SP 092",
    "clupStatus": "For Updating",
    "prePhase": 1,
    "phase1": 1,
    "phase2": 1,
    "phase3": 1,
    "phase4": 1,
    "phase5": 1,
    "currentProgress": "Phase 5"
  }
];

export const annexPdpfpStatus: AnnexPdpfpRow[] = [
  {
    "region": "Negros Island Region",
    "province": "Negros Occidental",
    "incomeClassification": "1st",
    "version": "2nd",
    "startYear": 2023,
    "endYear": 2028,
    "resolutionApprovingPlan": "DHSUD DC No. 2024-014 s. 2024",
    "yearApproved": 2024,
    "yearAdopted": 2023,
    "status": "Approved/Updated",
    "technicalAssistance": null,
    "supportFromOtherInstitutions": null,
    "withLocalShelterPlan": null,
    "institutions": null,
    "remarks": null
  },
  {
    "region": "Negros Island Region",
    "province": "Negros Oriental",
    "incomeClassification": "1st",
    "version": "1st",
    "startYear": null,
    "endYear": null,
    "resolutionApprovingPlan": null,
    "yearApproved": null,
    "yearAdopted": null,
    "status": "Approved/Updated",
    "technicalAssistance": null,
    "supportFromOtherInstitutions": null,
    "withLocalShelterPlan": null,
    "institutions": null,
    "remarks": null
  },
  {
    "region": "Negros Island Region",
    "province": "Siquijor",
    "incomeClassification": "1st",
    "version": "1st",
    "startYear": 2023,
    "endYear": 2032,
    "resolutionApprovingPlan": "DHSUD DC No. 2024-021 s. 2024",
    "yearApproved": 2024,
    "yearAdopted": null,
    "status": "Approved/Updated",
    "technicalAssistance": null,
    "supportFromOtherInstitutions": null,
    "withLocalShelterPlan": null,
    "institutions": null,
    "remarks": null
  }
];

export const definitionStatusRows: DefinitionStatusRow[] = [
  {
    "class": "CLUP Status",
    "subclass": "Updated",
    "definition": "The CLUP is still within its planning period, or is still within 10 years since its approval.",
    "meansOfVerification": null
  },
  {
    "class": "CLUP Status",
    "subclass": "For updating",
    "definition": "The CLUP is outdated and is due for updating. An existing outdated CLUP is still implementable.",
    "meansOfVerification": null
  },
  {
    "class": "CLUP Status",
    "subclass": "No CLUP",
    "definition": "The LGU has no CLUPs formulated.",
    "meansOfVerification": null
  },
  {
    "class": "Preparation/Updating Status / TPAP Phase",
    "subclass": "Preparatory phase (Pre-phase)",
    "definition": "LGU created MOA and TWG, and conducted TNA.",
    "meansOfVerification": "Baseline Situation Report (MOA, TNA, Resolution on Creation of TWG)"
  },
  {
    "class": "Preparation/Updating Status / TPAP Phase",
    "subclass": "Phase 1",
    "definition": "LGU conducted data generation and analysis pertinent to topics discussed using the Participatory Rapid Rural Appraisal (PRA) techniques.",
    "meansOfVerification": "Ecosystem Analysis, Special Area Studies, CLUP Excel Matrices and Initial Thematic Maps"
  },
  {
    "class": "Preparation/Updating Status / TPAP Phase",
    "subclass": "Phase 2",
    "definition": "LGU  conducted situational analysis linking ouputs in Phase 1 and CCA/DRR.",
    "meansOfVerification": "CDRA Report, CDRA Maps and Completed Sectoral Studies"
  },
  {
    "class": "Preparation/Updating Status / TPAP Phase",
    "subclass": "Phase 3",
    "definition": "LGU prepared their vision statements, defined their goals and objectives, and determined their development thrusts and spatial strategies.",
    "meansOfVerification": "Vision, Goals and Objectives, Structure/Concept Plan"
  },
  {
    "class": "Preparation/Updating Status / TPAP Phase",
    "subclass": "Phase 4",
    "definition": "LGU prepared Land Use Plan.",
    "meansOfVerification": "Draft CLUP and Proposed Land Use Maps"
  },
  {
    "class": "Preparation/Updating Status / TPAP Phase",
    "subclass": "Phase 5",
    "definition": "LGU demonstrated competencies in the preparation of a zoning ordinance, detailing the investment programs and projects including mitigation and adaptation measures.",
    "meansOfVerification": "Draft Zoning Ordinance and Zoning Maps"
  },
  {
    "class": "Preparation/Updating Status / TPAP Phase",
    "subclass": null,
    "definition": "LGU demonstrated competecies in the preparation of an M&E Action Plan for CLUP implementation and documentation of publicc hearings.",
    "meansOfVerification": null
  },
  {
    "class": "Review and Approval Status",
    "subclass": "RA 1",
    "definition": "Transmitted by LGU to SP/OAGMP/DHSUD-RFO for endorsement to Reviewing body for review",
    "meansOfVerification": "Receiving Copy of Transmittal Letter/Transmittal Letter"
  },
  {
    "class": "Review and Approval Status",
    "subclass": "RA 2",
    "definition": "Under review by PLUC/RLUC/Joint MMDA&DHSUD",
    "meansOfVerification": "Letter Requesting for Comments/Meeting on Review of CLUP"
  },
  {
    "class": "Review and Approval Status",
    "subclass": "RA 3",
    "definition": "Under revision by LGU to include recommendations of PLUC/RLUC/Joint MMDA&DHSUD",
    "meansOfVerification": "Review Comments"
  },
  {
    "class": "Review and Approval Status",
    "subclass": "RA 4",
    "definition": "Returned to PLUC/RLUC/DHSUD for final review",
    "meansOfVerification": "Revised CLUP"
  },
  {
    "class": "Review and Approval Status",
    "subclass": "RA 5",
    "definition": "Endorsed to LGU by PLUC/RLUC/DHSUD for adoption of CLUP and enactment of ZO",
    "meansOfVerification": "Endorsement Letter/Resolution Endorsing CLUP for Adoption and ZO for Enactment"
  },
  {
    "class": "Review and Approval Status",
    "subclass": "RA 6",
    "definition": "Draft adopted and enacted by LGU/MMC",
    "meansOfVerification": "Resolution Adopting and Enacting the CLUP and ZO"
  },
  {
    "class": "Review and Approval Status",
    "subclass": "RA 7",
    "definition": "For SP/MMDA/DHSUD approval",
    "meansOfVerification": "DHSUD/SP Resolution Approving/Ratifying CLUP"
  },
  {
    "class": "Technical Assistance Provided",
    "subclass": "Assisted",
    "definition": null,
    "meansOfVerification": null
  },
  {
    "class": "Technical Assistance Provided",
    "subclass": "Trained",
    "definition": null,
    "meansOfVerification": null
  },
  {
    "class": "Technical Assistance Provided",
    "subclass": "Trained and assisted",
    "definition": null,
    "meansOfVerification": null
  },
  {
    "class": "Technical Assistance Provided",
    "subclass": "No assistance",
    "definition": null,
    "meansOfVerification": null
  },
  {
    "class": "Support from Other Institutions",
    "subclass": "Consultant",
    "definition": null,
    "meansOfVerification": null
  },
  {
    "class": "Support from Other Institutions",
    "subclass": "National Government Agency",
    "definition": null,
    "meansOfVerification": null
  },
  {
    "class": "Support from Other Institutions",
    "subclass": "Academe",
    "definition": null,
    "meansOfVerification": null
  },
  {
    "class": "Support from Other Institutions",
    "subclass": "Donor Agency",
    "definition": null,
    "meansOfVerification": null
  },
  {
    "class": "Support from Other Institutions",
    "subclass": "Others",
    "definition": null,
    "meansOfVerification": null
  },
  {
    "class": "Support from Other Institutions",
    "subclass": "None",
    "definition": null,
    "meansOfVerification": null
  },
  {
    "class": "Class",
    "subclass": "Subclass",
    "definition": "Definition",
    "meansOfVerification": "Means of Verification"
  },
  {
    "class": "PDPFP/PPFP Status",
    "subclass": "Approved and updated",
    "definition": "The PDPFP/PPFP is still within its planning period, or is still within 10 years since its approval.",
    "meansOfVerification": null
  },
  {
    "class": "PDPFP/PPFP Status",
    "subclass": "For approval",
    "definition": "The PDPFP/PPFP has been endorsed by the SP and awaiting approval from DHSUD",
    "meansOfVerification": null
  },
  {
    "class": "PDPFP/PPFP Status",
    "subclass": "For updating",
    "definition": "The PDPFP/PPFP is outdated and is due for updating. An existing outdated CLUP is still implementable.",
    "meansOfVerification": null
  },
  {
    "class": "PDPFP/PPFP Status",
    "subclass": "No PDPFP/PPFP",
    "definition": "The LGU has no PDPFP/PPFP formulated.",
    "meansOfVerification": null
  },
  {
    "class": "PDPFP/PPFP Version",
    "subclass": null,
    "definition": "Number of times the PDPFP/PPFP has been revised",
    "meansOfVerification": "PDPFP/PPFP  Document"
  },
  {
    "class": "Date of Approval",
    "subclass": null,
    "definition": "Date when the PDPFP/PPFP was approved by DHSUD",
    "meansOfVerification": "Certificate of approval from DHSUD"
  },
  {
    "class": "Date of Adoption",
    "subclass": null,
    "definition": "Date when the PDPFP/PPFP was adopted by the SP",
    "meansOfVerification": "SP Resolution"
  },
  {
    "class": "Resolution Approving Plan",
    "subclass": null,
    "definition": "DHSUD Resolution approving the PDPFP/PPFP",
    "meansOfVerification": "DHSUD Resolution/ Department Order"
  }
];
