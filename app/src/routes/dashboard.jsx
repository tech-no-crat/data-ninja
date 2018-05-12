import DashboardPage from "views/Dashboard/Dashboard.jsx";
import ModelsPage from "views/Models/Models.jsx";
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
  {
    path: "/models/:id",
    sidebarName: "Models",
    navbarName: "Models",
    icon: AttachMoney,
    component: ModelsPage,
    hidden: true,
  },
  { redirect: true, path: "/", to: "/projects", navbarName: "Redirect" }
];

export default dashboardRoutes;
