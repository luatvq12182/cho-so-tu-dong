import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Domain from "./pages/Domain";
import Layout from "./components/Layout";
import LoaiSoiCau from "./pages/LoaiSoiCau";
import ChoSoHangNgay from "./pages/ChoSoHangNgay";
import SignIn from "./pages/SignIn";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "loai-soi-cau",
                element: <LoaiSoiCau />,
            },
            {
                path: "domains",
                element: <Domain />,
            },
            {
                path: "cho-so-hang-ngay",
                element: <ChoSoHangNgay />,
            },
        ],
    },
    {
        path: "/sign-in",
        element: <SignIn />,
    },
    {
        path: "*",
        element: <h1>404</h1>,
    },
]);

const App = () => {
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
};

export default App;
