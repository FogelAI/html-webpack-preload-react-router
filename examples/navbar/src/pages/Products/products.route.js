import { lazy } from "react";

const Products = lazy(() =>
  import(/* webpackChunkName: 'Products' */ "./Products")
);
const Product = lazy(() =>
  import(/* webpackChunkName: 'Product' */ "./Product/Product")
);

export const productsRoutes = [
  {
    path: "",
    chunkName: "Products",
    id: "products",
    loader: () =>
      // https://dummyjson.com/docs/products
      fetch("https://dummyjson.com/products").then((res) => res.json()),
    element: <Products />,
    children: [
      {
        path: ":productid",
        chunkName: "Product",
        element: <Product />,
      },
    ],
    data: {
      url: "https://dummyjson.com/products",
      crossorigin: "anonymous",
    },
  },
];
