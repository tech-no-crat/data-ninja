import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/Dashboard/Dashboard.jsx";

import {
  Extension,
  AttachMoney
} from "@material-ui/icons";

const dashboardRoutes = [
  {
    path: "/projects",
    sidebarName: "Projects",
    navbarName: "Projects",
    icon: Extension,
    component: DashboardPage
  },
  {
    path: "/pricing",
    sidebarName: "Pricing",
    navbarName: "Pricing",
    icon: AttachMoney,
    component: UserProfile
  },
  { redirect: true, path: "/", to: "/projects", navbarName: "Redirect" }
];

export default dashboardRoutes;
