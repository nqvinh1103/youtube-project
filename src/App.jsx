import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import MainLayout from "./layouts/MainLayout";
import Channel from "./pages/Channel/Channel";
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
