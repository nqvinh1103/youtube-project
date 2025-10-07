import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Channel from "./pages/Channel/Channel";
import Homepage from "./pages/Homepage/Homepage";
import List from "./pages/List/List";
import Watch from "./pages/Video/Watch";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "/watch/:id", element: <Watch /> },
      { path: "/list", element: <List /> },
      { path: "/channel/:id", element: <Channel /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
