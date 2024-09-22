import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import AppLayout from "./Layouts/AppLayout";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import ItemsPage from "./Pages/ItemsPage";
import CategoriesPage from "./Pages/CategoriesPage";
import OrdersPage from "./Pages/OrdersPage";
import SuppliersPage from "./Pages/SuppliersPage";
import { Toaster } from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const router = createBrowserRouter(
  [
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/items",
          element: <ItemsPage />,
        },
        {
          path: "/categories",
          element: <CategoriesPage />,
        },
        {
          path: "/orders",
          element: <OrdersPage />,
        },
        {
          path: "/suppliers",
          element: <SuppliersPage />,
        },
      ],
    },
  ],
  { basename: "/" }
);

function App() {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
      <Toaster />
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);
