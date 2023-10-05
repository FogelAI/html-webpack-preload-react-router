import { useRouteLoaderData, useParams } from "react-router-dom";

function Product() {
  let { productid } = useParams();
  let products = useRouteLoaderData("products");
  let product = products.products[productid - 1];

  return (
    <>
      <h2>Product:</h2>
      <p>
        <b>Title:</b> {product.title}
      </p>
      <p>
        <b>Description:</b> {product.description}
      </p>
      <p>
        <b>Price:</b> {product.price}
      </p>
    </>
  );
}

export default Product;
