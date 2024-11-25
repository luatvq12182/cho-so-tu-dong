import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Domain from "./pages/Domain";
import Layout from "./components/Layout";
import LoaiSoiCau from "./pages/LoaiSoiCau";
import ChoSoHangNgay from "./pages/ChoSoHangNgay";
import SignIn from "./pages/SignIn";
import LogFiles from "./pages/LogFiles";
import LogFileContent from "./pages/LogFileContent";
import Expert from "./pages/Expert";
import UserTruyen from "./pages/UserTruyen";

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
                path: "user-truyen",
                element: <UserTruyen />,
            },
            {
                path: "chuyen-gia",
                element: <Expert />,
            },
            {
                path: "cho-so-hang-ngay",
                element: <ChoSoHangNgay />,
            },
            {
                path: "logs",
                element: <LogFiles />,
            },
            {
                path: "logs/:fileName",
                element: <LogFileContent />,
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
