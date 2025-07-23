import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DirectoryView, Register, Login } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/folder/:dirId",
    element: <DirectoryView />,
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;