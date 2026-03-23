import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./pages/Dashboard";
import { LguDirectory } from "./pages/LguDirectory";
import { ClupMonitoring } from "./pages/ClupMonitoring";
import { ClupProgress } from "./pages/ClupProgress";
import { PdpfpMonitoring } from "./pages/PdpfpMonitoring";
import { HousingMonitoring } from "./pages/HousingMonitoring";
import { Statistics } from "./pages/Statistics";
import { SystemLogs } from "./pages/SystemLogs";
import { About } from "./pages/About";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "directory", Component: LguDirectory },
      { path: "clup", Component: ClupMonitoring },
      { path: "clup-progress", Component: ClupProgress },
      { path: "pdpfp", Component: PdpfpMonitoring },
      { path: "housing", Component: HousingMonitoring },
      { path: "statistics", Component: Statistics },
      { path: "logs", Component: SystemLogs },
      { path: "about", Component: About },
    ],
  },
]);
