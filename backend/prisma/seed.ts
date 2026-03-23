import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

const prisma = new PrismaClient();

const NIR_PROVINCES = ['Negros Occidental', 'Negros Oriental', 'Siquijor'];

async function main() {
  console.log('🚀 Starting Seeding Process (NIR Dashboard)...');

  // Path to CSV files
  const dataDir = path.join(__dirname, '../data');
  const directoryPath = path.join(dataDir, 'CityMunicipality Directory.csv');
  const statusPath = path.join(dataDir, 'CLUPPDPFP status.csv');
  const housingPath = path.join(dataDir, 'HOUSING.csv');

  // 1. Parse CSVs
  const directoryData = parse(fs.readFileSync(directoryPath, 'utf-8'), { columns: true, skip_empty_lines: true });
  const statusData = parse(fs.readFileSync(statusPath, 'utf-8'), { columns: true, skip_empty_lines: true });
  const housingData = parse(fs.readFileSync(housingPath, 'utf-8'), { columns: true, skip_empty_lines: true });

  // 2. Clear Existing Data
  console.log('🧹 Clearing old data...');
  await prisma.housingProject.deleteMany();
  await prisma.pDPFPStatus.deleteMany();
  await prisma.cLUPProgress.deleteMany();
  await prisma.lGUDirectory.deleteMany();

  const lguMap = new Map<string, number>();

  // 3. Populate LGU Directory (Filtered for NIR)
  console.log('📍 Seeding LGU Directory...');
  for (const row of directoryData) {
    if (!NIR_PROVINCES.includes(row.province)) {
      console.log(`Skipping ${row.city_municipality} (Province: ${row.province} is not in NIR)`);
      continue;
    }

    const lgu = await prisma.lGUDirectory.create({
      data: {
        region: row.region,
        province: row.province,
        city_municipality: row.city_municipality,
        lgu_type: row.lgu_type,
        income_class: row.income_class,
        geo_json_id: row.geo_json_id || row.city_municipality.toLowerCase().replace(/ /g, '_'),
      },
    });
    lguMap.set(row.city_municipality, lgu.id);
  }

  // 4. Populate CLUP and PDPFP Progress
  console.log('📊 Seeding CLUP/PDPFP Statuses...');
  for (const row of statusData) {
    const lguId = lguMap.get(row.city_municipality);
    if (!lguId) continue;

    // Seeding CLUP Progress
    await prisma.cLUPProgress.create({
      data: {
        lgu_id: lguId,
        clup_status: row.clup_status || 'Not Determined',
        current_phase: row.current_phase || 'None Indicated',
      },
    });

    // Seeding PDPFP Status
    await prisma.pDPFPStatus.create({
      data: {
        lgu_id: lguId,
        latest_status: row.latest_status || 'No PDPFP',
        date_of_approval: row.date_of_approval ? new Date(row.date_of_approval) : null,
        year_adopted: row.year_adopted ? parseInt(row.year_adopted) : null,
        year_approved: row.year_approved ? parseInt(row.year_approved) : null,
        end_year: row.end_year ? parseInt(row.end_year) : null,
      },
    });
  }

  // 5. Populate Housing Projects
  console.log('🏠 Seeding Housing Projects...');
  for (const row of housingData) {
    const lguId = lguMap.get(row.city_municipality);
    if (!lguId) continue;

    await prisma.housingProject.create({
      data: {
        lgu_id: lguId,
        project_name: row.project_name,
        developer: row.developer || 'Unknown',
        project_type: row.project_type || 'N/A',
        status: row.status || 'Ongoing',
      },
    });
  }

  console.log('✅ Seeding complete! Database populated with NIR data.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
