import { lazy } from "react";
import Layout from "./Layout";
import { productsRoutes } from "./Products/products.route";

const Home = lazy(() => import(/* webpackChunkName: 'Home' */ "./Home/Home"));
const About = lazy(() =>
  import(/* webpackChunkName: 'About' */ "./About/About")
);

export const entryRoute = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "products/*",
        children: productsRoutes,
      },
    ],
  },
];
