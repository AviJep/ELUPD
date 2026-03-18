import { Municipality, CLUPStatus } from '../types';

// Complete list of all LGUs in the Negros Island Region (NIR)
// Negros Occidental: 13 cities + 19 municipalities = 32
// Negros Oriental: 6 cities + 19 municipalities = 25
// Siquijor: 6 municipalities = 6
// Total: 63 LGUs

export const nirMunicipalities: Municipality[] = [
  // ===== NEGROS OCCIDENTAL - CITIES =====
  { id: 'noc-01', name: 'Bacolod City', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2019, endYear: 2029, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-01-15' },
  { id: 'noc-02', name: 'Bago City', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2018, endYear: 2028, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-01-10' },
  { id: 'noc-03', name: 'Cadiz City', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2010, endYear: 2020, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-08-20' },
  { id: 'noc-04', name: 'Escalante City', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2012, endYear: 2022, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-09-15' },
  { id: 'noc-05', name: 'Himamaylan City', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2020, endYear: 2030, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-02-01' },
  { id: 'noc-06', name: 'Kabankalan City', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2017, endYear: 2027, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2025-12-20' },
  { id: 'noc-07', name: 'La Carlota City', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2008, endYear: 2018, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-07-10' },
  { id: 'noc-08', name: 'Sagay City', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2021, endYear: 2031, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-01-25' },
  { id: 'noc-09', name: 'San Carlos City', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2019, endYear: 2029, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-01-18' },
  { id: 'noc-10', name: 'Silay City', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2020, endYear: 2030, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-02-05' },
  { id: 'noc-11', name: 'Sipalay City', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2011, endYear: 2021, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-10-15' },
  { id: 'noc-12', name: 'Talisay City', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2018, endYear: 2028, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-01-30' },
  { id: 'noc-13', name: 'Victorias City', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2019, endYear: 2029, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-02-10' },

  // ===== NEGROS OCCIDENTAL - MUNICIPALITIES =====
  { id: 'noc-14', name: 'Binalbagan', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2009, endYear: 2019, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-06-15' },
  { id: 'noc-15', name: 'Calatrava', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2021, endYear: 2031, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-01-20' },
  { id: 'noc-16', name: 'Candoni', province: 'Negros Occidental', clupStatus: 'no-clup', yearApproved: null, endYear: null, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-03-01' },
  { id: 'noc-17', name: 'Cauayan', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2017, endYear: 2027, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2025-11-20' },
  { id: 'noc-18', name: 'Don Salvador Benedicto', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2013, endYear: 2023, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-08-10' },
  { id: 'noc-19', name: 'Enrique B. Magalona', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2020, endYear: 2030, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-01-12' },
  { id: 'noc-20', name: 'Hinigaran', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2010, endYear: 2020, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-07-25' },
  { id: 'noc-21', name: 'Hinoba-an', province: 'Negros Occidental', clupStatus: 'no-clup', yearApproved: null, endYear: null, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-04-01' },
  { id: 'noc-22', name: 'Ilog', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2011, endYear: 2021, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-09-20' },
  { id: 'noc-23', name: 'Isabela', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2019, endYear: 2029, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-01-08' },
  { id: 'noc-24', name: 'La Castellana', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2018, endYear: 2028, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2025-12-15' },
  { id: 'noc-25', name: 'Manapla', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2012, endYear: 2022, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-10-01' },
  { id: 'noc-26', name: 'Moises Padilla', province: 'Negros Occidental', clupStatus: 'no-clup', yearApproved: null, endYear: null, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-05-01' },
  { id: 'noc-27', name: 'Murcia', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2020, endYear: 2030, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-02-01' },
  { id: 'noc-28', name: 'Pontevedra', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2013, endYear: 2023, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-08-05' },
  { id: 'noc-29', name: 'Pulupandan', province: 'Negros Occidental', clupStatus: 'for-updating', yearApproved: 2014, endYear: 2024, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-11-10' },
  { id: 'noc-30', name: 'San Enrique', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2017, endYear: 2027, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2025-12-01' },
  { id: 'noc-31', name: 'Toboso', province: 'Negros Occidental', clupStatus: 'no-clup', yearApproved: null, endYear: null, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-02-15' },
  { id: 'noc-32', name: 'Valladolid', province: 'Negros Occidental', clupStatus: 'updated', yearApproved: 2019, endYear: 2029, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-01-22' },

  // ===== NEGROS ORIENTAL - CITIES =====
  { id: 'nor-01', name: 'Dumaguete City', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2021, endYear: 2031, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-02-15' },
  { id: 'nor-02', name: 'Bais City', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2019, endYear: 2029, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-01-20' },
  { id: 'nor-03', name: 'Bayawan City', province: 'Negros Oriental', clupStatus: 'for-updating', yearApproved: 2012, endYear: 2022, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-09-10' },
  { id: 'nor-04', name: 'Canlaon City', province: 'Negros Oriental', clupStatus: 'for-updating', yearApproved: 2010, endYear: 2020, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-08-01' },
  { id: 'nor-05', name: 'Guihulngan City', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2018, endYear: 2028, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-01-05' },
  { id: 'nor-06', name: 'Tanjay City', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2020, endYear: 2030, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-02-08' },

  // ===== NEGROS ORIENTAL - MUNICIPALITIES =====
  { id: 'nor-07', name: 'Amlan', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2019, endYear: 2029, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-01-12' },
  { id: 'nor-08', name: 'Ayungon', province: 'Negros Oriental', clupStatus: 'for-updating', yearApproved: 2013, endYear: 2023, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-10-20' },
  { id: 'nor-09', name: 'Bacong', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2021, endYear: 2031, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-02-01' },
  { id: 'nor-10', name: 'Basay', province: 'Negros Oriental', clupStatus: 'no-clup', yearApproved: null, endYear: null, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-04-15' },
  { id: 'nor-11', name: 'Bindoy', province: 'Negros Oriental', clupStatus: 'for-updating', yearApproved: 2011, endYear: 2021, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-07-20' },
  { id: 'nor-12', name: 'Dauin', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2020, endYear: 2030, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-01-28' },
  { id: 'nor-13', name: 'Jimalalud', province: 'Negros Oriental', clupStatus: 'for-updating', yearApproved: 2009, endYear: 2019, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-06-10' },
  { id: 'nor-14', name: 'La Libertad', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2018, endYear: 2028, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2025-12-10' },
  { id: 'nor-15', name: 'Mabinay', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2019, endYear: 2029, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-01-15' },
  { id: 'nor-16', name: 'Manjuyod', province: 'Negros Oriental', clupStatus: 'for-updating', yearApproved: 2014, endYear: 2024, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-11-05' },
  { id: 'nor-17', name: 'Pamplona', province: 'Negros Oriental', clupStatus: 'no-clup', yearApproved: null, endYear: null, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-03-20' },
  { id: 'nor-18', name: 'San Jose', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2017, endYear: 2027, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2025-11-28' },
  { id: 'nor-19', name: 'Santa Catalina', province: 'Negros Oriental', clupStatus: 'for-updating', yearApproved: 2012, endYear: 2022, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-09-25' },
  { id: 'nor-20', name: 'Siaton', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2020, endYear: 2030, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-02-12' },
  { id: 'nor-21', name: 'Sibulan', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2021, endYear: 2031, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-02-18' },
  { id: 'nor-22', name: 'Tayasan', province: 'Negros Oriental', clupStatus: 'no-clup', yearApproved: null, endYear: null, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-05-10' },
  { id: 'nor-23', name: 'Valencia', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2019, endYear: 2029, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-01-22' },
  { id: 'nor-24', name: 'Vallehermoso', province: 'Negros Oriental', clupStatus: 'for-updating', yearApproved: 2010, endYear: 2020, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-08-15' },
  { id: 'nor-25', name: 'Zamboanguita', province: 'Negros Oriental', clupStatus: 'updated', yearApproved: 2018, endYear: 2028, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2025-12-22' },

  // ===== SIQUIJOR =====
  { id: 'siq-01', name: 'Siquijor', province: 'Siquijor', clupStatus: 'updated', yearApproved: 2020, endYear: 2030, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2026-02-05' },
  { id: 'siq-02', name: 'Enrique Villanueva', province: 'Siquijor', clupStatus: 'for-updating', yearApproved: 2013, endYear: 2023, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-10-10' },
  { id: 'siq-03', name: 'Larena', province: 'Siquijor', clupStatus: 'updated', yearApproved: 2019, endYear: 2029, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-01-18' },
  { id: 'siq-04', name: 'Lazi', province: 'Siquijor', clupStatus: 'updated', yearApproved: 2018, endYear: 2028, riskInformed: true, integratedShelterPlan: true, lastUpdate: '2025-12-28' },
  { id: 'siq-05', name: 'Maria', province: 'Siquijor', clupStatus: 'no-clup', yearApproved: null, endYear: null, riskInformed: false, integratedShelterPlan: false, lastUpdate: '2025-06-01' },
  { id: 'siq-06', name: 'San Juan', province: 'Siquijor', clupStatus: 'updated', yearApproved: 2021, endYear: 2031, riskInformed: true, integratedShelterPlan: false, lastUpdate: '2026-02-20' },
];

// Province list
export const provinces = ['Negros Occidental', 'Negros Oriental', 'Siquijor'];

// Compute statistics from data
export function computeStats(municipalities: Municipality[]) {
  const updated = municipalities.filter(m => m.clupStatus === 'updated').length;
  const forUpdating = municipalities.filter(m => m.clupStatus === 'for-updating').length;
  const noClup = municipalities.filter(m => m.clupStatus === 'no-clup').length;
  const expired = municipalities.filter(m => m.clupStatus === 'expired').length;
  const riskInformed = municipalities.filter(m => m.riskInformed).length;
  const notRiskInformed = municipalities.length - riskInformed;
  const integrated = municipalities.filter(m => m.integratedShelterPlan).length;
  const notIntegrated = municipalities.length - integrated;

  return {
    total: municipalities.length,
    updated,
    forUpdating,
    noClup,
    expired,
    riskInformed,
    notRiskInformed,
    integrated,
    notIntegrated,
  };
}

// GeoJSON-like coordinates for NIR municipalities (approximate centroids for map display)
export const municipalityCoordinates: Record<string, [number, number]> = {
  // Negros Occidental Cities
  'Bacolod City': [10.6840, 122.9570],
  'Bago City': [10.5383, 122.8367],
  'Cadiz City': [10.9500, 123.3083],
  'Escalante City': [10.8400, 123.5000],
  'Himamaylan City': [10.1000, 122.8700],
  'Kabankalan City': [9.5833, 122.8167],
  'La Carlota City': [10.4167, 122.9167],
  'Sagay City': [10.8944, 123.4239],
  'San Carlos City': [10.4933, 123.4100],
  'Silay City': [10.8117, 122.9700],
  'Sipalay City': [9.7500, 122.4000],
  'Talisay City': [10.7383, 122.9683],
  'Victorias City': [10.9000, 123.1000],
  // Negros Occidental Municipalities
  'Binalbagan': [10.1944, 122.8611],
  'Calatrava': [10.6167, 123.4833],
  'Candoni': [9.8167, 122.6000],
  'Cauayan': [9.8333, 122.7167],
  'Don Salvador Benedicto': [10.6000, 123.1333],
  'Enrique B. Magalona': [10.8500, 123.0167],
  'Hinigaran': [10.2667, 122.8500],
  'Hinoba-an': [9.5833, 122.5000],
  'Ilog': [10.0167, 122.7667],
  'Isabela': [9.9500, 122.5500],
  'La Castellana': [10.3333, 122.9333],
  'Manapla': [10.9500, 123.1167],
  'Moises Padilla': [10.2833, 122.9500],
  'Murcia': [10.6000, 122.9000],
  'Pulupandan': [10.5167, 122.8000],
  'San Enrique': [10.4167, 122.8500],
  'Toboso': [10.7000, 123.5167],
  'Valladolid': [10.4667, 122.8333],
  // Negros Oriental Cities
  'Dumaguete City': [9.3068, 123.3085],
  'Bais City': [9.5916, 123.1216],
  'Bayawan City': [9.3632, 122.8017],
  'Canlaon City': [10.3833, 123.2000],
  'Guihulngan City': [10.1167, 123.2733],
  'Tanjay City': [9.5167, 123.1583],
  // Negros Oriental Municipalities
  'Amlan': [9.2333, 123.2833],
  'Ayungon': [9.8667, 123.1500],
  'Bacong': [9.2500, 123.3000],
  'Basay': [9.4500, 123.3833],
  'Bindoy': [9.7500, 123.1667],
  'Dauin': [9.1917, 123.2700],
  'Jimalalud': [9.9833, 123.2167],
  'La Libertad': [9.9500, 123.2167],
  'Mabinay': [9.7167, 123.0167],
  'Manjuyod': [9.6833, 123.1500],
  'Pamplona': [9.4833, 123.3500],
  'San Jose': [9.4167, 123.0500],
  'Santa Catalina': [9.3667, 122.8550],
  'Siaton': [9.0667, 123.0333],
  'Sibulan': [9.3500, 123.2833],
  'Tayasan': [9.9167, 123.1500],
  'Valencia': [9.2833, 123.2333],
  'Vallehermoso': [10.3167, 123.3167],
  'Zamboanguita': [9.1000, 123.1833],
  // Siquijor
  'Siquijor': [9.2150, 123.5083],
  'Enrique Villanueva': [9.2500, 123.5667],
  'Larena': [9.2500, 123.5833],
  'Lazi': [9.1833, 123.6167],
  'Maria': [9.2000, 123.5333],
  'San Juan': [9.1667, 123.5000],
};
