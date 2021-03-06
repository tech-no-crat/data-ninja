import ProjectsPage from "views/Projects/Projects.jsx";
import ModelsPage from "views/Models/Models.jsx";

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
    component: ProjectsPage
  },
  {
    path: "/pricing",
    sidebarName: "Pricing",
    navbarName: "Pricing",
    icon: AttachMoney,
    component: ProjectsPage
  },
  {
    path: "/models/:id",
    sidebarName: "Models",
    navbarName: "Models",
    icon: AttachMoney,
    component: ModelsPage,
    hidden: true,
  },
  { redirect: true, path: "/", to: "/projects", navbarName: "Models" }
];

export default dashboardRoutes;
