import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Container, Nav, NavItem, Row } from "reactstrap";
import { verifyToken } from "../services";

const Layout = () => {
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const jwt_token = window.localStorage.getItem("jwt_token");

        if (!jwt_token) {
            window.location.href = "/sign-in";
        } else {
            (async () => {
                try {
                    await verifyToken();

                    setIsChecking(false);
                } catch (error) {
                    window.alert("Phiên đăng nhập đã hết hạn");

                    window.location.href = "/sign-in";
                }
            })();
        }
    }, []);

    if (isChecking) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Nav className="py-1 bg-dark">
                <NavItem>
                    <NavLink
                        className="nav-link text-white"
                        to="/domains"
                        active
                        href="#"
                    >
                        Domain
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="nav-link text-white" to="/loai-soi-cau">
                        Loại soi cầu
                    </NavLink>
                </NavItem>
                {/* <NavItem>
                    <NavLink className="nav-link" to="/cho-so-hang-ngay">
                        Cho số hàng ngày
                    </NavLink>
                </NavItem> */}
            </Nav>

            <Container className="mt-4">
                <Row>
                    <Outlet />
                </Row>
            </Container>
        </div>
    );
};

export default Layout;
