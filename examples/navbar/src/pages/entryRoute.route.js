import { lazy } from "react";
import Layout from "./Layout";
import { productsRoutes } from "./Products/products.route";

const Home = lazy(() => import(/* webpackChunkName: 'Home' */ "./Home/Home"));
const About = lazy(() =>
  import(/* webpackChunkName: 'About' */ "./About/About")
);

export const entryRoute = [
  {
    path: "",
    element: <Layout />,
    id: "links",
    loader: () => entryRoute[0].children,
    children: [
      {
        index: true,
        chunkName: "Home",
        linkText: "Home",
        element: <Home />,
      },
      {
        path: "about",
        chunkName: "About",
        linkText: "About",
        element: <About />,
      },
      {
        path: "products/*",
        linkText: "Products",
        children: productsRoutes,
      },
    ],
  },
];
