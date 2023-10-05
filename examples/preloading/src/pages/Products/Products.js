import { Link, useLoaderData, Outlet } from "react-router-dom";

function Products() {
  const products = useLoaderData();
  return (
    <>
      <h2>Products</h2>
      <ul>
        {products.products.map((product) => {
          return (
            <li>
              <Link to={`/products/${product.id}`}>{product.title}</Link>
            </li>
          );
        })}
      </ul>
      <hr />
      <Outlet />
    </>
  );
}

export default Products;
