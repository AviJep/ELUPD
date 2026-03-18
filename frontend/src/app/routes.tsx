import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./pages/Dashboard";
import { Statistics } from "./pages/Statistics";
import { ComplianceMonitoring } from "./pages/ComplianceMonitoring";

import { SystemLogs } from "./pages/SystemLogs";
import { About } from "./pages/About";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "statistics", Component: Statistics },
      { path: "compliance", Component: ComplianceMonitoring },
      { path: "logs", Component: SystemLogs },
      { path: "about", Component: About },
    ],
  },
]);
