import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <h1>Without preloading async chunks example</h1>

      <p>
        This example demonstrates the network waterfall without using preloading
      </p>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}

export default Layout;
