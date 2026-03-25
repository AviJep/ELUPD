
  # ELUPD Dashboard Frontend

Modern React TypeScript dashboard for the Environmental and Land Use Planning and Development (ELUPD) system covering the Negros Island Region (NIR).

## Technology Stack

- **React 18** with TypeScript for type-safe components
- **Vite 6** for fast development and optimized production builds
- **Tailwind CSS 4** for utility-first styling
- **TanStack React Router** for SPA routing
- **Recharts** for statistical visualizations
- **Leaflet + GeoJSON** for interactive maps
- **Lucide React** for consistent iconography

## Project Structure

```
src/
├── app/
│   ├── components/        # Reusable UI components (tables, modals, cards)
│   ├── pages/            # Page components (Dashboard, Monitoring, Archive, etc.)
│   ├── styles/           # Global CSS and theme styles
│   ├── utils/            # Helper functions (CSV export, API calls, data mappers)
│   ├── data/             # Seed data and data utilities
│   ├── types/            # TypeScript interfaces and schemas
│   ├── DataContext.ts    # Log/event seed data context
│   ├── LGUContext.tsx    # Central state for LGU directory, archives, and logs
│   ├── routes.tsx        # Route configuration
│   └── App.tsx           # Root component
├── main.tsx              # Application entry point
└── vite-env.d.ts        # Vite type definitions
```

## Running Locally

### Prerequisites
- Node.js 18+ with npm installed
- Django backend running on `http://127.0.0.1:8000` (or configured in `.env`)

### Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create or update `.env`:
   ```bash
   VITE_DJANGO_API_BASE_URL=http://127.0.0.1:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Dashboard will be available at `http://127.0.0.1:5173`

### Build for Production

```bash
npm run build
```
Output: `dist/` folder with optimized assets ready for deployment.

## Key Features

### Dashboard Pages

| Page | Purpose |
|------|---------|
| **Dashboard** | Central hub with maps, CLUP/PDPFP tables, statistics |
| **CLUP Monitoring** | Municipal-level land use plan progress tracking |
| **PDPFP Monitoring** | Provincial development framework compliance |
| **Compliance Monitoring** | Excel-backed compliance verification |
| **Statistics** | System-wide KPIs and trend analysis |
| **Map Intelligence** | Interactive geospatial visualizations |
| **Archive Center** | Manage archived LGU records with restore/delete |
| **System Logs** | Audit trail with filtering and search |
| **About** | Platform information and tech stack |

### Core Components

- **Tables** (`ClupPdpfpTable`, `CityMunicipalityTable`, `PdpfpTable`)
  - Sortable columns, full-text search, province filtering
  - 20-row pagination with prev/next controls
  - View, Edit, Archive actions with modal details
  - CSV export functionality
  
- **Maps** (`RegionMap`, `NegrosIslandMap`, `NegrosProvincialMap`)
  - Color-coded by CLUP/PDPFP status
  - Municipality boundaries from GeoJSON
  - Interactive click-to-filter
  
- **Modals**
  - Full-detail record view showing all row fields
  - Normalized phase display (1/true → "true", 0/false → "false")
  - Archive/delete confirmations
  
- **Sidebar Navigation** (responsive: fixed on desktop, hamburger on mobile)
  - Links to all monitoring pages
  - Archive Center access
  - System logs and about sections

### State Management

**LGUContext** (`LGUContext.tsx`)
- Manages active LGUs fetched from Django annex endpoints
- Maintains `archivedLgus` collection (localStorage-backed)
- Provides `archiveLgu()`, `restoreLgu()`, `permanentlyDeleteLgu()` actions
- Logs all user actions (archive, restore, import, etc.)

**DataContext** (`DataContext.ts`)
- Seed log entries for System Logs page display
- Provides `useData()` hook for accessing logs

### Archive System

Archives are persistent across page refreshes:

```typescript
// Archive a record
const { archiveLgu } = useLgus();
archiveLgu(lguId); // Moves to archivedLgus, logs action

// View archived records
navigate("/archives"); // Archive Center page

// Restore from archive
const { restoreLgu } = useLgus();
restoreLgu(lguId); // Moves back to active, logs action

// Permanent deletion
const { permanentlyDeleteLgu } = useLgus();
permanentlyDeleteLgu(lguId); // Removes from archive, logs action
```

Archives are stored in browser localStorage under key `elupd_archived_lgus` and auto-synced.

## API Integration

### Endpoints Used

- `GET /api/annex-clup-status` - CLUP status data (Excel-backed)
- `GET /api/annex-pdpfp-status` - PDPFP status data (Excel-backed)
- Support for fallback URLs if configured differently

### Data Fetching

Use `fetchAnnexRows()` utility from `utils/annexApi.ts`:

```typescript
import { fetchAnnexRows } from "../utils/annexApi";
import type { AnnexClupRow } from "../data/annexData";

const clupRows = await fetchAnnexRows<AnnexClupRow>("annex-clup-status");
```

## CSS Architecture

- **`styles/theme.css`** - Color variables, semantic tokens, animations
- **`styles/fonts.css`** - Font-face definitions
- **`styles/index.css`** - Global resets and base styles
- **Tailwind v4** - Utility classes with custom color tokens (NIR blue: `#003087`)

**Note:** Tailwind v4 directive warnings (e.g., unknown at-rules) are suppressed via `.vscode/settings.json` and are benign.

## Building & Deployment

### Local Verification

```bash
npm run build  # Creates optimized dist/
npm run preview  # Serve dist/ locally before deployment
```

### Performance Notes

- **Chunk Sizing:** Warnings for packages >500KB are acceptable (Recharts, Leaflet); configure splitting if needed.
- **TypeScript:** No strict errors; all components are type-safe.
- **Build Time:** ~30 seconds on typical hardware.

## Common Tasks

### Add a New Monitoring Page
1. Create component in `src/app/pages/`
2. Add route in `src/app/routes.tsx`
3. Add sidebar nav item in `src/app/components/Sidebar.tsx`
4. Use `LGUContext` for data, `PageShell` for consistent layout

### Export Table Data
Tables include built-in CSV export via toolbar button:
```typescript
import { exportToCSV } from "../utils/csv-helper";
exportToCSV(data, `Filename_${date}.csv`);
```

### Add a New Archivable Table
1. Add `onArchive` callback prop to table component
2. In parent page, bind callback to `archiveLgu(id)` from `LGUContext`
3. Add confirmation dialog before calling archive
4. Test restore flow via Archive Center

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Yellow CSS squiggles | Already suppressed; see `.vscode/settings.json` |
| Archive disappears on refresh | Verify `elupd_archived_lgus` in browser localStorage |
| Maps not rendering | Confirm GeoJSON files in `frontend/public/` |
| API 404 errors | Check `.env` VITE_DJANGO_API_BASE_URL and backend running |
| Type errors | Run `npm run build` to validate; ensure all imports resolve |

## Contributing

- Follow existing component patterns (functional, TypeScript, hooks-based)
- Use Tailwind classes; avoid raw CSS unless necessary
- Add logs via `LGUContext.addLog()` for user actions
- Test archive flow end-to-end for new tables
  