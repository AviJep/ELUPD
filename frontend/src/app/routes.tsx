import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./pages/Dashboard";
import { MapIntelligence } from "./pages/MapIntelligence";
import { Statistics } from "./pages/Statistics";
import { ComplianceMonitoring } from "./pages/ComplianceMonitoring";
import { DataImportExport } from "./pages/DataImportExport";
import { ArchiveCenter } from "./pages/ArchiveCenter";
import { CRUDManagement } from "./pages/CRUDManagement";
import { SystemLogs } from "./pages/SystemLogs";
import { About } from "./pages/About";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "map-intelligence", Component: MapIntelligence },
      { path: "statistics", Component: Statistics },
      { path: "compliance", Component: ComplianceMonitoring },
      { path: "data-import-export", Component: DataImportExport },
      { path: "archive", Component: ArchiveCenter },
      { path: "crud", Component: CRUDManagement },
      { path: "logs", Component: SystemLogs },
      { path: "about", Component: About },
    ],
  },
]);
