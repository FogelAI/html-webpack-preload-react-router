import { Suspense } from "react";
import { Link, Outlet, useRouteLoaderData } from "react-router-dom";

function Layout() {
  let links = useRouteLoaderData("links");
  return (
    <>
      <h1>With preloading async chunks example</h1>

      <p>
        This example demonstrates the network waterfall with using preloading
      </p>

      <nav>
        <ul>
          {links.map((link) => {
            return (
              <li>
                <Link to={link.path?.replace("/*", "")}>{link.linkText}</Link>
              </li>
            );
          })}
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
