import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./pages/Dashboard";
import { MapIntelligence } from "./pages/MapIntelligence";
import { Statistics } from "./pages/Statistics";
import { ComplianceMonitoring } from "./pages/ComplianceMonitoring";
import { MunicipalityDirectory } from "./pages/MunicipalityDirectory";
import { ArchiveCenter } from "./pages/ArchiveCenter";
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
      { path: "directory", Component: MunicipalityDirectory },
      { path: "archive", Component: ArchiveCenter },
      { path: "logs", Component: SystemLogs },
      { path: "about", Component: About },
    ],
  },
]);
