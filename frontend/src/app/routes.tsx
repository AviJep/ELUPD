import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./pages/Dashboard";
import { Statistics } from "./pages/Statistics";
import { ComplianceMonitoring } from "./pages/ComplianceMonitoring";
import { ClupProgress } from "./pages/ClupProgress";
import { PdpfpMonitoring } from "./pages/PdpfpMonitoring";
import { DefinitionStatus } from "./pages/DefinitionStatus";
import { SystemLogs } from "./pages/SystemLogs";
import { ArchiveCenter } from "./pages/ArchiveCenter";
import { About } from "./pages/About";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "statistics", Component: Statistics },
      { path: "compliance", Component: ComplianceMonitoring },
      { path: "clup-progress", Component: ClupProgress },
      { path: "pdpfp", Component: PdpfpMonitoring },
      { path: "definition-status", Component: DefinitionStatus },
      { path: "archives", Component: ArchiveCenter },
      { path: "logs", Component: SystemLogs },
      { path: "about", Component: About },
    ],
  },
]);
