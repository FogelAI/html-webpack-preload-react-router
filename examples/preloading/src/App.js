import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { entryRoute } from "./pages/entryRoute.route";

const router = createBrowserRouter(entryRoute);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading</p>} />;
}
